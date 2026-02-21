
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Personaje } from "@/types/game";
import { useState, useEffect } from "react";
import {
  getCharacterCircleContent,
  getCharacterCircleIdentities,
  type Language,
} from "@/lib/i18n";
import CharacterGlow from "@/components/game/CharacterGlow";

interface Props {
  characters: Personaje[];
  lang?: Language;
  protagonistLabel?: string;
}

interface CharacterCardProps {
  char: Personaje;
  index: number;
  lang: Language;
  protagonistLabel: string;
}

function CharacterCard({ char, index, lang, protagonistLabel }: CharacterCardProps) {
  const [displayName, setDisplayName] = useState(char.nombre);
  const [displayTitle, setDisplayTitle] = useState(char.clase ?? "");
  const [isHovered, setIsHovered] = useState(false);
  const [identityStep] = useState(() => Math.floor(Math.random() * 100));

  useEffect(() => {
    const identities = getCharacterCircleIdentities(lang, char);
    const localized = getCharacterCircleContent(lang, char);
    const picked =
      identities.length > 0
        ? identities[identityStep % identities.length]
        : undefined;
    setDisplayName(picked?.name ?? char.nombre);
    setDisplayTitle(picked?.title ?? localized.title ?? char.clase ?? "");
  }, [char.id, lang, identityStep]);

  // Individual character positioning adjustments
  const getCharacterStyle = (charId: number) => {
    switch(charId) {
      case 1: // El Perro - reduce 10%, move right
        return {
          scale: 0.9,
          objectPosition: "center 55%",
          transform: "translateX(20px)"
        };
      case 3: // La Doncella - move up 5%, enlarge 10%, move left
        return {
          scale: 1.1,
          objectPosition: "center 30%",
          transform: "translateX(-30px)"
        };
      case 7: // La Archimaga/Hechicero - enlarge 20%, move down
        return {
          scale: 1.2,
          objectPosition: "center 35%",
          transform: "translateY(20px)"
        };
      default:
        return {
          scale: 1,
          objectPosition: "center 15%",
          transform: "none"
        };
    }
  };

  const style = getCharacterStyle(char.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/characters/${char.slug}?lang=${lang}`}>
        <div
          className="group relative border border-[oklch(0.72_0.08_75/15%)] bg-[oklch(0.1_0.005_260/80%)] hover:border-[oklch(0.72_0.08_75/50%)] transition-all duration-300 overflow-visible transform-gpu group-hover:scale-[1.02]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              width: 500,
              height: 500,
              bottom: -36,
            }}
          >
            <CharacterGlow
              characterSlug={char.slug}
              colorGlow={char.color_glow || char.colorGlow || "#ffffff"}
              isActive={isHovered}
            />
          </div>
          
          {/* Image container with overflow to allow top overflow */}
          <div className="relative z-10 h-64 -mt-8 overflow-visible">
            <div className="relative z-10 h-72 overflow-visible">
              {char.imagen_png_url ? (
                <img
                  src={char.imagen_png_url}
                  alt={displayName}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    filter: "brightness(0.7) saturate(0.5)",
                    objectPosition: style.objectPosition,
                    transform: `scale(${style.scale}) ${style.transform}`,
                    transformOrigin: "center"
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[oklch(0.15_0.005_260)] flex items-center justify-center">
                  <span className="souls-title text-4xl text-[oklch(0.72_0.08_75/30%)]">
                    {displayName[0]}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260)] via-transparent to-transparent" />
            </div>
            
            {/* Protagonist badge - moved to bottom right */}
            {char.es_protagonista && (
              <div className="absolute bottom-2 right-2 z-10 text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5 bg-[oklch(0.08_0.005_260/90%)]">
                {protagonistLabel}
              </div>
            )}
          </div>
          <div className="relative z-20 p-3 bg-[oklch(0.1_0.005_260/92%)]">
            <h3 className="souls-title text-sm tracking-widest text-[oklch(0.88_0.01_60)] group-hover:text-[oklch(0.72_0.08_75)] transition-colors line-clamp-2">
              {displayName}
            </h3>
            {displayTitle && (
              <p className="text-xs souls-text text-[oklch(0.55_0.01_60)] mt-1">
                {displayTitle}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CharactersGrid({ characters, lang = "en", protagonistLabel = "Protagonist" }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-8">
      {characters.map((char, i) => (
        <CharacterCard
          key={char.id}
          char={char}
          index={i}
          lang={lang}
          protagonistLabel={protagonistLabel}
        />
      ))}
    </div>
  );
}
