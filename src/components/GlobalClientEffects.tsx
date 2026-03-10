"use client";

import { useEffect, useState } from "react";
import { useZoerIframe } from "@/hooks/useZoerIframe";
import { useUiSounds } from "@/hooks/useUiSounds";
import { useAmbientPlaylist } from "@/hooks/useAmbientPlaylist";
import SoundToggle from "@/components/SoundToggle";

const SOUND_MUTED_STORAGE_KEY = "sound-muted";
const AMBIENT_TRACKS = [
  "/sounds/ambient/Corrupt_Ritual_of_the_Ancients_2026-02-21T060119.mp3",
  "/sounds/ambient/Emotivo_01.mp3",
  "/sounds/ambient/Emotivo_02.mp3",
  "/sounds/ambient/Melancolico.mp3",
  "/sounds/ambient/Tension retorcida_01}.mp3",
  "/sounds/ambient/Victoria emotive.mp3",
  "/sounds/ambient/Inevitable Tide.mp3",
  "/sounds/ambient/Sollemnis Progressio.mp3",
].map((track) => encodeURI(track));

export default function GlobalClientEffects() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SOUND_MUTED_STORAGE_KEY);
      setMuted(stored === "true");
    } catch {
      setMuted(false);
    }
  }, []);

  const toggleMuted = () => {
    setMuted((currentMuted) => {
      const nextMuted = !currentMuted;
      try {
        window.localStorage.setItem(SOUND_MUTED_STORAGE_KEY, String(nextMuted));
      } catch {
      }
      return nextMuted;
    });
  };

  useZoerIframe();
  useUiSounds({
    src: "/sounds/ui-click.mp3",
    volume: 0.3,
    muted,
  });
  useAmbientPlaylist({
    tracks: AMBIENT_TRACKS,
    volume: 0.085,
    crossfadeMs: 4000,
    shuffle: true,
    enabled: true,
    muted,
  });
  return <SoundToggle muted={muted} onToggle={toggleMuted} />;
}

