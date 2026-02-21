
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Objeto } from "@/types/game";
import { cn } from "@/lib/utils";
import { getItemsCopy, getItemContent, type Language } from "@/lib/i18n";

const rarezaColors: Record<string, string> = {
  comun: "oklch(0.55 0.01 60)",
  raro: "oklch(0.55 0.12 240)",
  epico: "oklch(0.55 0.15 290)",
  legendario: "oklch(0.72 0.08 75)",
};

interface Props {
  item: Objeto;
  index?: number;
  lang: Language;
}

export default function ItemCard({ item, index = 0, lang }: Props) {
  const color = rarezaColors[item.rareza ?? "comun"] ?? rarezaColors.comun;
  const copy = getItemsCopy(lang);
  const label = copy.rarity[item.rareza ?? "comun"] ?? copy.rarity.comun;
  const content = getItemContent(lang, item.id);
  const itemName = content?.name ?? item.nombre;
  const itemShortDesc = content?.shortDescription ?? item.descripcion_corta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/items/${item.slug}?lang=${lang}`}>
        <div
          className="group border bg-[oklch(0.1_0.005_260/80%)] hover:bg-[oklch(0.12_0.005_260)] transition-all duration-300 overflow-hidden"
          style={{ borderColor: `${color}30` }}
        >
          <div className="relative h-40 overflow-hidden">
            {item.imagen_url ? (
              <img
                src={item.imagen_url}
                alt={itemName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ filter: "brightness(0.7) saturate(0.6)" }}
              />
            ) : (
              <div className="w-full h-full bg-[oklch(0.15_0.005_260)] flex items-center justify-center">
                <span className="text-4xl opacity-20">⚔</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.1_0.005_260)] to-transparent" />
            <div
              className="absolute top-2 right-2 text-xs souls-title tracking-widest px-2 py-0.5 border"
              style={{ color, borderColor: `${color}60` }}
            >
              {label}
            </div>
          </div>
          <div className="p-4">
            <h3
              className="souls-title text-sm tracking-widest mb-1 transition-colors duration-200 group-hover:text-[oklch(0.72_0.08_75)]"
              style={{ color: "oklch(0.88 0.01 60)" }}
            >
              {itemName}
            </h3>
            {itemShortDesc && (
              <p className="souls-text text-xs text-[oklch(0.45_0.01_60)] line-clamp-2">
                {itemShortDesc}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
