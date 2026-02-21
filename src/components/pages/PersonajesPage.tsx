
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Personaje } from "@/types/game";

interface Props {
  personajes: Personaje[];
}

const RAREZA_COLORS: Record<string, string> = {
  vivo: "text-emerald-400 border-emerald-400/40",
  muerto: "text-red-400 border-red-400/40",
  desconocido: "text-gray-400 border-gray-400/40",
};

export default function PersonajesPage({ personajes }: Props) {
  const [filter, setFilter] = useState<string>("todos");
  const clases = ["todos", ...Array.from(new Set(personajes.map((p) => p.clase).filter(Boolean)))];

  const filtered = filter === "todos" ? personajes : personajes.filter((p) => p.clase === filter);

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="ornament-divider mb-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-[0.2em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            Personajes
          </h1>
          <div className="ornament-divider mt-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {clases.map((clase) => (
            <button
              key={clase}
              onClick={() => setFilter(clase ?? "todos")}
              className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                filter === clase
                  ? "border-[oklch(0.72_0.08_65)] text-[oklch(0.72_0.08_65)] bg-[oklch(0.72_0.08_65/10%)]"
                  : "border-[oklch(0.72_0.08_65/20%)] text-[oklch(0.55_0.02_60)] hover:border-[oklch(0.72_0.08_65/50%)]"
              }`}
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {clase}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((personaje, i) => (
            <motion.div
              key={personaje.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/personajes/${personaje.slug}`}
                className="group block border border-[oklch(0.72_0.08_65/15%)] hover:border-[oklch(0.72_0.08_65/50%)] overflow-hidden transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  {personaje.imagen_png_url ? (
                    <Image
                      src={personaje.imagen_png_url}
                      alt={personaje.nombre}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[oklch(0.1_0.008_270)] flex items-center justify-center">
                      <span className="text-[oklch(0.35_0.02_60)] text-4xl">?</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  {personaje.es_protagonista && (
                    <div className="absolute top-2 right-2 text-[10px] tracking-[0.2em] uppercase text-[oklch(0.72_0.08_65)] border border-[oklch(0.72_0.08_65/50%)] px-2 py-0.5 bg-black/60" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Protagonista
                    </div>
                  )}
                </div>
                <div className="p-4 bg-[oklch(0.08_0.006_270)]">
                  <p className="text-[oklch(0.45_0.02_60)] text-[10px] tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {personaje.clase}
                  </p>
                  <h3 className="text-[oklch(0.88_0.02_60)] text-sm tracking-[0.1em] uppercase group-hover:text-[oklch(0.72_0.08_65)] transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {personaje.nombre}
                  </h3>
                  <p className="text-[oklch(0.45_0.02_60)] text-xs mt-1 italic" style={{ fontFamily: "var(--font-crimson)" }}>
                    {personaje.titulo}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
