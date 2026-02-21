
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Actualizacion } from "@/types/game";
import { type Language } from "@/lib/i18n";

interface Props {
  updates: Actualizacion[];
  lang?: Language;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UpdatesList({ updates, lang = "en" }: Props) {
  return (
    <div className="space-y-6">
      {updates.map((update, i) => (
        <motion.div
          key={update.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Link href={`/updates/${update.slug}?lang=${lang}`}>
            <div className="group flex gap-6 border border-[oklch(0.72_0.08_75/15%)] bg-[oklch(0.1_0.005_260/80%)] hover:border-[oklch(0.72_0.08_75/40%)] transition-all duration-300 overflow-hidden">
              {update.imagen_url && (
                <div className="w-40 sm:w-56 flex-shrink-0 overflow-hidden">
                  <img
                    src={update.imagen_url}
                    alt={update.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "brightness(0.6) saturate(0.5)" }}
                  />
                </div>
              )}
              <div className="flex flex-col justify-center py-6 pr-6">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5 uppercase">
                    {update.tipo}
                  </span>
                  {update.es_destacado && (
                    <span className="text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/10%)] px-2 py-0.5">
                      ✦ Featured
                    </span>
                  )}
                  <span className="text-xs souls-text text-[oklch(0.45_0.01_60)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(update.fecha_publicacion)}
                  </span>
                </div>
                <h2 className="souls-title text-lg sm:text-xl text-[oklch(0.88_0.01_60)] tracking-widest mb-2 group-hover:text-[oklch(0.72_0.08_75)] transition-colors">
                  {update.titulo}
                </h2>
                {update.descripcion_corta && (
                  <p className="souls-text text-sm text-[oklch(0.55_0.01_60)] mb-4 line-clamp-2">
                    {update.descripcion_corta}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-xs souls-title tracking-widest text-[oklch(0.72_0.08_75)] group-hover:gap-3 transition-all duration-200">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
