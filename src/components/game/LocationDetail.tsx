
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Locacion } from "@/types/game";
import { type Language } from "@/lib/i18n";
import { getGameFlags, markCharacterDiscovered, markItemDiscovered, setGameFlag, type GameFlag } from "@/lib/progression";
import { cn } from "@/lib/utils";

interface Props {
  location: Locacion;
  lang?: Language;
}

type SceneHotspot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  actionEs: string;
  actionEn: string;
  actionJa: string;
  targetSlug?: string;
  unlockItemSlug?: string;
  unlockFlag?: GameFlag;
  requiresFlag?: GameFlag;
};

const MAP_PLACEHOLDER_SRC = "/images/maps/elden-ring-placeholder.png";

const HOTSPOTS_BY_LOCATION: Record<string, SceneHotspot[]> = {
  "la-pradera": [
    {
      id: "pradera-wolfsbane-notes",
      x: 58,
      y: 63,
      width: 12,
      height: 15,
      actionEs: "Recoger Notas de Campo",
      actionEn: "Collect Field Notes",
      actionJa: "調査メモを拾う",
      unlockItemSlug: "field-notes-wolfsbane",
    },
  ],
  "ruinas-del-monasterio": [
    {
      id: "to-dungeons",
      x: 38,
      y: 63,
      width: 12,
      height: 20,
      actionEs: "Bajar a las Mazmorras",
      actionEn: "Descend to the Dungeons",
      actionJa: "地下牢へ降りる",
      targetSlug: "mazmorras-de-la-mansion",
      unlockFlag: "unlock_monastery_secret",
    },
  ],
  "mazmorras-de-la-mansion": [
    {
      id: "to-mansion-return",
      x: 28,
      y: 34,
      width: 11,
      height: 25,
      actionEs: "Subir a la Mansión",
      actionEn: "Climb to the Mansion",
      actionJa: "屋敷へ戻る",
      targetSlug: "mansion-auremont",
    },
    {
      id: "to-sewers",
      x: 68,
      y: 70,
      width: 14,
      height: 18,
      actionEs: "Bajar a las Alcantarillas",
      actionEn: "Descend to the Sewers",
      actionJa: "下水道へ降りる",
      targetSlug: "alcantarillas",
      unlockFlag: "unlock_sewers",
      requiresFlag: "unlock_monastery_secret",
    },
  ],
  alcantarillas: [
    {
      id: "to-dungeons-return",
      x: 24,
      y: 40,
      width: 11,
      height: 24,
      actionEs: "Regresar a las Mazmorras",
      actionEn: "Return to the Dungeons",
      actionJa: "地下牢へ戻る",
      targetSlug: "mazmorras-de-la-mansion",
    },
    {
      id: "to-depths",
      x: 74,
      y: 73,
      width: 16,
      height: 20,
      actionEs: "Bajar a las Profundidades",
      actionEn: "Descend to the Depths",
      actionJa: "深層へ降りる",
      targetSlug: "las-profundidades",
      unlockFlag: "unlock_depths",
      requiresFlag: "unlock_sewers",
    },
  ],
  "molino-abandonado": [
    {
      id: "wolfsbane-ledger",
      x: 67,
      y: 44,
      width: 11,
      height: 13,
      actionEs: "Recoger Registro de Wolfsbane",
      actionEn: "Collect Wolfsbane Ledger",
      actionJa: "ウルフズベイン記録を拾う",
      unlockItemSlug: "wolfsbane-ledger",
    },
    {
      id: "mill-floodgate-key",
      x: 46,
      y: 72,
      width: 10,
      height: 13,
      actionEs: "Recoger Llave de Compuerta",
      actionEn: "Collect Floodgate Key",
      actionJa: "水門の鍵を拾う",
      unlockItemSlug: "mill-floodgate-key",
    },
  ],
  "bosque-embrujado": [
    {
      id: "forest-cracked-seal",
      x: 34,
      y: 58,
      width: 12,
      height: 16,
      actionEs: "Recoger Sello Astillado",
      actionEn: "Collect Cracked Seal",
      actionJa: "ひび割れた封印を拾う",
      unlockItemSlug: "cracked-forest-seal",
    },
  ],
  "villa-infestada": [
    {
      id: "villa-auremont-fragment",
      x: 74,
      y: 41,
      width: 13,
      height: 17,
      actionEs: "Recoger Fragmento Auremont",
      actionEn: "Collect Auremont Fragment",
      actionJa: "オーレモントの欠片を拾う",
      unlockItemSlug: "auremont-relic-fragment",
    },
  ],
};

