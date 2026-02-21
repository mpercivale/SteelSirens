
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Skull } from "lucide-react";
import type { Locacion } from "@/types/game";

interface Props {
  locacion: Locacion;
}

const PELIGROSIDAD_STYLES: Record<string, string> = {
  baja: "text-emerald-400 border-emerald-400/40",
  media: "text-yellow-400 border-yellow-400/40",
  alta: "text-orange-400 border-orange-400/40",
  muy_alta: "text-red-400 border-red-400/40",
  desconocida: "text-gray-400 border-gray-400/40",
};

export default function LocacionDetailPage({ locacion }: Props) {
  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)]">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        {locacion.imagen_url && (
          <Image
            src={locacion.imagen_url}
            alt={locacion.nombre}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.005_270)] via-black/50 to-black/30" />

        {!locacion.descubierto && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <p className="text-[oklch(0.45_0.02_60)] text-sm tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              ??? Lugar Desconocido
            </p>
          </div>
        )}

        <Link
          href="/locaciones"
          className="absolute top-24 left-6 flex items-center gap-2 text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <ArrowLeft size={14} />
          Locaciones
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-3 mb-3">
              <span className="text-xs tracking-[0.2em] uppercase text-[oklch(0.72_0.08_65)] border border-[oklch(0.72_0.08_65/40%)] px-3 py-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                {locacion.tipo}
              </span>
              <span className={`flex items-center gap-1 text-xs tracking-[0.15em] uppercase border px-3 py-1 ${PELIGROSIDAD_STYLES[locacion.peligrosidad ?? "media"]}`} style={{ fontFamily: "var(--font-cinzel)" }}>
                <Skull size={12} />
                {locacion.peligrosidad?.replace("_", " ")}
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl tracking-[0.1em] uppercase text-[oklch(0.95_0.02_60)] souls-glow"
              style={{ fontFamily: "var(--font-cinzel)", fontWeight: 900 }}
            >
              {locacion.nombre}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Lore */}
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
            Historia del Lugar
          </h2>
          <div
            className="text-[oklch(0.65_0.02_60)] text-lg leading-[2] text-justify"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            {locacion.descripcion_lore?.split("\n").map((p, i) => (
              <p key={i} className="mb-6">{p}</p>
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
