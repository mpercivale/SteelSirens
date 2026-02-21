
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Skull } from "lucide-react";
import type { Locacion } from "@/types/game";

interface Props {
  locaciones: Locacion[];
}

const TIPOS = ["todos", "region", "mazmorra", "secreto"];

const PELIGROSIDAD_STYLES: Record<string, string> = {
  baja: "text-emerald-400 border-emerald-400/40",
  media: "text-yellow-400 border-yellow-400/40",
  alta: "text-orange-400 border-orange-400/40",
  muy_alta: "text-red-400 border-red-400/40",
  desconocida: "text-gray-400 border-gray-400/40",
};

export default function LocacionesPage({ locaciones }: Props) {
  const [activeTipo, setActiveTipo] = useState("todos");

  const filtered = activeTipo === "todos"
    ? locaciones
    : locaciones.filter((l) => l.tipo === activeTipo);

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="ornament-divider mb-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-[0.2em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            Locaciones
          </h1>
          <div className="ornament-divider mt-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>

        {/* Type filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TIPOS.map((tipo) => (
            <button
              key={tipo}
              onClick={() => setActiveTipo(tipo)}
              className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
                activeTipo === tipo
                  ? "border-[oklch(0.72_0.08_65)] text-[oklch(0.72_0.08_65)] bg-[oklch(0.72_0.08_65/10%)]"
                  : "border-[oklch(0.72_0.08_65/20%)] text-[oklch(0.55_0.02_60)] hover:border-[oklch(0.72_0.08_65/50%)]"
              }`}
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {tipo === "todos" ? "Todas" : tipo === "region" ? "Regiones" : tipo === "mazmorra" ? "Mazmorras" : "Secretos"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/locaciones/${loc.slug}`}
                className="group block border border-[oklch(0.72_0.08_65/15%)] hover:border-[oklch(0.72_0.08_65/50%)] overflow-hidden transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  {loc.imagen_url ? (
                    <Image
                      src={loc.imagen_url}
                      alt={loc.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[oklch(0.09_0.008_270)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Undiscovered overlay */}
                  {!loc.descubierto && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-[oklch(0.45_0.02_60)] text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                        ??? Desconocido
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[oklch(0.72_0.08_65)] border border-[oklch(0.72_0.08_65/40%)] px-2 py-0.5 bg-black/60" style={{ fontFamily: "var(--font-cinzel)" }}>
                      {loc.tipo}
                    </span>
                  </div>

                  <div className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase border px-2 py-0.5 bg-black/60 ${PELIGROSIDAD_STYLES[loc.peligrosidad ?? "media"]}`} style={{ fontFamily: "var(--font-cinzel)" }}>
                    <Skull size={10} />
                    {loc.peligrosidad?.replace("_", " ")}
                  </div>
                </div>

                <div className="p-5 bg-[oklch(0.08_0.006_270)]">
                  <h3 className="text-[oklch(0.88_0.02_60)] text-base tracking-[0.1em] uppercase group-hover:text-[oklch(0.72_0.08_65)] transition-colors mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {loc.nombre}
                  </h3>
                  <p className="text-[oklch(0.45_0.02_60)] text-sm leading-relaxed line-clamp-2 italic" style={{ fontFamily: "var(--font-crimson)" }}>
                    {loc.descripcion_corta}
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