const peligrosidadColors: Record<string, string> = {
  baja: "oklch(0.6 0.12 145)",
  media: "oklch(0.72 0.08 75)",
  alta: "oklch(0.65 0.15 30)",
  extrema: "oklch(0.55 0.2 15)",
  desconocida: "oklch(0.55 0.01 60)",
};

const tipoLabels: Record<string, string> = {
  region: "Region",
  mazmorra: "Dungeon",
  secreto: "Secret",
};

export default function LocationDetail({ location, lang = "en" }: Props) {
  const router = useRouter();
  const [hasLoggedSighting, setHasLoggedSighting] = useState(false);
  const [gameFlags, setGameFlags] = useState<Record<string, boolean>>(() => getGameFlags());
  const [eventFeedback, setEventFeedback] = useState<string | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const locationTypeKey = location.tipo ?? "region";
  const color = peligrosidadColors[location.peligrosidad ?? "media"] ?? peligrosidadColors.media;
  const mapScreenshots = useMemo(
    () => [location.mapImageUrl, location.imagen_url, location.imageUrl].filter((value): value is string => Boolean(value)),
    [location.mapImageUrl, location.imagen_url, location.imageUrl]
  );
  const sightedCharacterSlugs = useMemo(
    () => location.personajes_avistados_slugs ?? location.sightedCharacterSlugs ?? [],
    [location.personajes_avistados_slugs, location.sightedCharacterSlugs]
  );
  const isMonastery = location.slug === "ruinas-del-monasterio";
  const activeSceneImage = mapScreenshots[0] ?? MAP_PLACEHOLDER_SRC;
  const locationHotspots = useMemo(() => {
    const source = HOTSPOTS_BY_LOCATION[location.slug] ?? [];
    return source.filter((hotspot) => {
      if (!hotspot.requiresFlag) {
        return true;
      }
      return Boolean(gameFlags[hotspot.requiresFlag]);
    });
  }, [location.slug, gameFlags]);
  const labels =
    lang === "es"
      ? {
          mapSection: "Avistamientos en el mapa",
          mapHint:
            sightedCharacterSlugs.length > 0
              ? "Si los ves en esta captura, tócala para registrar el encuentro."
              : "No hay personajes vinculados a esta captura por ahora.",
          register: "Registrar avistamiento",
          registered: "Encuentro registrado",
          explorationSection: "Evento de exploración",
          returnToMap: "Volver al mapa",
          eventIntro: "Entre claustros vacíos, una puerta sellada vibra como si respirara.",
          eventMid: "Desde las mazmorras emana agua negra: un drenaje antiguo sigue activo.",
          eventDeep: "Un eco de campanas bajo tierra señala una grieta que desciende aún más.",
          unlockCellar: "Forzar sello y bajar a las mazmorras",
          unlockSewers: "Seguir el drenaje hacia las alcantarillas",
          unlockDepths: "Descender a las profundidades",
          feedbackCellar: "Se reveló la ruta secreta: Monasterio → Mazmorras.",
          feedbackSewers: "Nueva ruta descubierta: Mazmorras → Alcantarillas.",
          feedbackDepths: "La caída se abre: Alcantarillas → Profundidades.",
          allUnlocked: "Las rutas ocultas bajo Auremont ya están abiertas.",
          itemUnlocked: "Has encontrado un objeto clave:",
        }
      : lang === "ja"
      ? {
          mapSection: "地図の目撃記録",
          mapHint:
            sightedCharacterSlugs.length > 0
              ? "このスクリーンショットで発見したら、タップして遭遇を記録します。"
              : "このスクリーンショットには、まだ関連キャラクターが設定されていません。",
          register: "発見を記録",
          registered: "遭遇を記録済み",
          explorationSection: "探索イベント",
          returnToMap: "マップに戻る",
          eventIntro: "放棄された回廊の奥で、封印扉が脈打つように震える。",
          eventMid: "地下牢の下から黒い水の流れがまだ生きている。",
          eventDeep: "地下の鐘の残響が、さらに深い亀裂を示している。",
          unlockCellar: "封印を破って地下牢へ",
          unlockSewers: "排水路を追って下水へ",
          unlockDepths: "さらに深層へ降りる",
          feedbackCellar: "秘密ルート解放：修道院 → 地下牢。",
          feedbackSewers: "新ルート発見：地下牢 → 下水道。",
          feedbackDepths: "奈落への道解放：下水道 → 深層。",
          allUnlocked: "オーレモント地下の隠し経路はすべて解放済み。",
          itemUnlocked: "重要アイテムを発見:",
        }
      : {
          mapSection: "Map Sightings",
          mapHint:
            sightedCharacterSlugs.length > 0
              ? "If you spot them in this screenshot, tap it to log the encounter."
              : "No linked characters are configured for this screenshot yet.",
          register: "Log sighting",
          registered: "Encounter logged",
          explorationSection: "Exploration Event",
          returnToMap: "Return to map",
          eventIntro: "Beyond the cloisters, a sealed door trembles like it has a pulse.",
          eventMid: "Black water seeps below the dungeons: an old drain line is still alive.",
          eventDeep: "A drowned bell echo points to a deeper split in the stone.",
          unlockCellar: "Break the seal and enter the dungeons",
          unlockSewers: "Follow the drain route to the sewers",
          unlockDepths: "Descend into the depths",
          feedbackCellar: "Secret route revealed: Monastery → Dungeons.",
          feedbackSewers: "New route discovered: Dungeons → Sewers.",
          feedbackDepths: "The descent opens: Sewers → Depths.",
          allUnlocked: "All hidden routes under Auremont are now open.",
          itemUnlocked: "Key item discovered:",
        };

  const activeEventStep = useMemo(() => {
    if (!isMonastery) {
      return null;
    }
    if (!gameFlags.unlock_monastery_secret) {
      return "cellar" as const;
    }
    if (!gameFlags.unlock_sewers) {
      return "sewers" as const;
    }
    if (!gameFlags.unlock_depths) {
      return "depths" as const;
    }
    return "done" as const;
  }, [gameFlags, isMonastery]);

  const handleUnlockFlag = (flag: "unlock_monastery_secret" | "unlock_sewers" | "unlock_depths", feedback: string) => {
    const next = setGameFlag(flag, true);
    setGameFlags(next as Record<string, boolean>);
    setEventFeedback(feedback);
  };

  const getHotspotActionLabel = (hotspot: SceneHotspot) => {
    if (lang === "es") return hotspot.actionEs;
    if (lang === "ja") return hotspot.actionJa;
    return hotspot.actionEn;
  };

  const handleHotspotClick = (hotspot: SceneHotspot) => {
    if (hotspot.unlockFlag) {
      const next = setGameFlag(hotspot.unlockFlag, true);
      setGameFlags(next as Record<string, boolean>);
    }

    if (hotspot.unlockItemSlug) {
      markItemDiscovered(hotspot.unlockItemSlug);
      setEventFeedback(`${labels.itemUnlocked} ${getHotspotActionLabel(hotspot)}`);
      window.dispatchEvent(new Event("storage"));
    }

    if (hotspot.targetSlug) {
      router.push(`/locations/${hotspot.targetSlug}?lang=${lang}`);
    }
  };

  const handleMapSighting = () => {
    if (sightedCharacterSlugs.length === 0) {
      return;
    }

    sightedCharacterSlugs.forEach((slug) => {
      markCharacterDiscovered(slug);
    });
    setHasLoggedSighting(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        {location.imagen_url && (
          <img
            src={location.imagen_url}
            alt={location.nombre}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.35) saturate(0.4)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260)] via-[oklch(0.08_0.005_260/30%)] to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Locations
          </Link>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5">
              {tipoLabels[locationTypeKey] ?? locationTypeKey}
            </span>
            <span
              className="text-xs souls-title tracking-widest border px-2 py-0.5"
              style={{ color, borderColor: `${color}60` }}
            >
              Danger: {location.peligrosidad?.toUpperCase()}
            </span>
            {!location.descubierto && (
              <span className="text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] border border-[oklch(0.55_0.01_60/40%)] px-2 py-0.5">
                Unknown
              </span>
            )}
          </div>
          <h1 className="souls-title text-5xl sm:text-6xl text-[oklch(0.88_0.01_60)] tracking-widest">
            {location.nombre}
          </h1>
        </div>
      </div>

      {/* Lore */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-[oklch(0.72_0.08_75/40%)]" />
              <h2 className="souls-title text-xs tracking-[0.4em] text-[oklch(0.72_0.08_75)]">
                CHRONICLES
              </h2>
              <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
            </div>
            {location.descripcion_lore ? (
              <p className="souls-text text-[oklch(0.65_0.01_60)] leading-relaxed text-base">
                {location.descripcion_lore}
              </p>
            ) : (
              <p className="souls-text text-[oklch(0.45_0.01_60)] italic">
                The history of this place has been lost to time...
              </p>
            )}
          </motion.div>

          {mapScreenshots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-[oklch(0.72_0.08_75/40%)]" />
                <h2 className="souls-title text-xs tracking-[0.4em] text-[oklch(0.72_0.08_75)]">
                  {labels.mapSection}
                </h2>
                <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
              </div>
              <p className="souls-text text-[oklch(0.55_0.01_60)] text-sm mb-4">{labels.mapHint}</p>

              <div className="group relative w-full overflow-hidden border border-[oklch(0.72_0.08_75/20%)]">
                <img
                  src={activeSceneImage}
                  alt={location.nombre}
                  className="w-full h-[64vh] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  style={{ filter: "brightness(0.6) saturate(0.6)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260/90%)] via-transparent to-transparent" />

                <div className="absolute inset-0">
                  {locationHotspots.map((hotspot) => {
                    const isHovered = hoveredHotspotId === hotspot.id;
                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                        onMouseLeave={() => setHoveredHotspotId((current) => (current === hotspot.id ? null : current))}
                        onClick={() => handleHotspotClick(hotspot)}
                        aria-label={getHotspotActionLabel(hotspot)}
                      >
                        <span className="relative block h-3 w-3 rounded-full bg-[oklch(0.72_0.08_75)] [filter:drop-shadow(0_-3px_6px_oklch(0.72_0.08_75/60%))] animate-pulse" />
                        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(0.72_0.08_75/55%)] opacity-55" />

                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-[140%] z-20 -translate-x-1/2 whitespace-nowrap souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)] [filter:drop-shadow(0_1px_0_oklch(0_0_0/1))_drop-shadow(0_0_8px_oklch(0_0_0/1))] transition-opacity duration-150",
                            isHovered ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {getHotspotActionLabel(hotspot)}
                        </span>
                      </button>
                    );
                  })}

                  {locationHotspots.map((hotspot) => {
                    const isHovered = hoveredHotspotId === hotspot.id;
                    return (
                      <div
                        key={`${hotspot.id}-silhouette`}
                        className={cn(
                          "pointer-events-none absolute -translate-x-1/2 -translate-y-[54%] rounded-lg border border-[oklch(0.72_0.08_75/55%)] bg-[oklch(0.72_0.08_75/6%)] transition-opacity duration-200",
                          isHovered ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          width: `${hotspot.width}%`,
                          height: `${hotspot.height}%`,
                          filter: "drop-shadow(0 -12px 12px oklch(0.72 0.08 75 / 0.18)) drop-shadow(0 -3px 5px oklch(0 0 0 / 0.45))",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="absolute bottom-3 left-3 text-left">
                  <button
                    type="button"
                    onClick={handleMapSighting}
                    disabled={sightedCharacterSlugs.length === 0}
                    className="inline-flex items-center text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/50%)] px-2 py-1 bg-[oklch(0.08_0.005_260/80%)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {hasLoggedSighting ? labels.registered : labels.register}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {isMonastery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-12 border border-[oklch(0.72_0.08_75/20%)] bg-[oklch(0.08_0.005_260/85%)] p-5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[oklch(0.72_0.08_75/40%)]" />
                <h2 className="souls-title text-xs tracking-[0.4em] text-[oklch(0.72_0.08_75)]">{labels.explorationSection}</h2>
              </div>

              {activeEventStep === "cellar" && (
                <>
                  <p className="souls-text text-[oklch(0.62_0.01_60)] text-sm mb-4">{labels.eventIntro}</p>
                  <button
                    type="button"
                    onClick={() => handleUnlockFlag("unlock_monastery_secret", labels.feedbackCellar)}
                    className="px-3 py-2 text-[11px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                  >
                    {labels.unlockCellar}
                  </button>
                </>
              )}

              {activeEventStep === "sewers" && (
                <>
                  <p className="souls-text text-[oklch(0.62_0.01_60)] text-sm mb-4">{labels.eventMid}</p>
                  <button
                    type="button"
                    onClick={() => handleUnlockFlag("unlock_sewers", labels.feedbackSewers)}
                    className="px-3 py-2 text-[11px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                  >
                    {labels.unlockSewers}
                  </button>
                </>
              )}

              {activeEventStep === "depths" && (
                <>
                  <p className="souls-text text-[oklch(0.62_0.01_60)] text-sm mb-4">{labels.eventDeep}</p>
                  <button
                    type="button"
                    onClick={() => handleUnlockFlag("unlock_depths", labels.feedbackDepths)}
                    className="px-3 py-2 text-[11px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                  >
                    {labels.unlockDepths}
                  </button>
                </>
              )}

              {activeEventStep === "done" && (
                <p className="souls-text text-[oklch(0.62_0.01_60)] text-sm">{labels.allUnlocked}</p>
              )}

              {eventFeedback && (
                <p className="mt-4 souls-text text-xs text-[oklch(0.72_0.08_75)]">{eventFeedback}</p>
              )}

              <Link
                href="/locations"
                className="mt-5 inline-flex items-center gap-2 text-[10px] souls-title tracking-widest text-[oklch(0.55_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> {labels.returnToMap}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
