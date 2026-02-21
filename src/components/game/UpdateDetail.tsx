
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Actualizacion } from "@/types/game";

interface Props {
  update: Actualizacion;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UpdateDetail({ update }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        {update.imagen_url && (
          <img
            src={update.imagen_url}
            alt={update.titulo}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.35) saturate(0.4)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260)] via-[oklch(0.08_0.005_260/40%)] to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Updates
          </Link>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5 uppercase">
              {update.tipo}
            </span>
            <span className="text-xs souls-text text-[oklch(0.45_0.01_60)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(update.fecha_publicacion)}
            </span>
          </div>
          <h1 className="souls-title text-4xl sm:text-5xl text-[oklch(0.88_0.01_60)] tracking-widest">
            {update.titulo}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[oklch(0.72_0.08_75/40%)]" />
            <h2 className="souls-title text-xs tracking-[0.4em] text-[oklch(0.72_0.08_75)]">
              CHRONICLE ENTRY
            </h2>
            <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
          </div>
          {update.contenido ? (
            <p className="souls-text text-[oklch(0.65_0.01_60)] leading-relaxed text-base">
              {update.contenido}
            </p>
          ) : (
            <p className="souls-text text-[oklch(0.45_0.01_60)] italic">
              {update.descripcion_corta}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
