
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Personaje } from "@/types/game";
import CharacterGlow from "@/components/game/CharacterGlow";

interface Props {
  personajes: Personaje[];
}

const CIRCLE_RADIUS = 380;
const VISIBLE_COUNT = 7;

function getCirclePositions(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
    };
  });
}

export default function CharacterCircle({ personajes }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = personajes.length;
  const positions = getCirclePositions(Math.min(total, VISIBLE_COUNT), CIRCLE_RADIUS);

  const getVisibleChars = useCallback(() => {
    const visible = [];
    const half = Math.floor(VISIBLE_COUNT / 2);
    for (let i = -half; i <= half; i++) {
      const idx = ((activeIndex + i) % total + total) % total;
      visible.push({ char: personajes[idx], offset: i });
    }
    return visible;
  }, [activeIndex, total, personajes]);

  const rotate = (dir: number) => {
    setDirection(dir);
    setActiveIndex((prev) => ((prev + dir) % total + total) % total);
  };

  const visibleChars = getVisibleChars();
  const activeChar = personajes[activeIndex];

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Circle stage - increased height significantly for full character display */}
      <div
        className="relative w-full"
        style={{ height: 1100 }}
      >
        {/* Characters arranged in ellipse */}
        <div className="absolute inset-0 flex items-center justify-center">
          {visibleChars.map(({ char, offset }, i) => {
            const posIdx = i;
            const pos = positions[posIdx] ?? { x: 0, y: 0 };
            const isCenter = offset === 0;
            const distFromCenter = Math.abs(offset);
            const scale = isCenter ? 3.36 : Math.max(1.2, 2.4 - distFromCenter * 0.36);
            const zIndex = isCenter ? 20 : 10 - distFromCenter;
            const opacity = isCenter ? 1 : Math.max(0.3, 1 - distFromCenter * 0.25);

            const glowColor = char.color_glow || char.colorGlow || "#ffffff";

            return (
              <motion.div
                key={`${char.id}-${activeIndex}`}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  zIndex,
                  opacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  if (offset !== 0) rotate(offset > 0 ? 1 : -1);
                }}
              >
                {/* Animated character glow */}
                {isCenter && (
                  <div className="absolute inset-0 w-full h-full" style={{ width: 400, height: 600 }}>
                    <CharacterGlow
                      characterSlug={char.slug}
                      colorGlow={glowColor}
                      isActive={isCenter}
                    />
                  </div>
                )}

                {/* Character shadow - positioned below the image */}
                <div
                  className="absolute w-48 h-10 rounded-full"
                  style={{
                    bottom: 0,
                    background: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)",
                    filter: "blur(12px)",
                  }}
                />

                {/* Character image - full PNG, no container, no cropping, doubled size */}
                {char.imagen_png_url ? (
                  <div className="relative" style={{ width: "auto", height: "auto" }}>
                    <Image
                      src={char.imagen_png_url}
                      alt={char.nombre || char.name}
                      width={1000}
                      height={1500}
                      className="object-contain"
                      priority={isCenter}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "none",
                        maxHeight: "none",
                        filter: isCenter
                          ? `drop-shadow(0 0 20px ${glowColor}66)`
                          : "none",
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-80 h-[500px] flex items-center justify-center">
                    <span className="text-[oklch(0.55_0.02_60)] text-4xl">?</span>
                  </div>
                )}

                {/* Name label for center */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <p
                      className="text-[oklch(0.55_0.02_60)] text-xs tracking-[0.25em] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {char.titulo || char.title || char.clase || char.class}
                    </p>
                    <p
                      className="text-[oklch(0.88_0.02_60)] text-lg tracking-[0.15em] uppercase souls-glow"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {char.nombre || char.name}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => rotate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 border border-[oklch(0.72_0.08_65/40%)] flex items-center justify-center text-[oklch(0.72_0.08_65)] hover:border-[oklch(0.72_0.08_65)] hover:bg-[oklch(0.72_0.08_65/10%)] transition-all duration-300"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => rotate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 border border-[oklch(0.72_0.08_65/40%)] flex items-center justify-center text-[oklch(0.72_0.08_65)] hover:border-[oklch(0.72_0.08_65)] hover:bg-[oklch(0.72_0.08_65/10%)] transition-all duration-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Active character info panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChar.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg text-center px-4 pb-8"
        >
          <p
            className="text-[oklch(0.55_0.02_60)] text-xs tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            {activeChar.clase || activeChar.class || "Desconocido"} · {activeChar.origen || activeChar.origin || "Origen desconocido"}
          </p>
          <p
            className="text-[oklch(0.72_0.06_60)] text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            {activeChar.descripcion_corta || activeChar.shortDescription}
          </p>
          <Link
            href={`/characters/${activeChar.slug}`}
            className="inline-block mt-4 px-6 py-2 border border-[oklch(0.72_0.08_65/50%)] text-[oklch(0.72_0.08_65)] text-xs tracking-[0.2em] uppercase hover:bg-[oklch(0.72_0.08_65/10%)] hover:border-[oklch(0.72_0.08_65)] transition-all duration-300"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Ver Lore
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex gap-2 pb-4">
        {personajes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className={`w-1.5 h-1.5 transition-all duration-300 ${
              i === activeIndex
                ? "bg-[oklch(0.72_0.08_65)] w-4"
                : "bg-[oklch(0.35_0.02_60)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
