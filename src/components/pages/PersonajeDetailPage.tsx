
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Personaje } from "@/types/game";

interface Props {
  personaje: Personaje;
}

export default function PersonajeDetailPage({ personaje }: Props) {
  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)]">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        {personaje.imagen_arte_url || personaje.imagen_png_url ? (
          <Image
            src={personaje.imagen_arte_url ?? personaje.imagen_png_url ?? ""}
            alt={personaje.nombre}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-[oklch(0.09_0.008_270)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.005_270)] via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        {/* Back button */}
        <Link
          href="/personajes"
          className="absolute top-24 left-6 flex items-center gap-2 text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <ArrowLeft size={14} />
          Personajes
        </Link>

        {/* Character info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[oklch(0.72_0.08_65)] text-xs tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
              {personaje.titulo}
            </p>
            <h1
              className="text-5xl md:text-7xl tracking-[0.1em] uppercase text-[oklch(0.95_0.02_60)] souls-glow"
              style={{ fontFamily: "var(--font-cinzel)", fontWeight: 900 }}
            >
              {personaje.nombre}
            </h1>
            <div className="flex gap-4 mt-4">
              {personaje.clase && (
                <span className="text-xs tracking-[0.2em] uppercase text-[oklch(0.55_0.02_60)] border border-[oklch(0.72_0.08_65/30%)] px-3 py-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {personaje.clase}
                </span>
              )}
              {personaje.origen && (
                <span className="text-xs tracking-[0.2em] uppercase text-[oklch(0.55_0.02_60)] border border-[oklch(0.72_0.08_65/30%)] px-3 py-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {personaje.origen}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lore content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="ornament-divider mb-10">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>

          <h2
            className="text-xl tracking-[0.3em] uppercase text-[oklch(0.72_0.08_65)] mb-6 text-center"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Historia
          </h2>

          <div
            className="text-[oklch(0.65_0.02_60)] text-lg leading-[2] text-justify"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            {personaje.lore?.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="ornament-divider mt-10">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
