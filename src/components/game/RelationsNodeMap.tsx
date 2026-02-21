"use client";

type Standing = "hostile" | "neutral" | "friendly" | "honored" | "revered" | "exalted";

type RelationNode = {
  id: string;
  label: string;
  standing: Standing;
};

interface RelationsNodeMapProps {
  centerLabel: string;
  nodes: RelationNode[];
  standingLabels: Record<Standing, string>;
}

const standingColors: Record<Standing, { edge: string; node: string; badge: string }> = {
  hostile: {
    edge: "rgba(248, 113, 113, 0.55)",
    node: "border-red-400/60 bg-red-500/10",
    badge: "text-red-200 border-red-400/50 bg-red-500/10",
  },
  neutral: {
    edge: "rgba(163, 163, 163, 0.45)",
    node: "border-zinc-400/60 bg-zinc-500/10",
    badge: "text-zinc-200 border-zinc-400/50 bg-zinc-500/10",
  },
  friendly: {
    edge: "rgba(74, 222, 128, 0.55)",
    node: "border-green-400/60 bg-green-500/10",
    badge: "text-green-200 border-green-400/50 bg-green-500/10",
  },
  honored: {
    edge: "rgba(96, 165, 250, 0.55)",
    node: "border-blue-400/60 bg-blue-500/10",
    badge: "text-blue-200 border-blue-400/50 bg-blue-500/10",
  },
  revered: {
    edge: "rgba(192, 132, 252, 0.55)",
    node: "border-purple-400/60 bg-purple-500/10",
    badge: "text-purple-200 border-purple-400/50 bg-purple-500/10",
  },
  exalted: {
    edge: "rgba(251, 191, 36, 0.6)",
    node: "border-amber-400/70 bg-amber-500/10",
    badge: "text-amber-200 border-amber-400/60 bg-amber-500/10",
  },
};

export default function RelationsNodeMap({ centerLabel, nodes, standingLabels }: RelationsNodeMapProps) {
  const radius = 38;
  const positionedNodes = nodes.map((node, index) => {
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    return {
      ...node,
      x,
      y,
    };
  });

  return (
    <div className="relative h-[360px] w-full rounded-md border border-accent/25 bg-black/35 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {positionedNodes.map((node) => (
          <line
            key={`edge-${node.id}`}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke={standingColors[node.standing].edge}
            strokeWidth="0.25"
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full border border-accent/85 bg-accent/30 px-4 py-2 text-center shadow-[0_0_24px_rgba(139,115,85,0.35)]">
          <p className="text-xs font-semibold text-foreground font-serif">{centerLabel}</p>
        </div>
      </div>

      {positionedNodes.map((node) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div className={`rounded-md border px-2 py-1 min-w-[110px] text-center ${standingColors[node.standing].node}`}>
            <p className="text-[11px] text-foreground font-serif leading-tight">{node.label}</p>
            <p
              className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] font-serif ${standingColors[node.standing].badge}`}
            >
              {standingLabels[node.standing]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
