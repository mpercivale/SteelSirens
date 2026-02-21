
"use client";

import { motion } from "framer-motion";
import CharacterCircle from "./CharacterCircle";
import type { Personaje } from "@/types/game";
import { getHomeCopy, type Language } from "@/lib/i18n";

interface Props {
  characters: Personaje[];
  lang: Language;
}

export default function HeroSection({ characters, lang }: Props) {
  const t = getHomeCopy(lang);

  return (
    <section className="relative min-h-screen flex flex-col items-center pt -0 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.15 0.02 75 / 15%) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center mb-2 px-4 relative z-10"
      >
        <p className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-[0.6em] mb-0 uppercase">
          {t.hero.eyebrow}
        </p>
        <h1 className="souls-title text-4xl sm:text-5xl md:text-6xl text-[oklch(0.88_0.01_60)] tracking-widest mb-0">
          {t.hero.title}
        </h1>
        <div className="flex items-center justify-center gap-4 mb-">
          <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
          <div className="w-2 h-2 border border-[oklch(0.72_0.08_75/60%)] rotate-45" />
          <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
        </div>
        <p className="souls-text text-[oklch(0.55_0.01_60)] text-sm max-w-lg mx-auto">
          {t.hero.description}
        </p>
      </motion.div>

      {/* Character circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 w-full"
      >
        <CharacterCircle characters={characters} lang={lang} />
      </motion.div>
    </section>
  );
}
