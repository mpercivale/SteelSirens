
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locacion } from "@/types/game";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/i18n";
import { getGameFlags, getLocationSecretProgress } from "@/lib/progression";

interface Props {
  locations: Locacion[];
  lang?: Language;
}

const tipos = [
  { id: "all", label: "All" },
  { id: "region", label: "Regions" },
  { id: "secreto", label: "Secrets" },
];

type MainNode = {
  id: string;
  name: string;
  tipo: "region" | "mazmorra" | "secreto";
  x: number;
  y: number;
};

type EdgeCurve = {
  from: string;
  to: string;
  start: { x: number; y: number };
  control1: { x: number; y: number };
  control2: { x: number; y: number };
  end: { x: number; y: number };
  pathD: string;
  isSecretEdge: boolean;
};

const MAIN_LOCATION_NODES: MainNode[] = [
  { id: "03-00", name: "La Santa Sede", tipo: "region", x: 45, y: 80 },
  { id: "03-01", name: "El Gran Puente", tipo: "region", x: 30, y: 62.5 },
  { id: "03-02", name: "La Pradera", tipo: "region", x: 30, y: 40 },
  { id: "03-03", name: "Bosque Embrujado", tipo: "region", x: 35, y: 32 },
  { id: "03-04", name: "Villa Infestada", tipo: "region", x: 57, y: 28 },
  { id: "03-05", name: "Ruinas del Monasterio", tipo: "mazmorra", x: 63.5, y: 20 },
  { id: "03-06", name: "Mansión Auremont", tipo: "mazmorra", x: 70, y: 32.5 },
  { id: "03-05-1", name: "Mazmorras de la Mansión", tipo: "mazmorra", x: 67.5, y: 41 },
  { id: "03-05-2", name: "Alcantarillas", tipo: "mazmorra", x: 70.5, y: 49.5 },
  { id: "03-05-3", name: "Las Profundidades", tipo: "secreto", x: 74, y: 59.5 },
];

const MAIN_LOCATION_EDGES: Array<[string, string]> = [
  ["03-00", "03-01"],
  ["03-01", "03-02"],
  ["03-02", "03-03"],
  ["03-03", "03-04"],
  ["03-04", "03-05"],
  ["03-04", "03-06"],
  ["03-05", "03-05-1"],
  ["03-05-1", "03-06"],
  ["03-05-1", "03-05-2"],
  ["03-05-2", "03-05-3"],
];

const SECRET_EDGE_KEYS = new Set(["03-05->03-05-1"]);
const NODE_SOURCE_SLUG_BY_ID: Record<string, string | undefined> = {
  "03-00": "la-santa-sede",
  "03-01": "el-gran-puente",
  "03-02": "la-pradera",
  "03-03": "bosque-embrujado",
  "03-04": "villa-infestada",
  "03-05": "ruinas-del-monasterio",
  "03-06": "mansion-auremont",
  "03-05-1": "mazmorras-de-la-mansion",
  "03-05-2": "alcantarillas",
  "03-05-3": "las-profundidades",
};

const NODE_FALLBACK_DESCRIPTION_BY_ID: Record<string, string> = {
  "03-00": "Antiguo centro de fe donde aún se escuchan ecos de juramentos rotos.",
  "03-01": "Puente de tránsito obligado, vigilado por sombras y patrullas errantes.",
  "03-02": "Llanuras abiertas con ruinas dispersas y caminos ocultos entre la hierba.",
  "03-03": "Bosque denso con senderos cambiantes y presencias hostiles al anochecer.",
  "03-04": "Asentamiento corrompido donde cada callejón guarda una emboscada.",
  "03-05": "Ruinas sagradas tomadas por cultos y criaturas del crepúsculo.",
  "03-06": "Residencia noble en decadencia, convertida en fortaleza hostil.",
};

const NODE_SECRET_SLOT_COUNT_BY_ID: Record<string, number> = {
  "03-00": 4,
  "03-01": 3,
  "03-02": 4,
  "03-03": 5,
  "03-04": 4,
  "03-05": 5,
  "03-06": 5,
};

const MAP_PLACEHOLDER_SRC = "/images/maps/elden-ring-placeholder.png";
const REST_PIN_ICON_SRC = "/images/maps/rest-site-pin.svg";
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1400;
const DEFAULT_SCALE = 1;
const MAP_TILT_X_DEG = 40;
const MAP_TILT_Z_DEG = -1.8;
const HOVER_REEL_DELAY_MS = 900;
const HOVER_REEL_INTERVAL_MS = 1800;
const TRAVEL_MOVE_DURATION_MS = 1200;
const TRAVELER_NODE_STORAGE_KEY = "steel_sirens_traveler_node_id";
const FORCED_TRAVEL_EVENTS_STORAGE_KEY = "steel_sirens_forced_travel_events_seen";
const INITIAL_TRAVELER_NODE_ID = "03-00";
const TRAVEL_ANOMALY_CHANCE = 0.15;

