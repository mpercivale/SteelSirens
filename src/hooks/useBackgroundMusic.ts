"use client";

import { useEffect } from "react";

type BackgroundMusicConfig = {
  src?: string;
  volume?: number;
  enabled?: boolean;
  muted?: boolean;
};

const DEFAULT_SRC = "/sounds/ambient-bg.mp3";
const DEFAULT_VOLUME = 0.12;

export function useBackgroundMusic(config?: BackgroundMusicConfig) {
  useEffect(() => {
    if (config?.enabled === false || config?.muted === true) return;

    const audio = new Audio(config?.src || DEFAULT_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, config?.volume ?? DEFAULT_VOLUME));

    let hasUserInteracted = false;

    const playMusic = () => {
      void audio.play().catch(() => {
      });
    };

    const unlockAndPlay = () => {
      if (hasUserInteracted) return;
      hasUserInteracted = true;
      playMusic();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
        return;
      }
      if (hasUserInteracted) {
        playMusic();
      }
    };

    document.addEventListener("pointerdown", unlockAndPlay, true);
    document.addEventListener("keydown", unlockAndPlay, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("pointerdown", unlockAndPlay, true);
      document.removeEventListener("keydown", unlockAndPlay, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
      audio.src = "";
    };
  }, [config?.src, config?.volume, config?.enabled, config?.muted]);
}
