"use client";

import { useEffect } from "react";

type UiSoundConfig = {
  src?: string;
  volume?: number;
  muted?: boolean;
};

const DEFAULT_SOUND_SRC = "/sounds/ui-click.mp3";
const DEFAULT_VOLUME = 1;

const getInteractiveElement = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null;

  const interactive = target.closest(
    [
      "button",
      "a[href]",
      "[role='button']",
      "input[type='button']",
      "input[type='submit']",
      "input[type='reset']",
      "summary",
      "[data-ui-sound='on']",
      "[data-state='open']",
      "[data-state='closed']",
    ].join(",")
  );

  if (!interactive) return null;
  if (interactive.hasAttribute("disabled")) return null;
  if (interactive.getAttribute("aria-disabled") === "true") return null;

  return interactive;
};

export function useUiSounds(config?: UiSoundConfig) {
  useEffect(() => {
    const src = config?.src || DEFAULT_SOUND_SRC;
    const baseVolume = config?.volume ?? DEFAULT_VOLUME;
    const isMuted = config?.muted === true;
    const baseAudio = new Audio(src);
    baseAudio.preload = "auto";
    baseAudio.volume = baseVolume;

    let lastPlayAt = 0;
    let isUnlocked = false;

    const unlockAudio = () => {
      if (isUnlocked) return;
      isUnlocked = true;

      try {
        const unlockInstance = baseAudio.cloneNode(true) as HTMLAudioElement;
        unlockInstance.muted = true;
        unlockInstance.volume = 0;
        unlockInstance.currentTime = 0;
        void unlockInstance.play().then(() => {
          unlockInstance.pause();
          unlockInstance.src = "";
        }).catch(() => {
          unlockInstance.src = "";
        });
      } catch {
      }
    };

    const playSound = (volumeScale = 1) => {
      if (isMuted) return;
      if (!isUnlocked) return;
      const now = Date.now();
      if (now - lastPlayAt < 70) return;
      lastPlayAt = now;

      try {
        const instance = baseAudio.cloneNode(true) as HTMLAudioElement;
        instance.volume = Math.min(1, baseVolume * volumeScale);
        instance.currentTime = 0;
        void instance.play().catch(() => {
          instance.src = "";
        });
      } catch {
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      unlockAudio();
      if (!getInteractiveElement(event.target)) return;
      playSound();
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      unlockAudio();
      const interactive = getInteractiveElement(event.target);
      if (!interactive) return;

      if (event.relatedTarget instanceof Element && interactive.contains(event.relatedTarget)) {
        return;
      }

      playSound(0.5);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      unlockAudio();
      if (event.key !== "Enter" && event.key !== " ") return;
      if (!getInteractiveElement(event.target)) return;
      playSound();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerover", onPointerOver, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerover", onPointerOver, true);
      document.removeEventListener("keydown", onKeyDown, true);
      baseAudio.pause();
      baseAudio.src = "";
    };
  }, [config?.src, config?.volume, config?.muted]);
}
