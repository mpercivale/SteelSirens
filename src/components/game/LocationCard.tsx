
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Locacion } from "@/types/game";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/i18n";

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

interface Props {
  location: Locacion;
  index?: number;
  lang?: Language;
}

export default function LocationCard({ location, index = 0, lang = "en" }: Props) {
  const color = peligrosidadColors[location.peligrosidad ?? "media"] ?? peligrosidadColors.media;
  const tipoLabel = tipoLabels[location.tipo] ?? location.tipo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/locations/${location.slug}?lang=${lang}`}>
        <div className="group border border-[oklch(0.72_0.08_75/15%)] bg-[oklch(0.1_0.005_260/80%)] hover:border-[oklch(0.72_0.08_75/40%)] transition-all duration-300 overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            {location.imagen_url ? (
              <img
                src={location.imagen_url}
                alt={location.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.6) saturate(0.5)" }}
              />
            ) : (
              <div className="w-full h-full bg-[oklch(0.12_0.005_260)] flex items-center justify-center">
                <span className="text-4xl opacity-20">🗺</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260)] via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5 bg-[oklch(0.08_0.005_260/80%)]">
                {tipoLabel}
              </span>
              {!location.descubierto && (
                <span className="text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] border border-[oklch(0.55_0.01_60/40%)] px-2 py-0.5 bg-[oklch(0.08_0.005_260/80%)]">
                  Unknown
                </span>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="souls-title text-sm tracking-widest text-[oklch(0.88_0.01_60)] group-hover:text-[oklch(0.72_0.08_75)] transition-colors">
                {location.nombre}
              </h3>
              <span
                className="text-xs souls-title tracking-widest flex-shrink-0"
                style={{ color }}
              >
                {location.peligrosidad?.toUpperCase()}
              </span>
            </div>
            {location.descripcion_corta && (
              <p className="souls-text text-xs text-[oklch(0.45_0.01_60)] line-clamp-2">
                {location.descripcion_corta}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
