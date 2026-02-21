
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Objeto, Categoria } from "@/types/game";
import { getItemsCopy, getItemCategoryName, getItemContent, type Language } from "@/lib/i18n";
import { useState } from "react";
import ViewerToggle from "./ViewerToggle";
import ModelViewer3D from "./ModelViewer3D";

interface Props {
  item: Objeto;
  category?: Categoria;
  subcategory?: Categoria;
  lang: Language;
}

const rarezaColors: Record<string, string> = {
  comun: "oklch(0.55 0.01 60)",
  raro: "oklch(0.55 0.12 240)",
  epico: "oklch(0.55 0.15 290)",
  legendario: "oklch(0.72 0.08 75)",
};

export default function ItemDetail({ item, category, subcategory, lang }: Props) {
  const [is3DMode, setIs3DMode] = useState(false);
  const copy = getItemsCopy(lang);
  const content = getItemContent(lang, item.id);
  
  const color = rarezaColors[item.rareza ?? "comun"] ?? rarezaColors.comun;
  const rarezaLabel = copy.rarity[item.rareza ?? "comun"] ?? copy.rarity.comun;
  
  const itemName = content?.name ?? item.nombre;
  const itemLorDesc = content?.lorDescription ?? item.descripcion_lore;
  const itemHowToObtain = content?.howToObtain ?? item.como_obtener;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/items"
        className="inline-flex items-center gap-2 text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] hover:text-[oklch(0.72_0.08_75)] transition-colors mb-12"
      >
        <ArrowLeft className="w-3 h-3" /> {copy.backToItems}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image/3D Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* 2D/3D Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <ViewerToggle
              is3D={is3DMode}
              onToggle={() => setIs3DMode((v) => !v)}
              has3DModel={!!item.model3dUrl}
            />
          </div>
          
          <div
            className="border aspect-square overflow-hidden relative"
            style={{ borderColor: `${color}40` }}
          >
            {is3DMode && item.model3dUrl ? (
              <ModelViewer3D modelUrl={item.model3dUrl} />
            ) : item.imagen_url ? (
              <img
                src={item.imagen_url}
                alt={itemName}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.7) saturate(0.5)" }}
              />
            ) : (
              <div className="w-full h-full bg-[oklch(0.12_0.005_260)] flex items-center justify-center">
                <span className="text-8xl opacity-10">⚔</span>
              </div>
            )}
          </div>
          <div
            className="absolute -bottom-2 -right-2 w-full h-full border pointer-events-none"
            style={{ borderColor: `${color}15` }}
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {category && (
              <span className="text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)] border border-[oklch(0.55_0.01_60/40%)] px-2 py-0.5">
                {getItemCategoryName(lang, category.id, category.nombre)}
              </span>
            )}
            {subcategory && (
              <span className="text-xs souls-title tracking-widest text-[oklch(0.55_0.01_60)]">
                / {getItemCategoryName(lang, subcategory.id, subcategory.nombre)}
              </span>
            )}
            <span
              className="text-xs souls-title tracking-widest border px-2 py-0.5"
              style={{ color, borderColor: `${color}60` }}
            >
              {rarezaLabel}
            </span>
          </div>

          <h1 className="souls-title text-3xl sm:text-4xl text-[oklch(0.88_0.01_60)] tracking-widest mb-6">
            {itemName}
          </h1>

          <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)] mb-6" />

          {itemLorDesc && (
            <div className="mb-8">
              <p className="souls-text text-[oklch(0.65_0.01_60)] leading-relaxed italic border-l-2 border-[oklch(0.72_0.08_75/30%)] pl-4">
                "{itemLorDesc}"
              </p>
            </div>
          )}

          {itemHowToObtain && (
            <div className="border border-[oklch(0.72_0.08_75/20%)] p-4">
              <h3 className="souls-title text-xs tracking-widest text-[oklch(0.72_0.08_75)] mb-2">
                {copy.howToObtain}
              </h3>
              <p className="souls-text text-sm text-[oklch(0.55_0.01_60)]">
                {itemHowToObtain}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
