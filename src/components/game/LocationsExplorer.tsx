
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Locacion } from "@/types/game";
import LocationCard from "./LocationCard";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/i18n";

interface Props {
  locations: Locacion[];
  lang?: Language;
}

const tipos = [
  { id: "all", label: "All" },
  { id: "region", label: "Regions" },
  { id: "mazmorra", label: "Dungeons" },
  { id: "secreto", label: "Secrets" },
];

export default function LocationsExplorer({ locations, lang = "en" }: Props) {
  const [activeTipo, setActiveTipo] = useState("all");

  const filtered = locations.filter(
    (l) => activeTipo === "all" || l.tipo === activeTipo
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {tipos.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setActiveTipo(tipo.id)}
            className={cn(
              "px-4 py-2 text-xs souls-title tracking-widest border transition-all duration-200",
              activeTipo === tipo.id
                ? "border-[oklch(0.72_0.08_75)] text-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/10%)]"
                : "border-[oklch(0.72_0.08_75/20%)] text-[oklch(0.55_0.01_60)] hover:border-[oklch(0.72_0.08_75/50%)] hover:text-[oklch(0.72_0.08_75)]"
            )}
          >
            {tipo.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTipo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {filtered.map((loc, i) => (
          <LocationCard key={loc.id} location={loc} index={i} lang={lang} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="souls-title text-sm tracking-widest text-[oklch(0.45_0.01_60)]">
              These lands remain undiscovered...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
