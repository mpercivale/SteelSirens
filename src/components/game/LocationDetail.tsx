
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locacion } from "@/types/game";

interface Props {
  location: Locacion;
}

const peligrosidadColors: Record<string, string> = {
  baja: "oklch(0.6 0.12 145)",
  media: "oklch(0.72 0.08 75)",
  alta: "oklch(0.65 0.15 30)",
  extrema: "oklch(0.55 0.2 15)",
  desconocida: "oklch(0.55 0.01 60)",
};

const tipoLabels: Record<string, string> = {
  region: "Region",
  mazmorra: "Dungeon",
  secreto: "Secret",
};

export default function LocationDetail({ location }: Props) {
  const color = peligrosidadColors[location.peligrosidad ?? "media"] ?? peligrosidadColors.media;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        {location.imagen_url && (
          <img
            src={location.imagen_url}
            alt={location.nombre}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.35) saturate(0.4)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260)] via-[oklch(0.08_0.005_260/30%)] to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Locations
          </Link>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5">
              {tipoLabels[location.tipo] ?? location.tipo}
            </span>
            <span
              className="text-xs souls-title tracking-widest border px-2 py-0.5"
              style={{ color, borderColor: `${color}60` }}
            >
              Danger: {location.peligrosidad?.toUpperCase()}
            </span>
            {!location.descubierto && (
              <span className="text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] border border-[oklch(0.55_0.01_60/40%)] px-2 py-0.5">
                Unknown
              </span>
            )}
          </div>
          <h1 className="souls-title text-5xl sm:text-6xl text-[oklch(0.88_0.01_60)] tracking-widest">
            {location.nombre}
          </h1>
        </div>
      </div>

      {/* Lore */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-[oklch(0.72_0.08_75/40%)]" />
              <h2 className="souls-title text-xs tracking-[0.4em] text-[oklch(0.72_0.08_75)]">
                CHRONICLES
              </h2>
              <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
            </div>
            {location.descripcion_lore ? (
              <p className="souls-text text-[oklch(0.65_0.01_60)] leading-relaxed text-base">
                {location.descripcion_lore}
              </p>
            ) : (
              <p className="souls-text text-[oklch(0.45_0.01_60)] italic">
                The history of this place has been lost to time...
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
