
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Objeto, Categoria } from "@/types/game";

interface Props {
  objetos: Objeto[];
  categorias: Categoria[];
}

const RAREZA_STYLES: Record<string, string> = {
  comun: "text-gray-400 border-gray-400/40",
  raro: "text-blue-400 border-blue-400/40",
  epico: "text-purple-400 border-purple-400/40",
  legendario: "text-[oklch(0.72_0.08_65)] border-[oklch(0.72_0.08_65/40%)]",
};

export default function ObjetosPage({ objetos, categorias }: Props) {
  const [activeCat, setActiveCat] = useState<string>("todos");
  const [activeSub, setActiveSub] = useState<string>("todos");

  const mainCats = categorias.filter((c) => !c.categoria_padre_id);
  const subCats = categorias.filter((c) => c.categoria_padre_id === activeCat);

  const filtered = objetos.filter((o) => {
    if (activeCat !== "todos" && o.categoria_id !== activeCat) return false;
    if (activeSub !== "todos" && o.subcategoria_id !== activeSub) return false;
    return true;
  });

  const handleCatChange = (id: string) => {
    setActiveCat(id);
    setActiveSub("todos");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_270)] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="ornament-divider mb-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-[0.2em] uppercase text-[oklch(0.88_0.02_60)] souls-glow"
            style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
          >
            Objetos
          </h1>
          <div className="ornament-divider mt-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>

        {/* Main category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={() => handleCatChange("todos")}
            className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
              activeCat === "todos"
                ? "border-[oklch(0.72_0.08_65)] text-[oklch(0.72_0.08_65)] bg-[oklch(0.72_0.08_65/10%)]"
                : "border-[oklch(0.72_0.08_65/20%)] text-[oklch(0.55_0.02_60)] hover:border-[oklch(0.72_0.08_65/50%)]"
            }`}
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Todos
          </button>
          {mainCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCatChange(cat.id)}
              className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
                activeCat === cat.id
                  ? "border-[oklch(0.72_0.08_65)] text-[oklch(0.72_0.08_65)] bg-[oklch(0.72_0.08_65/10%)]"
                  : "border-[oklch(0.72_0.08_65/20%)] text-[oklch(0.55_0.02_60)] hover:border-[oklch(0.72_0.08_65/50%)]"
              }`}
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Subcategory tabs */}
        {subCats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveSub("todos")}
              className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all ${
                activeSub === "todos"
                  ? "border-[oklch(0.72_0.08_65/60%)] text-[oklch(0.72_0.08_65/80%)]"
                  : "border-[oklch(0.72_0.08_65/10%)] text-[oklch(0.45_0.02_60)] hover:border-[oklch(0.72_0.08_65/30%)]"
              }`}
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Todos
            </button>
            {subCats.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all ${
                  activeSub === sub.id
                    ? "border-[oklch(0.72_0.08_65/60%)] text-[oklch(0.72_0.08_65/80%)]"
                    : "border-[oklch(0.72_0.08_65/10%)] text-[oklch(0.45_0.02_60)] hover:border-[oklch(0.72_0.08_65/30%)]"
                }`}
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {sub.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((obj, i) => (
            <motion.div
              key={obj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/objetos/${obj.slug}`}
                className="group block border border-[oklch(0.72_0.08_65/15%)] hover:border-[oklch(0.72_0.08_65/50%)] overflow-hidden transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-[oklch(0.09_0.008_270)]">
                  {obj.imagen_url ? (
                    <Image
                      src={obj.imagen_url}
                      alt={obj.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[oklch(0.35_0.02_60)] text-4xl">⚔</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className={`absolute top-2 right-2 text-[10px] tracking-[0.15em] uppercase border px-2 py-0.5 bg-black/60 ${RAREZA_STYLES[obj.rareza ?? "comun"]}`} style={{ fontFamily: "var(--font-cinzel)" }}>
                    {obj.rareza}
                  </div>
                </div>
                <div className="p-4 bg-[oklch(0.08_0.006_270)]">
                  <h3 className="text-[oklch(0.88_0.02_60)] text-sm tracking-[0.08em] uppercase group-hover:text-[oklch(0.72_0.08_65)] transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {obj.nombre}
                  </h3>
                  <p className="text-[oklch(0.45_0.02_60)] text-xs mt-1 line-clamp-2 italic" style={{ fontFamily: "var(--font-crimson)" }}>
                    {obj.descripcion_corta}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[oklch(0.35_0.02_60)] text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              No se encontraron objetos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
