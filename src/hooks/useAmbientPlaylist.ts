"use client";

import { useEffect, useRef } from "react";

type AmbientPlaylistConfig = {
  tracks: string[];
  volume?: number;
  enabled?: boolean;
  muted?: boolean;
  crossfadeMs?: number;
  shuffle?: boolean;
};

const DEFAULT_VOLUME = 0.35;
const DEFAULT_CROSSFADE_MS = 8000;

const shuffleTracks = (tracks: string[]) => {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function useAmbientPlaylist(config: AmbientPlaylistConfig) {
  const currentRef = useRef<HTMLAudioElement | null>(null);
  const nextRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef<boolean>(config.muted ?? false);
  const volumeRef = useRef<number>(config.volume ?? DEFAULT_VOLUME);
  const unlockedRef = useRef(false);

  const safePlayCurrent = () => {
    const current = currentRef.current;
    if (!current || mutedRef.current) return;
    current.muted = false;
    current.volume = volumeRef.current;
    const playResult = current.play();
    if (playResult && typeof playResult.then === "function") {
      playResult
        .then(() => {
          if (!mutedRef.current) {
            unlockedRef.current = true;
          }
        })
        .catch(() => {
        });
    }
  };

  useEffect(() => {
    mutedRef.current = config.muted ?? false;
    volumeRef.current = Math.min(1, Math.max(0, config.volume ?? DEFAULT_VOLUME));

    const current = currentRef.current;
    const next = nextRef.current;

    if (mutedRef.current) {
      current?.pause();
      next?.pause();
      return;
    }

    if (unlockedRef.current) {
      safePlayCurrent();
    }
  }, [config.muted, config.volume]);

  useEffect(() => {
    if (config.enabled === false) return;

    const baseVolume = volumeRef.current;
    const crossfadeMs = Math.max(0, config.crossfadeMs ?? DEFAULT_CROSSFADE_MS);
    const shouldShuffle = config.shuffle !== false;
    const tracks = config.tracks.filter(Boolean);

    if (tracks.length === 0) return;

    let queue = shouldShuffle ? shuffleTracks(tracks) : [...tracks];
    let index = 0;
    let isUnlocked = false;
    let isCrossfading = false;
    let retryTimer: number | null = null;

    const createAudio = (src: string) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.loop = false;
      audio.volume = volumeRef.current;
      return audio;
    };

    const getNextTrackSrc = () => {
      if (index >= queue.length) {
        queue = shouldShuffle ? shuffleTracks(tracks) : [...tracks];
        index = 0;
      }
      const src = queue[index];
      index += 1;
      return src;
    };

    let current = createAudio(getNextTrackSrc());
    let next: HTMLAudioElement | null = null;
    currentRef.current = current;
    nextRef.current = next;

    const stopAndRelease = (audio?: HTMLAudioElement | null) => {
      if (!audio) return;
      audio.pause();
      audio.src = "";
    };

    const ensureNext = () => {
      if (!next) {
        next = createAudio(getNextTrackSrc());
        next.volume = 0;
        nextRef.current = next;
      }
    };

    const playCurrent = () => {
      current.muted = mutedRef.current;
      current.volume = volumeRef.current;
      void current.play().catch(() => {
      });
    };

    const fadeInCurrent = (durationMs = 900) => {
      const start = performance.now();
      const step = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, durationMs === 0 ? 1 : elapsed / durationMs);
        current.volume = volumeRef.current * t;
        if (t < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const attemptAutoplay = () => {
      if (mutedRef.current) return;
      current.muted = true;
      current.volume = 0;
      const playResult = current.play();
      if (playResult && typeof playResult.then === "function") {
        void playResult
          .then(() => {
            isUnlocked = true;
            unlockedRef.current = true;
            current.muted = false;
            fadeInCurrent();
          })
          .catch(() => {
            current.muted = false;
            current.volume = volumeRef.current;
          });
      }
    };

    const retryAutoplay = () => {
      if (isUnlocked || mutedRef.current) return;
      attemptAutoplay();
    };

    const scheduleRetry = () => {
      if (retryTimer !== null) return;
      retryTimer = window.setTimeout(() => {
        retryTimer = null;
        if (current.paused && isUnlocked && !mutedRef.current) {
          playCurrent();
        }
      }, 800);
    };

    const attachListeners = (audio: HTMLAudioElement) => {
      audio.addEventListener("timeupdate", maybeCrossfade);
      audio.addEventListener("ended", handleEnded);
    };

    const detachListeners = (audio: HTMLAudioElement) => {
      audio.removeEventListener("timeupdate", maybeCrossfade);
      audio.removeEventListener("ended", handleEnded);
    };

    const crossfadeToNext = () => {
      if (isCrossfading) return;
      ensureNext();
      if (!next) return;

      isCrossfading = true;
      const outgoing = current;
      const incoming = next;
      next = null;

      void incoming.play().catch(() => {
      });

      const start = performance.now();
      const step = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, crossfadeMs === 0 ? 1 : elapsed / crossfadeMs);
        outgoing.volume = volumeRef.current * (1 - t);
        incoming.volume = volumeRef.current * t;

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          detachListeners(outgoing);
          stopAndRelease(outgoing);
          current = incoming;
          current.volume = volumeRef.current;
          attachListeners(current);
          currentRef.current = current;
          isCrossfading = false;
        }
      };

      requestAnimationFrame(step);
    };

    const maybeCrossfade = () => {
      if (isCrossfading || !isUnlocked) return;
      if (mutedRef.current) return;
      if (!Number.isFinite(current.duration) || current.duration === 0) return;
      const remaining = current.duration - current.currentTime;
      if (remaining <= Math.max(0.1, crossfadeMs / 1000)) {
        crossfadeToNext();
      }
    };

    const handleEnded = () => {
      if (tracks.length === 1) {
        current.currentTime = 0;
        playCurrent();
        return;
      }
      crossfadeToNext();
    };

    const unlockAndPlay = () => {
      if (isUnlocked) return;
      isUnlocked = true;
      unlockedRef.current = true;
      if (!mutedRef.current) {
        playCurrent();
      }
      scheduleRetry();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        current.pause();
        if (next) next.pause();
        return;
      }
      if (!isUnlocked && !mutedRef.current) {
        retryAutoplay();
      }
      if (isUnlocked && !mutedRef.current) {
        playCurrent();
        scheduleRetry();
      }
    };

    attachListeners(current);
    if (!mutedRef.current) {
      attemptAutoplay();
    }
    const autoplayInterval = window.setInterval(retryAutoplay, 1200);
    document.addEventListener("pointerdown", unlockAndPlay, true);
    document.addEventListener("keydown", unlockAndPlay, true);
    window.addEventListener("pageshow", retryAutoplay);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      current.removeEventListener("timeupdate", maybeCrossfade);
      current.removeEventListener("ended", handleEnded);
      document.removeEventListener("pointerdown", unlockAndPlay, true);
      document.removeEventListener("keydown", unlockAndPlay, true);
      window.removeEventListener("pageshow", retryAutoplay);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(autoplayInterval);
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
      }
      stopAndRelease(current);
      stopAndRelease(next);
      currentRef.current = null;
      nextRef.current = null;
    };
  }, [config.enabled, config.crossfadeMs, config.shuffle, config.tracks]);
}
