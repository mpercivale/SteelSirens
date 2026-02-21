
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Actualizacion } from "@/types/game";

interface Props {
  actualizaciones: Actualizacion[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function TypeBadge({ tipo }: { tipo: string }) {
  const labels: Record<string, string> = {
    personaje: "Personaje",
    locacion: "Locación",
    objeto: "Objeto",
    historia: "Historia",
  };
  return (
    <span
      className="text-[10px] tracking-[0.3em] uppercase text-[oklch(0.72_0.08_65)] border border-[oklch(0.72_0.08_65/40%)] px-2 py-0.5"
      style={{ fontFamily: "var(--font-cinzel)" }}
    >
      {labels[tipo] ?? tipo}
    </span>
  );
}

export default function LatestSection({ actualizaciones }: Props) {
  const featured = actualizaciones.find((a) => a.es_destacado) ?? actualizaciones[0];
  const rest = actualizaciones.filter((a) => a.id !== featured?.id).slice(0, 2);

  return (
    <section className="relative py-24 px-4 bg-[oklch(0.06_0.005_270)]">
      {/* Top border ornament */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.08_65/40%)] to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="ornament-divider mb-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
          <h2
            className="text-3xl md:text-4xl tracking-[0.2em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            Último
          </h2>
          <div className="ornament-divider mt-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>

        {/* Featured card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Link href={`/cronicas/${featured.slug}`} className="group block">
              <div className="relative overflow-hidden border border-[oklch(0.72_0.08_65/20%)] group-hover:border-[oklch(0.72_0.08_65/50%)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-72 md:h-96 w-full">
                  {featured.imagen_url && (
                    <Image
                      src={featured.imagen_url}
                      alt={featured.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <TypeBadge tipo={featured.tipo} />
                  <h3
                    className="text-2xl md:text-3xl tracking-[0.1em] uppercase text-[oklch(0.88_0.02_60)] mt-3 mb-2 souls-glow group-hover:text-[oklch(0.72_0.08_65)] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
                  >
                    {featured.titulo}
                  </h3>
                  <p
                    className="text-[oklch(0.65_0.02_60)] text-sm leading-relaxed max-w-2xl mb-4"
                    style={{ fontFamily: "var(--font-crimson)" }}
                  >
                    {featured.descripcion_corta}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[oklch(0.45_0.02_60)] text-xs">
                      <Calendar size={12} />
                      <span style={{ fontFamily: "var(--font-cinzel)" }}>
                        {formatDate(featured.fecha_publicacion)}
                      </span>
                    </div>
                    <span className="text-[oklch(0.72_0.08_65)] text-xs flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Leer más <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Secondary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <Link href={`/cronicas/${act.slug}`} className="group flex gap-4 border border-[oklch(0.72_0.08_65/15%)] hover:border-[oklch(0.72_0.08_65/40%)] p-4 transition-all duration-300">
                <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
                  {act.imagen_url && (
                    <Image
                      src={act.imagen_url}
                      alt={act.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="flex flex-col justify-center">
                  <TypeBadge tipo={act.tipo} />
                  <h4
                    className="text-sm tracking-[0.08em] uppercase text-[oklch(0.78_0.02_60)] mt-2 group-hover:text-[oklch(0.72_0.08_65)] transition-colors"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {act.titulo}
                  </h4>
                  <p className="text-[oklch(0.45_0.02_60)] text-xs mt-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {formatDate(act.fecha_publicacion)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.08_65/40%)] to-transparent" />
    </section>
  );
}
