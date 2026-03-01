
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Personaje } from "@/types/game";
import { cn } from "@/lib/utils";
import CharacterGlow from "@/components/game/CharacterGlow";
import { getCharacterCircleContent, getCharacterCircleIdentities, getHomeCopy, type Language } from "@/lib/i18n";

interface Props {
  characters: Personaje[];
  lang?: Language;
}

// Frecuencia de pulso por personaje (en segundos)
const getCharacterPulseDuration = (slug: string): number => {
  switch (slug) {
    case "el-juez": return 1.8; // Más rápido (intenso)
    case "la-doncella": return 3.2; // Suave y lento
    case "el-escudero": return 2.4; // Moderado
    case "el-perro": return 2.8; // Lento
    case "el-hechicero": return 2.2; // Rápido
    case "el-viejo-manto-blanco": return 3.5; // Muy lento
    case "ruth": return 2.0; // Rápido
    default: return 2.5;
  }
};

export default function CharacterCircle({ characters, lang = "en" }: Props) {
  const t = getHomeCopy(lang);
  const [activeIndex, setActiveIndex] = useState(0);
  const [randomQuote, setRandomQuote] = useState("");
  const [activeDisplay, setActiveDisplay] = useState<{ name: string; title?: string }>({ name: "", title: "" });
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const lastQuoteByCharacterRef = useRef<Record<string, string>>({});


  const count = characters.length;

  useEffect(() => {
    if (count > 0) {
      setActiveIndex(Math.floor(Math.random() * count));
    }
  }, [count]);

  // Get random quote for active character
  useEffect(() => {
    const active = characters[activeIndex];
    if (active) {
      const identities = getCharacterCircleIdentities(lang, active);
      const picked = identities[Math.floor(Math.random() * identities.length)] ?? identities[0];
      setActiveDisplay(picked ?? { name: "", title: "" });
    } else {
      setActiveDisplay({ name: "", title: "" });
    }

    const localized = active ? getCharacterCircleContent(lang, active) : null;
    if (localized?.quotes && localized.quotes.length > 0) {
      const characterKey = active?.slug ?? active?.id ?? String(activeIndex);
      const previousQuote = lastQuoteByCharacterRef.current[characterKey] ?? "";

      let selectedQuote = localized.quotes[Math.floor(Math.random() * localized.quotes.length)];
      if (localized.quotes.length > 1) {
        let attempts = 0;
        while (selectedQuote === previousQuote && attempts < 8) {
          selectedQuote = localized.quotes[Math.floor(Math.random() * localized.quotes.length)];
          attempts += 1;
        }
      }

      lastQuoteByCharacterRef.current[characterKey] = selectedQuote;
      setRandomQuote(selectedQuote);
    } else {
      setRandomQuote(localized?.shortDescription || "");
    }
  }, [activeIndex, characters[activeIndex]?.id, lang]);
  // Auto-rotate after 5 seconds
  useEffect(() => {
    const startAutoRotate = () => {
      if (autoRotateRef.current) {
        clearTimeout(autoRotateRef.current);
      }
      autoRotateRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % count);
      }, 5000);
    };

    startAutoRotate();

    return () => {
      if (autoRotateRef.current) {
        clearTimeout(autoRotateRef.current);
      }
    };
  }, [activeIndex, count]);

  const rotate = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((prev) => (prev + dir + count) % count);
    },
    [count]
  );

  const getCharacterStyle = (index: number) => {
    const offset = ((index - activeIndex + count) % count);
    const normalizedOffset = offset > count / 2 ? offset - count : offset;
    const angle = (normalizedOffset / count) * 2 * Math.PI;
    const radiusX = 380;
    const radiusY = 120;
    const x = Math.sin(angle) * radiusX;
    const y = -Math.cos(angle) * radiusY + radiusY - 60;
    const scale = normalizedOffset === 0 ? 1.44 : Math.max(0.5, 1.2 - Math.abs(normalizedOffset) * 0.18);
    const zIndex = normalizedOffset === 0 ? 20 : 10 - Math.abs(normalizedOffset);
    const opacity = Math.abs(normalizedOffset) > 3 ? 0 : Math.max(0.25, 1 - Math.abs(normalizedOffset) * 0.2);
    return { x, y, scale, zIndex, opacity };
  };

  const active = characters[activeIndex];
  const activeLocalized = active
    ? getCharacterCircleContent(lang, active)
    : { name: "", title: "", shortDescription: "", quotes: [] };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Circle stage - increased height for full character display */}
      <div 
        className="relative w-full flex items-end justify-center" 
        style={{ 
          height: 500,
          overflow: "visible"
        }}
      >
        {/* Stone floor */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-35 rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, oklch(0.18 0.005 260 / 75%) 0%, transparent 70%)",
          }}
        />

        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute left-0 right-0 h-60 pointer-events-none"
          style={{
            bottom: "-200px",
            zIndex: 25,
            background: "linear-gradient(to top, oklch(0.08 0.005 260 / 95%) 0%, oklch(0.08 0.005 260 / 100%) 35%, transparent 100%)",
          }}
        />

        {/* Navigation arrows - positioned at circle edges */}
        <button
          onClick={() => rotate(-1)}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-[oklch(0.72_0.08_75/40%)] flex items-center justify-center text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => rotate(1)}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-[oklch(0.72_0.08_75/40%)] flex items-center justify-center text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {characters.map((char, index) => {
          const { x, y, scale, zIndex, opacity } = getCharacterStyle(index);
          const isActive = index === activeIndex;
          const glowColor = char.color_glow || char.colorGlow || "#ffffff";
          const localizedChar = getCharacterCircleContent(lang, char);

          return (
            <motion.div
              key={char.id}
              className="absolute bottom-0 cursor-pointer"
              animate={{ x, y: -y, scale, opacity }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{ 
                zIndex,
                overflow: "visible"
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className="relative flex flex-col items-center"
                style={{ overflow: "visible" }}
              >
                {/* Animated character glow */}
                {isActive && (
                  <div className="absolute inset-0 w-full h-full" style={{ width: 300, height: 500 }}>
                    <CharacterGlow
                      characterSlug={char.slug}
                      colorGlow={glowColor}
                      isActive={isActive}
                    />
                  </div>
                )}

                {/* Character image - full PNG without container */}
                {char.imagen_png_url ? (
                  isActive ? (
                    <Link href={`/characters/${char.slug}?lang=${lang}`}>
                      <motion.img
                        src={char.imagen_png_url}
                        alt={localizedChar.name}
                        className="object-contain cursor-pointer"
                        style={{
                          width: "auto",
                          height: 400,
                          maxWidth: "none",
                        }}
                        animate={{
                          filter: char.slug === "ruth"
                            ? [
                                `drop-shadow(0 0 1px #ffc0ff44) drop-shadow(0 0 3px #aeaeff33) drop-shadow(0 0 5px #FFE4F022)`,
                                `drop-shadow(0 0 1.5px #adf5ff66) drop-shadow(0 0 4px #abf5ff44) drop-shadow(0 0 7px #E6E6FA33)`,
                                `drop-shadow(0 0 1px #dec8ff44) drop-shadow(0 0 3px #e4bbff33) drop-shadow(0 0 5px #FAF0FF22)`,
                                `drop-shadow(0 0 1.5px #FFE4F166) drop-shadow(0 0 4px #daa2ff44) drop-shadow(0 0 7px #F5E6FF33)`,
                                `drop-shadow(0 0 1px #ffb0ff44) drop-shadow(0 0 3px #E6E6FA33) drop-shadow(0 0 5px #FFE4F022)`,
                              ]
                            : [
                                `drop-shadow(0 0 1px ${glowColor}41) drop-shadow(0 0 3px ${glowColor}30) drop-shadow(0 0 5px ${glowColor}20)`,
                                `drop-shadow(0 0 2.2px ${glowColor}83) drop-shadow(0 0 5.5px ${glowColor}5E) drop-shadow(0 0 9px ${glowColor}38)`,
                                `drop-shadow(0 0 1px ${glowColor}41) drop-shadow(0 0 3px ${glowColor}30) drop-shadow(0 0 5px ${glowColor}20)`,
                              ],
                        }}
                        transition={{
                          filter: {
                            duration: getCharacterPulseDuration(char.slug),
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      />
                    </Link>
                  ) : (
                    <motion.img
                      src={char.imagen_png_url}
                      alt={localizedChar.name}
                      className="object-contain"
                      style={{
                        width: "auto",
                        height: 400,
                        maxWidth: "none",
                      }}
                      animate={{
                        filter: "grayscale(50%) brightness(0.7)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )
                ) : (
                  <div 
                    className="flex items-center justify-center"
                    style={{ width: 200, height: 400 }}
                  >
                    <span className="text-[oklch(0.72_0.08_75)] text-6xl souls-title">
                      {localizedChar.name[0]}
                    </span>
                  </div>
                )}

                {/* Circular ground gradient - borderless */}
                <div
                  className="absolute rounded-full"
                  style={{
                    bottom: -2,
                    width: isActive ? 210 : 160,
                    height: isActive ? 34 : 24,
                    background:
                      "radial-gradient(ellipse at center, oklch(0 0 0 / 80%) 0%, oklch(0 0 0 / 40%) 40%, transparent 78%)",
                    filter: "blur(10px)",
                    transition: "width 0.3s, height 0.3s",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    bottom: 2,
                    width: isActive ? 120 : 90,
                    height: isActive ? 14 : 10,
                    background:
                      "radial-gradient(ellipse at center, oklch(0.72 0.08 75 / 22%) 0%, transparent 72%)",
                    filter: "blur(6px)",
                    transition: "width 0.3s, height 0.3s",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators - positioned below characters */}
      <div className="flex gap-1.5 mt-16 mb-6 relative z-30">
        {characters.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-1 transition-all duration-200",
              i === activeIndex
                ? "bg-[oklch(0.72_0.08_75)] w-8"
                : "bg-[oklch(0.72_0.08_75/30%)] w-1.5"
            )}
          />
        ))}
      </div>

      {/* Name plate - positioned below indicators */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-center px-4 relative z-30"
        >
          {(activeDisplay.title || activeLocalized.title) && (
            <p className="text-[oklch(0.55_0.01_60)] text-xs souls-title tracking-widest mb-1 uppercase">
              {activeDisplay.title || activeLocalized.title}
            </p>
          )}
          <h2 className="souls-title text-3xl text-[oklch(0.72_0.08_75)] tracking-widest">
            {activeDisplay.name || activeLocalized.name}
          </h2>
          <div className="w-16 h-px bg-[oklch(0.72_0.08_75/50%)] mx-auto my-3" />
          {randomQuote && (
            <p className="souls-text text-[oklch(0.55_0.01_60)] text-sm max-w-md mx-auto italic">
              "{randomQuote}"
            </p>
          )}
          <Link
            href={`/characters/${active?.slug}?lang=${lang}`}
            className="inline-block mt-4 px-6 py-2 border border-[oklch(0.72_0.08_75/40%)] text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-widest hover:bg-[oklch(0.72_0.08_75/10%)] transition-all duration-200"
          >
            {t.characterCircle.readLore}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Scroll indicator */}
      <div className="mt-8 flex flex-col items-center gap-2 relative z-30">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[oklch(0.72_0.08_75/60%)] to-transparent"
        />
      </div>
    </div>
  );
}
