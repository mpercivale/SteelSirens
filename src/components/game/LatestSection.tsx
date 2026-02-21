
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Actualizacion } from "@/types/game";
import { getHomeCopy, type Language } from "@/lib/i18n";

interface Props {
  updates: Actualizacion[];
  lang: Language;
}

function formatDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LatestSection({ updates, lang }: Props) {
  const t = getHomeCopy(lang);
  const featured = updates.find((u) => u.es_destacado) ?? updates[0];
  const rest = updates.filter((u) => u.id !== featured?.id).slice(0, 2);

  if (!featured) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
        <div className="text-center">
          <p className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-[0.4em] mb-1">
            {t.latest.eyebrow}
          </p>
          <h2 className="souls-title text-2xl text-[oklch(0.88_0.01_60)] tracking-widest">
            {t.latest.title}
          </h2>
        </div>
        <div className="flex-1 h-px bg-[oklch(0.72_0.08_75/20%)]" />
      </div>

      {/* Featured update */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border border-[oklch(0.72_0.08_75/20%)] group cursor-pointer mb-6"
      >
        <Link href={`/updates/${featured.slug}?lang=${lang}`}>
          <div className="relative h-80 sm:h-96 overflow-hidden">
            {featured.imagen_url && (
              <img
                src={featured.imagen_url}
                alt={featured.titulo}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.005_260)] via-[oklch(0.06_0.005_260/60%)] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.06_0.005_260/80%)] to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-widest uppercase border border-[oklch(0.72_0.08_75/40%)] px-2 py-0.5">
                {featured.tipo}
              </span>
              <span className="text-[oklch(0.55_0.01_60)] text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(featured.fecha_publicacion, t.dateLocale)}
              </span>
            </div>
            <h3 className="souls-title text-2xl sm:text-3xl text-[oklch(0.88_0.01_60)] tracking-widest mb-3">
              {featured.titulo}
            </h3>
            <p className="souls-text text-[oklch(0.55_0.01_60)] text-sm max-w-xl mb-4">
              {featured.descripcion_corta}
            </p>
            <span className="inline-flex items-center gap-2 text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-widest group-hover:gap-3 transition-all duration-200">
              {t.latest.readMore} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Secondary updates */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/updates/${update.slug}?lang=${lang}`}
                className="flex gap-4 border border-[oklch(0.72_0.08_75/15%)] p-4 group hover:border-[oklch(0.72_0.08_75/40%)] transition-all duration-200"
              >
                {update.imagen_url && (
                  <div className="w-24 h-20 overflow-hidden flex-shrink-0">
                    <img
                      src={update.imagen_url}
                      alt={update.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-[oklch(0.72_0.08_75)] text-xs souls-title tracking-widest uppercase mb-1">
                    {update.tipo}
                  </span>
                  <h4 className="souls-title text-sm text-[oklch(0.88_0.01_60)] tracking-wide mb-1 group-hover:text-[oklch(0.72_0.08_75)] transition-colors">
                    {update.titulo}
                  </h4>
                  <span className="text-[oklch(0.45_0.01_60)] text-xs">
                    {formatDate(update.fecha_publicacion, t.dateLocale)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