const getNodePositionById = (nodeId: string) => {
  const node = MAIN_LOCATION_NODES.find((value) => value.id === nodeId);
  if (!node) {
    return null;
  }
  return { x: node.x, y: node.y };
};

export default function LocationsExplorer({ locations, lang = "en" }: Props) {
  const [activeTipo, setActiveTipo] = useState("all");
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1, height: 1 });
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [isReelActive, setIsReelActive] = useState(false);
  const [locationSecretProgress, setLocationSecretProgress] = useState<Record<string, number>>({});
  const [gameFlags, setGameFlags] = useState<Record<string, boolean>>({});
  const [travelerNodeId, setTravelerNodeId] = useState(INITIAL_TRAVELER_NODE_ID);
  const [travelerPosition, setTravelerPosition] = useState(() => getNodePositionById(INITIAL_TRAVELER_NODE_ID) ?? { x: 45, y: 80 });
  const [travelAnomaly, setTravelAnomaly] = useState<string | null>(null);
  const [isTravelerMoving, setIsTravelerMoving] = useState(false);
  const [activeNodePopupId, setActiveNodePopupId] = useState<string | null>(null);
  const [activeTravelBanner, setActiveTravelBanner] = useState<{ title: string; detail: string } | null>(null);
  const [pendingTravelNodeId, setPendingTravelNodeId] = useState<string | null>(null);
  const [seenForcedTravelEvents, setSeenForcedTravelEvents] = useState<string[]>([]);
  const travelTimersRef = useRef<number[]>([]);
  const travelAnimationFrameRef = useRef<number | null>(null);

  const unlockedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    if (gameFlags.unlock_monastery_secret) {
      ids.add("03-05-1");
    }
    if (gameFlags.unlock_sewers) {
      ids.add("03-05-2");
    }
    if (gameFlags.unlock_depths) {
      ids.add("03-05-3");
    }
    return ids;
  }, [gameFlags]);

  const filtered = useMemo(
    () =>
      MAIN_LOCATION_NODES.filter(
        (node) => activeTipo === "all" || node.tipo === activeTipo
      ),
    [activeTipo]
  );

  const nodePositions = useMemo(
    () =>
      filtered.filter((node) => {
        if (node.id === "03-05-1" || node.id === "03-05-2" || node.id === "03-05-3") {
          return unlockedNodeIds.has(node.id);
        }
        return true;
      }),
    [filtered, unlockedNodeIds]
  );

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(nodePositions.map((node) => node.id));
    return MAIN_LOCATION_EDGES.filter(
      ([from, to]) => visibleNodeIds.has(from) && visibleNodeIds.has(to)
    );
  }, [nodePositions]);

  const edgeCurves = useMemo(() => {
    const visibleNodesById = nodePositions.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    return visibleEdges.reduce<EdgeCurve[]>((acc, [from, to], index) => {
      const fromNode = visibleNodesById[from];
      const toNode = visibleNodesById[to];
      if (!fromNode || !toNode) {
        return acc;
      }

      const isSecretEdge = SECRET_EDGE_KEYS.has(`${from}->${to}`) || SECRET_EDGE_KEYS.has(`${to}->${from}`);
      const controlOffset = index % 2 === 0 ? -8 : 8;
      const c1x = fromNode.x + (toNode.x - fromNode.x) * 0.8;
      const c1y = fromNode.y + controlOffset;
      const c2x = fromNode.x + (toNode.x - fromNode.x) * 0.75;
      const c2y = toNode.y - controlOffset;
      const pathD = `M ${fromNode.x} ${fromNode.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toNode.x} ${toNode.y}`;

      acc.push({
        from,
        to,
        start: { x: fromNode.x, y: fromNode.y },
        control1: { x: c1x, y: c1y },
        control2: { x: c2x, y: c2y },
        end: { x: toNode.x, y: toNode.y },
        pathD,
        isSecretEdge,
      });

      return acc;
    }, []);
  }, [visibleEdges, nodePositions]);

  const edgeCurveByKey = useMemo(() => {
    return edgeCurves.reduce<Record<string, EdgeCurve>>((acc, curve) => {
      acc[`${curve.from}::${curve.to}`] = curve;
      return acc;
    }, {});
  }, [edgeCurves]);

  const nodesById = useMemo(() => {
    return nodePositions.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [nodePositions]);

  const allNodesById = useMemo(() => {
    return MAIN_LOCATION_NODES.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, []);

  const travelAccessibleNodeIds = useMemo(() => {
    return MAIN_LOCATION_NODES.filter((node) => {
      if (node.id === "03-05-1") {
        return Boolean(gameFlags.unlock_monastery_secret);
      }
      if (node.id === "03-05-2") {
        return Boolean(gameFlags.unlock_sewers);
      }
      if (node.id === "03-05-3") {
        return Boolean(gameFlags.unlock_depths);
      }
      return true;
    }).map((node) => node.id);
  }, [gameFlags]);

  const travelAccessibleNodeIdSet = useMemo(() => new Set(travelAccessibleNodeIds), [travelAccessibleNodeIds]);

  const travelerNode = allNodesById[travelerNodeId] ?? allNodesById[travelAccessibleNodeIds[0] ?? "03-00"];
  const activePopupNode = activeNodePopupId ? allNodesById[activeNodePopupId] : null;

  const nodeMetaById = useMemo(() => {
    return MAIN_LOCATION_NODES.reduce<Record<string, { description: string; previewImages: string[] }>>((acc, node) => {
      const sourceSlug = NODE_SOURCE_SLUG_BY_ID[node.id];
      const source = sourceSlug ? locations.find((location) => location.slug === sourceSlug) : undefined;

      const previewImages = Array.from(
        new Set(
          [
            source?.imagen_url,
            source?.mapImageUrl,
            source?.imageUrl,
            MAP_PLACEHOLDER_SRC,
          ].filter((value): value is string => Boolean(value))
        )
      );

      acc[node.id] = {
        description:
          source?.descripcion_corta ||
          source?.shortDescription ||
          NODE_FALLBACK_DESCRIPTION_BY_ID[node.id] ||
          "Zona en conflicto con actividad hostil registrada.",
        previewImages,
      };

      return acc;
    }, {});
  }, [locations]);

  const hoveredNodeImages = hoveredNodeId ? (nodeMetaById[hoveredNodeId]?.previewImages ?? []) : [];

  const getLocationProgressKey = (nodeId: string) => NODE_SOURCE_SLUG_BY_ID[nodeId] ?? nodeId;

  const getUnlockedPreviewImages = (nodeId: string): string[] => {
    const meta = nodeMetaById[nodeId];
    if (!meta) {
      return [MAP_PLACEHOLDER_SRC];
    }

    const slotCount = Math.max(1, NODE_SECRET_SLOT_COUNT_BY_ID[nodeId] ?? meta.previewImages.length ?? 1);
    const foundSecrets = locationSecretProgress[getLocationProgressKey(nodeId)] ?? 0;
    const unlockedCount = Math.min(
      Math.max(1, 1 + foundSecrets),
      Math.max(1, meta.previewImages.length, slotCount)
    );

    const source = meta.previewImages.length > 0 ? meta.previewImages : [MAP_PLACEHOLDER_SRC];
    const expanded = Array.from({ length: Math.max(unlockedCount, source.length) }, (_, index) => source[index % source.length]);

    return expanded.slice(0, unlockedCount);
  };

  const getSecretSlots = (nodeId: string) => {
    const slotCount = Math.max(1, NODE_SECRET_SLOT_COUNT_BY_ID[nodeId] ?? 3);
    const foundSecrets = Math.min(slotCount, locationSecretProgress[getLocationProgressKey(nodeId)] ?? 0);
    return { slotCount, foundSecrets };
  };

  const hoveredUnlockedImages = hoveredNodeId ? getUnlockedPreviewImages(hoveredNodeId) : hoveredNodeImages;
  const hasSeedLocations = locations.length > 0;

  const labels =
    lang === "es"
      ? {
          mapTitle: "Mapa de nodos (ejemplo)",
          mapHint: "Ruta principal con Monasterio y Mansión visibles. Niveles subterráneos ocultos.",
          blocked: "bloqueada",
          empty: "No hay nodos para este filtro.",
          resetView: "Reiniciar vista",
          routeState: "Ubicación actual",
          anomalyNone: "El camino está en calma. No hay anomalías detectadas.",
          close: "Cerrar",
          routeEventTitle: "Anomalía en ruta",
          forcedEventTitle: "Evento clave",
          continueExploration: "Haz click para continuar",
        }
      : lang === "ja"
      ? {
          mapTitle: "ノードマップ（サンプル）",
          mapHint: "修道院とオーレモント邸は表示し、地下階層は非表示にしています。",
          blocked: "封印中",
          empty: "このフィルターではノードがありません。",
          resetView: "表示をリセット",
          routeState: "現在位置",
          anomalyNone: "経路は静穏。異常は検出されません。",
          close: "閉じる",
          routeEventTitle: "経路異常",
          forcedEventTitle: "重要イベント",
          continueExploration: "クリックして続行",
        }
      : {
          mapTitle: "Node Map (Example)",
          mapHint: "Main route includes Monastery and Auremont Mansion; subterranean levels remain hidden.",
          blocked: "blocked",
          empty: "No nodes for this filter.",
          resetView: "Reset view",
          routeState: "Current route",
          anomalyNone: "Path is calm. No anomalies detected.",
          close: "Close",
          routeEventTitle: "Route anomaly",
          forcedEventTitle: "Key event",
          continueExploration: "Click to continue",
        };

  const anomalyPool =
    lang === "es"
      ? [
          "Una campana lejana suena bajo tierra, pero no hay templo cercano.",
          "La niebla se abre y deja marcas de arrastre en el camino.",
          "Sombras cruzan la ruta en dirección contraria al viento.",
          "El suelo vibra y luego queda en silencio absoluto.",
        ]
      : lang === "ja"
      ? [
          "地下から鐘の残響が届くが、近くに聖堂はない。",
          "霧が割れ、地面に引きずった痕だけが残る。",
          "風向きと逆に影が道を横切る。",
          "地面が震えた直後、完全な静寂が訪れる。",
        ]
      : [
          "A distant bell tolls underground, though no temple is nearby.",
          "Mist parts and reveals drag marks along the road.",
          "Shadows cross the path against the wind direction.",
          "The ground trembles, then drops into complete silence.",
        ];

  const forcedAnomalyByEdgeKey =
    lang === "es"
      ? {
          "03-02::03-03": "Un coro sin cuerpo te obliga a detenerte antes del Bosque Embrujado.",
          "03-05::03-05-1": "Bajo los escombros del monasterio cede un sello y aparece un descenso oculto.",
        }
      : lang === "ja"
      ? {
          "03-02::03-03": "呪われた森の手前で、姿なき聖歌が進路を止める。",
          "03-05::03-05-1": "修道院の瓦礫の下で封印が崩れ、隠された降路が現れる。",
        }
      : {
          "03-02::03-03": "A bodiless chorus halts your march before the Haunted Forest.",
          "03-05::03-05-1": "A buried seal breaks under the monastery, revealing a hidden descent.",
        };

  const getEdgeEventKey = (fromNodeId: string, toNodeId: string) => {
    return [fromNodeId, toNodeId].sort().join("::");
  };

  const triggerTravelEvent = (fromNodeId: string, toNodeId: string) => {
    const edgeEventKey = getEdgeEventKey(fromNodeId, toNodeId);
    const fromNodeName = allNodesById[fromNodeId]?.name ?? fromNodeId;
    const toNodeName = allNodesById[toNodeId]?.name ?? toNodeId;

    const forcedEventText = forcedAnomalyByEdgeKey[edgeEventKey as keyof typeof forcedAnomalyByEdgeKey];
    const shouldTriggerForced = Boolean(forcedEventText) && !seenForcedTravelEvents.includes(edgeEventKey);

    if (shouldTriggerForced) {
      const detail = `${fromNodeName} → ${toNodeName}: ${forcedEventText}`;
      setTravelAnomaly(detail);
      setSeenForcedTravelEvents((current) => Array.from(new Set([...current, edgeEventKey])));
      return { title: labels.forcedEventTitle, detail };
    }

    if (Math.random() < TRAVEL_ANOMALY_CHANCE) {
      const anomalyText = anomalyPool[Math.floor(Math.random() * anomalyPool.length)];
      const detail = `${fromNodeName} → ${toNodeName}: ${anomalyText}`;
      setTravelAnomaly(detail);
      return { title: labels.routeEventTitle, detail };
    }

    setTravelAnomaly(null);
    return null;
  };

  const clearTravelTimers = () => {
    if (travelTimersRef.current.length === 0) {
      return;
    }

    travelTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    travelTimersRef.current = [];

    if (travelAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(travelAnimationFrameRef.current);
      travelAnimationFrameRef.current = null;
    }
  };

  const queueTravelTimer = (callback: () => void, delay: number) => {
    const timerId = window.setTimeout(callback, delay);
    travelTimersRef.current.push(timerId);
    return timerId;
  };

  const playAnomalySound = () => {
    if (typeof window === "undefined") {
      return;
    }

    const audioWindow = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const Context = window.AudioContext ?? audioWindow.webkitAudioContext;

    if (!Context) {
      return;
    }

    try {
      const context = new Context();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(196, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(132, context.currentTime + 0.42);

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.46);

      const closeTimer = window.setTimeout(() => {
        context.close().catch(() => undefined);
      }, 550);
      travelTimersRef.current.push(closeTimer);
    } catch {
      // ignore audio errors
    }
  };

  const getBezierPointAt = (curve: EdgeCurve, t: number) => {
    const oneMinusT = 1 - t;
    const x =
      oneMinusT * oneMinusT * oneMinusT * curve.start.x +
      3 * oneMinusT * oneMinusT * t * curve.control1.x +
      3 * oneMinusT * t * t * curve.control2.x +
      t * t * t * curve.end.x;
    const y =
      oneMinusT * oneMinusT * oneMinusT * curve.start.y +
      3 * oneMinusT * oneMinusT * t * curve.control1.y +
      3 * oneMinusT * t * t * curve.control2.y +
      t * t * t * curve.end.y;
    return { x, y };
  };

  const getTravelCurve = (fromNodeId: string, toNodeId: string): EdgeCurve | null => {
    const direct = edgeCurveByKey[`${fromNodeId}::${toNodeId}`];
    if (direct) {
      return direct;
    }

    const reverse = edgeCurveByKey[`${toNodeId}::${fromNodeId}`];
    if (reverse) {
      return {
        from: fromNodeId,
        to: toNodeId,
        start: reverse.end,
        control1: reverse.control2,
        control2: reverse.control1,
        end: reverse.start,
        pathD: reverse.pathD,
        isSecretEdge: reverse.isSecretEdge,
      };
    }

    const fromNode = allNodesById[fromNodeId];
    const toNode = allNodesById[toNodeId];
    if (!fromNode || !toNode) {
      return null;
    }

    return {
      from: fromNodeId,
      to: toNodeId,
      start: { x: fromNode.x, y: fromNode.y },
      control1: { x: fromNode.x + (toNode.x - fromNode.x) * 0.33, y: fromNode.y + (toNode.y - fromNode.y) * 0.33 },
      control2: { x: fromNode.x + (toNode.x - fromNode.x) * 0.66, y: fromNode.y + (toNode.y - fromNode.y) * 0.66 },
      end: { x: toNode.x, y: toNode.y },
      pathD: "",
      isSecretEdge: false,
    };
  };

  const animateTravelerOnCurve = (
    curve: EdgeCurve,
    fromT: number,
    toT: number,
    duration: number,
    onComplete: () => void
  ) => {
    if (typeof window === "undefined") {
      setTravelerPosition(getBezierPointAt(curve, toT));
      onComplete();
      return;
    }

    if (travelAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(travelAnimationFrameRef.current);
      travelAnimationFrameRef.current = null;
    }

    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / Math.max(1, duration));
      const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      const t = fromT + (toT - fromT) * easedProgress;
      setTravelerPosition(getBezierPointAt(curve, t));

      if (progress >= 1) {
        travelAnimationFrameRef.current = null;
        onComplete();
        return;
      }

      travelAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    travelAnimationFrameRef.current = window.requestAnimationFrame(tick);
  };

  const continuePendingTravel = () => {
    if (!pendingTravelNodeId) {
      return;
    }

    const targetNode = allNodesById[pendingTravelNodeId];
    if (!targetNode) {
      setPendingTravelNodeId(null);
      setActiveTravelBanner(null);
      setIsTravelerMoving(false);
      return;
    }

    const curve = getTravelCurve(travelerNodeId, pendingTravelNodeId);
    if (!curve) {
      setActiveTravelBanner(null);
      setTravelerPosition({ x: targetNode.x, y: targetNode.y });

      queueTravelTimer(() => {
        setTravelerNodeId(pendingTravelNodeId);
        setPendingTravelNodeId(null);
        setIsTravelerMoving(false);
        setActiveNodePopupId(targetNode.id);
      }, TRAVEL_MOVE_DURATION_MS);
      return;
    }

    setActiveTravelBanner(null);
    animateTravelerOnCurve(curve, 0.5, 1, TRAVEL_MOVE_DURATION_MS, () => {
      setTravelerNodeId(pendingTravelNodeId);
      setPendingTravelNodeId(null);
      setIsTravelerMoving(false);
      setActiveNodePopupId(targetNode.id);
    });
  };

  const isAdjacentTravelNode = (targetNodeId: string) => {
    if (!travelAccessibleNodeIdSet.has(travelerNodeId) || !travelAccessibleNodeIdSet.has(targetNodeId)) {
      return false;
    }

    return MAIN_LOCATION_EDGES.some(
      ([from, to]) =>
        (from === travelerNodeId && to === targetNodeId) ||
        (from === targetNodeId && to === travelerNodeId)
    );
  };

  const clampOffset = (nextOffset: { x: number; y: number }, nextScale: number) => {
    const scaledWidth = WORLD_WIDTH * nextScale;
    const scaledHeight = WORLD_HEIGHT * nextScale;
    const { width: viewportWidth, height: viewportHeight } = viewportSize;

    const minX = Math.min(0, viewportWidth - scaledWidth);
    const minY = Math.min(0, viewportHeight - scaledHeight);
    const maxX = scaledWidth <= viewportWidth ? (viewportWidth - scaledWidth) / 2 : 0;
    const maxY = scaledHeight <= viewportHeight ? (viewportHeight - scaledHeight) / 2 : 0;

    return {
      x: Math.min(maxX, Math.max(minX, nextOffset.x)),
      y: Math.min(maxY, Math.max(minY, nextOffset.y)),
    };
  };

  useEffect(() => {
    const updateViewport = () => {
      if (!viewportRef.current) {
        return;
      }

      const rect = viewportRef.current.getBoundingClientRect();
      const nextViewport = {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };

      setViewportSize(nextViewport);
      setOffset((current) => clampOffset(current, scale));
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [scale]);

  useEffect(() => {
    setOffset((current) => clampOffset(current, scale));
  }, [viewportSize, scale]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((current) => {
      const nextScale = Math.max(0.8, Math.min(2.6, current + delta));
      setOffset((currentOffset) => clampOffset(currentOffset, nextScale));
      return nextScale;
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const nextOffset = { x: event.clientX - dragStart.x, y: event.clientY - dragStart.y };
    setOffset(clampOffset(nextOffset, scale));
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(DEFAULT_SCALE);
    setOffset(clampOffset({ x: 0, y: 0 }, DEFAULT_SCALE));
  };

  useEffect(() => {
    setPreviewFrame(0);
    setIsReelActive(false);
  }, [hoveredNodeId]);

  useEffect(() => {
    if (!hoveredNodeId) {
      return;
    }

    const delayTimer = window.setTimeout(() => {
      setIsReelActive(true);
    }, HOVER_REEL_DELAY_MS);

    return () => window.clearTimeout(delayTimer);
  }, [hoveredNodeId]);

  useEffect(() => {
    if (!hoveredNodeId || !isReelActive || hoveredUnlockedImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPreviewFrame((current) => (current + 1) % hoveredUnlockedImages.length);
    }, HOVER_REEL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [hoveredNodeId, isReelActive, hoveredUnlockedImages]);

  useEffect(() => {
    const syncProgress = () => {
      setLocationSecretProgress(getLocationSecretProgress());
      setGameFlags(getGameFlags());
    };

    syncProgress();
    window.addEventListener("storage", syncProgress);
    return () => window.removeEventListener("storage", syncProgress);
  }, []);

  useEffect(() => {
    if (!travelAccessibleNodeIdSet.has(travelerNodeId)) {
      setTravelerNodeId(travelAccessibleNodeIds[0] ?? "03-00");
    }
  }, [travelAccessibleNodeIds, travelAccessibleNodeIdSet, travelerNodeId]);

  useEffect(() => {
    const position = getNodePositionById(travelerNodeId);
    if (!position || isTravelerMoving) {
      return;
    }

    setTravelerPosition(position);
  }, [travelerNodeId, isTravelerMoving]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedNodeId = window.localStorage.getItem(TRAVELER_NODE_STORAGE_KEY);
      if (savedNodeId && MAIN_LOCATION_NODES.some((node) => node.id === savedNodeId)) {
        setTravelerNodeId(savedNodeId);
        const savedPosition = getNodePositionById(savedNodeId);
        if (savedPosition) {
          setTravelerPosition(savedPosition);
        }
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(TRAVELER_NODE_STORAGE_KEY, travelerNodeId);
    } catch {
      // ignore storage write errors
    }
  }, [travelerNodeId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(FORCED_TRAVEL_EVENTS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) {
        const safeValues = parsed.filter((value): value is string => typeof value === "string");
        setSeenForcedTravelEvents(safeValues);
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(FORCED_TRAVEL_EVENTS_STORAGE_KEY, JSON.stringify(seenForcedTravelEvents));
    } catch {
      // ignore storage write errors
    }
  }, [seenForcedTravelEvents]);

  useEffect(() => {
    return () => {
      clearTravelTimers();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {tipos.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setActiveTipo(tipo.id)}
            className={cn(
              "px-4 py-2 text-xs souls-title tracking-widest border transition-all duration-200",
              activeTipo === tipo.id
                ? "border-[oklch(0.72_0.08_75)] text-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/10%)]"
                : "border-[oklch(0.72_0.08_75/20%)] text-[oklch(0.55_0.01_60)] hover:border-[oklch(0.72_0.08_75/50%)] hover:text-[oklch(0.72_0.08_75)]"
            )}
          >
            {tipo.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTipo}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="border border-[oklch(0.72_0.08_75/18%)] bg-[oklch(0.1_0.005_260/75%)] overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="souls-title text-sm tracking-widest text-[oklch(0.45_0.01_60)]">{labels.empty}</p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 border-b border-[oklch(0.72_0.08_75/15%)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs souls-title tracking-[0.28em] text-[oklch(0.72_0.08_75)]">{labels.mapTitle}</p>
                  <p className="text-xs souls-text text-[oklch(0.55_0.01_60)] mt-1">{labels.mapHint}</p>
                  <p className="text-[10px] souls-text text-[oklch(0.62_0.01_60)] mt-3">
                    {labels.routeState}: {travelerNode?.name ?? "-"}
                  </p>
                  <p className="text-[10px] souls-text text-[oklch(0.55_0.01_60)] mt-2">
                    {travelAnomaly ?? labels.anomalyNone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetView}
                  className="px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/40%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/8%)] transition-colors"
                >
                  {labels.resetView}
                </button>
              </div>
              {!hasSeedLocations && (
                <p className="text-[10px] souls-text text-[oklch(0.45_0.01_60)] mt-1">No source locations found in dataset.</p>
              )}
            </div>

            <div
              ref={viewportRef}
              className={cn(
                "relative h-[80vh] overflow-hidden overscroll-contain select-none",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onWheelCapture={handleWheel}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
            >
              <div
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "top left",
                  transition: isDragging ? "none" : "transform 120ms ease-out",
                  width: `${WORLD_WIDTH}px`,
                  height: `${WORLD_HEIGHT}px`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `perspective(1800px) rotateX(${MAP_TILT_X_DEG}deg) rotateZ(${MAP_TILT_Z_DEG}deg)`,
                    transformOrigin: "50% 62%",
                    willChange: "transform",
                  }}
                >
                  <img
                    src={MAP_PLACEHOLDER_SRC}
                    alt="Elden Ring map placeholder"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    draggable={false}
                    style={{
                      filter: "brightness(0.8) saturate(0.75) contrast(1.0)",
                      opacity: 0.78,
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-[oklch(0.08_0.005_260/48%)]" />
                </div>

                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {edgeCurves.map((curve) => {
                    return (
                      <path
                        key={`${curve.from}-${curve.to}`}
                        d={curve.pathD}
                        stroke={curve.isSecretEdge ? "oklch(0.72 0.08 75 / 0.18)" : "oklch(0.72 0.08 75 / 0.35)"}
                        fill="none"
                        strokeWidth={curve.isSecretEdge ? "0.11" : "0.15"}
                        strokeDasharray={curve.isSecretEdge ? "0.22 0.35" : "0.5 0.3"}
                      />
                    );
                  })}
                </svg>

                {travelerNode && (
                  <div
                    className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${travelerPosition.x}%`, top: `${travelerPosition.y}%` }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0_0_0/35%)] blur-[1.5px]" />
                    <span className="block h-3.5 w-3.5 rotate-45 border border-[oklch(0.82_0.14_80/90%)] bg-[oklch(0.82_0.14_80)] shadow-[0_0_10px_oklch(0.82_0.14_80/95%)]" />
                  </div>
                )}

                <div className="absolute inset-0">
                  {nodePositions.map((node, index) => {
                    const slots = getSecretSlots(node.id);
                    const isNodeClickable = true;

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className={cn(
                          "group absolute -translate-x-1/2 -translate-y-[35%]",
                          isNodeClickable && !isTravelerMoving ? "cursor-pointer" : "cursor-not-allowed"
                        )}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseDown={(event) => event.stopPropagation()}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (isTravelerMoving) {
                            return;
                          }

                          if (node.id === travelerNodeId) {
                            setActiveNodePopupId(node.id);
                            return;
                          }

                          if (!isAdjacentTravelNode(node.id)) {
                            setTravelAnomaly(
                              lang === "es"
                                ? "Solo puedes viajar al nodo anterior o siguiente."
                                : lang === "ja"
                                ? "移動できるのは前後のノードのみです。"
                                : "You can only travel to the previous or next node."
                            );
                            return;
                          }

                          setIsTravelerMoving(true);
                          setActiveNodePopupId(null);
                          setActiveTravelBanner(null);
                          clearTravelTimers();

                          const previousNodeId = travelerNodeId;
                          const previousNode = allNodesById[previousNodeId];
                          const targetNode = allNodesById[node.id];
                          const travelCurve = getTravelCurve(previousNodeId, node.id);

                          if (!previousNode || !targetNode || !travelCurve) {
                            setTravelerNodeId(node.id);
                            setIsTravelerMoving(false);
                            setActiveNodePopupId(node.id);
                            return;
                          }

                          const eventPayload = triggerTravelEvent(previousNodeId, node.id);

                          if (!eventPayload) {
                            animateTravelerOnCurve(travelCurve, 0, 1, TRAVEL_MOVE_DURATION_MS, () => {
                              setTravelerNodeId(node.id);
                              setPendingTravelNodeId(null);
                              setIsTravelerMoving(false);
                              setActiveNodePopupId(node.id);
                            });
                            return;
                          }
                          setPendingTravelNodeId(node.id);

                          animateTravelerOnCurve(travelCurve, 0, 0.5, TRAVEL_MOVE_DURATION_MS, () => {
                            setActiveTravelBanner(eventPayload);
                            playAnomalySound();
                          });
                        }}
                      >
                        <div className="relative flex items-center justify-center w-10 h-10">
                          <span className="absolute h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.08_75)]" />
                          <img
                            src={REST_PIN_ICON_SRC}
                            alt="Rest site pin"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_oklch(0.72_0.08_75/80%)]"
                            draggable={false}
                          />
                        </div>

                        <p
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)] [filter:drop-shadow(0_1px_0_oklch(0_0_0/1))_drop-shadow(0_0_8px_oklch(0_0_0/1))_drop-shadow(0_0_16px_oklch(0_0_0/0.95))] transition-opacity duration-150",
                            hoveredNodeId === node.id ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {node.name}
                        </p>

                        <div
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full z-10 mt-7 w-56 -translate-x-1/2 transition-opacity duration-200",
                            hoveredNodeId === node.id ? "opacity-100" : "opacity-0"
                          )}
                        >
                          <div className="overflow-hidden border border-[oklch(0.55_0.01_60/45%)] bg-[oklch(0.08_0.005_260/92%)]">
                            <div className="relative h-24 bg-[oklch(0.1_0.01_260)]">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={`${node.id}-${hoveredNodeId === node.id ? previewFrame : 0}`}
                                  src={getUnlockedPreviewImages(node.id)[(hoveredNodeId === node.id ? previewFrame : 0)] ?? MAP_PLACEHOLDER_SRC}
                                  alt={node.name}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260/78%)] via-transparent to-transparent" />
                            </div>

                            <div className="px-3 py-2">
                              <p className="souls-text text-[11px] leading-relaxed text-[oklch(0.62_0.01_60)] line-clamp-3">
                                {nodeMetaById[node.id]?.description}
                              </p>
                              <p className="mt-2 souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)]">
                                {lang === "es"
                                  ? `Secretos desbloqueados ${slots.foundSecrets}/${slots.slotCount}`
                                  : lang === "ja"
                                  ? `解放済みの秘密 ${slots.foundSecrets}/${slots.slotCount}`
                                  : `Secrets unlocked ${slots.foundSecrets}/${slots.slotCount}`}
                              </p>
                              <div className="mt-2 flex items-center gap-1.5">
                                {Array.from({ length: slots.slotCount }).map((_, slotIndex) => {
                                  const isFound = slotIndex < slots.foundSecrets;
                                  return (
                                    <span
                                      key={`${node.id}-slot-${slotIndex}`}
                                      className={cn(
                                        "inline-block h-2.5 w-2.5 rounded-full border",
                                        isFound
                                          ? "border-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/85%)]"
                                          : "border-[oklch(0.45_0.01_60/60%)] bg-[oklch(0.45_0.01_60/20%)]"
                                      )}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {activePopupNode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.02_0.003_260/70%)] p-4">
                <div className="w-full max-w-xl border border-[oklch(0.55_0.01_60/45%)] bg-[oklch(0.08_0.005_260/95%)]">
                  <div className="relative h-48 bg-[oklch(0.1_0.01_260)]">
                    <img
                      src={getUnlockedPreviewImages(activePopupNode.id)[0] ?? MAP_PLACEHOLDER_SRC}
                      alt={activePopupNode.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260/82%)] via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 souls-title text-sm tracking-widest text-[oklch(0.82_0.01_60)]">
                      {activePopupNode.name}
                    </p>
                  </div>

                  <div className="px-4 py-4">
                    <p className="souls-text text-sm leading-relaxed text-[oklch(0.62_0.01_60)]">
                      {nodeMetaById[activePopupNode.id]?.description}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveNodePopupId(null)}
                        className="px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                      >
                        {labels.close}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {activeTravelBanner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed inset-0 z-[60] flex items-center justify-center px-4"
                  onClick={continuePendingTravel}
                >
                  <div className="w-full max-w-3xl border border-[oklch(0.72_0.08_75/35%)] bg-[oklch(0.08_0.005_260/94%)] px-5 py-3 text-center">
                    <p className="souls-title text-[10px] tracking-[0.3em] text-[oklch(0.72_0.08_75)]">{activeTravelBanner.title}</p>
                    <p className="mt-2 souls-text text-sm leading-relaxed text-[oklch(0.62_0.01_60)]">{activeTravelBanner.detail}</p>
                    <p className="mt-3 souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)]">
                      {labels.continueExploration}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
