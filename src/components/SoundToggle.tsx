"use client";

import { Volume2, VolumeX } from "lucide-react";

type SoundToggleProps = {
  muted: boolean;
  onToggle: () => void;
};

export default function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      data-ui-sound="on"
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 border border-[oklch(0.72_0.08_75/35%)] bg-black/75 px-3 py-2 text-[oklch(0.72_0.08_75)] backdrop-blur-sm transition-colors hover:bg-black/90"
      aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
      title={muted ? "Activar sonido" : "Silenciar sonido"}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span className="text-[10px] tracking-widest">{muted ? "MUTE" : "SOUND"}</span>
    </button>
  );
}
