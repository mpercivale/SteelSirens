
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Objeto } from "@/types/game";

interface Props {
  objeto: Objeto;
}

const RAREZA_STYLES: Record<string, string> = {
  comun: "text-gray-400 border-gray-400/40",
  raro: "text-blue-400 border-blue-400/40",
  epico: "text-purple-400 border-purple-400/40",
  legendario: "text-[oklch(0.72_0.08_65)] border-[oklch(0.72_0.08_65/40%)] souls-glow",
};

export default function ObjetoDetailPage({ objeto }: Props) {
  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/objetos"
          className="inline-flex items-center gap-2 text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] transition-colors text-xs tracking-[0.2em] uppercase mb-12"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <ArrowLeft size={14} />
          Objetos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square border border-[oklch(0.72_0.08_65/20%)] overflow-hidden"
          >
            {objeto.imagen_url ? (
              <Image
                src={objeto.imagen_url}
                alt={objeto.nombre}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[oklch(0.09_0.008_270)] flex items-center justify-center">
                <span className="text-[oklch(0.35_0.02_60)] text-6xl">⚔</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={`text-xs tracking-[0.2em] uppercase border px-3 py-1 ${RAREZA_STYLES[objeto.rareza ?? "comun"]}`} style={{ fontFamily: "var(--font-cinzel)" }}>
              {objeto.rareza}
            </span>
            <h1
              className="text-3xl md:text-4xl tracking-[0.1em] uppercase text-[oklch(0.88_0.02_60)] mt-4 mb-2 souls-glow"
              style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
            >
              {objeto.nombre}
            </h1>

            <div className="ornament-divider my-6">
              <span className="text-[oklch(0.72_0.08_65)] text-sm">✦</span>
            </div>

            <p
              className="text-[oklch(0.65_0.02_60)] text-base leading-relaxed italic mb-6"
              style={{ fontFamily: "var(--font-crimson)" }}
            >
              {objeto.descripcion_lore}
            </p>

            {objeto.como_obtener && (
              <div className="border border-[oklch(0.72_0.08_65/20%)] p-4">
                <p className="text-[oklch(0.72_0.08_65)] text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Cómo Obtener
                </p>
                <p className="text-[oklch(0.55_0.02_60)] text-sm" style={{ fontFamily: "var(--font-crimson)" }}>
                  {objeto.como_obtener}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
