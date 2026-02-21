
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sword, Shield, FlaskConical, Key, MapPin, Skull, Eye } from "lucide-react";
import Link from "next/link";

interface SubCategory {
  label: string;
  href: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  subcategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    id: "armas",
    label: "Armas",
    icon: <Sword size={20} />,
    description: "Instrumentos de guerra forjados en las fraguas del mundo.",
    subcategories: [
      { label: "Espadas", href: "/objetos/armas/espadas" },
      { label: "Lanzas", href: "/objetos/armas/lanzas" },
      { label: "Arcos", href: "/objetos/armas/arcos" },
      { label: "Bastones", href: "/objetos/armas/bastones" },
    ],
  },
  {
    id: "armaduras",
    label: "Armaduras",
    icon: <Shield size={20} />,
    description: "Protecciones que han resistido el paso del tiempo y la oscuridad.",
    subcategories: [
      { label: "Tela", href: "/objetos/armaduras/tela" },
      { label: "Cuero", href: "/objetos/armaduras/cuero" },
      { label: "Malla", href: "/objetos/armaduras/malla" },
      { label: "Placas", href: "/objetos/armaduras/placas" },
    ],
  },
  {
    id: "consumibles",
    label: "Consumibles",
    icon: <FlaskConical size={20} />,
    description: "Elixires y herramientas que sostienen a los viajeros en su camino.",
    subcategories: [
      { label: "Pociones", href: "/objetos/consumibles/pociones" },
      { label: "Utilidad", href: "/objetos/consumibles/utilidad" },
    ],
  },
  {
    id: "clave",
    label: "Objetos Clave",
    icon: <Key size={20} />,
    description: "Artefactos de poder incalculable que moldean el destino del mundo.",
    subcategories: [
      { label: "Ver todos", href: "/objetos/clave" },
    ],
  },
];

const LOCATIONS: Category[] = [
  {
    id: "regiones",
    label: "Regiones",
    icon: <MapPin size={20} />,
    description: "Las grandes tierras que conforman el mundo conocido.",
    subcategories: [
      { label: "Vaelthorn", href: "/locaciones/regiones/vaelthorn" },
      { label: "Ironhold", href: "/locaciones/regiones/ironhold" },
      { label: "Morthis", href: "/locaciones/regiones/morthis" },
    ],
  },
  {
    id: "mazmorras",
    label: "Mazmorras",
    icon: <Skull size={20} />,
    description: "Lugares de oscuridad y peligro donde los valientes buscan gloria.",
    subcategories: [
      { label: "Catacumbas Eternas", href: "/locaciones/mazmorras/catacumbas-eternas" },
      { label: "Templo de la Luz Eterna", href: "/locaciones/mazmorras/templo-luz-eterna" },
    ],
  },
  {
    id: "secretos",
    label: "Secretos",
    icon: <Eye size={20} />,
    description: "Lugares ocultos que pocos han encontrado y menos han sobrevivido.",
    subcategories: [
      { label: "El Árbol del Mundo", href: "/locaciones/secretos/arbol-del-mundo" },
      { label: "La Cámara del Tiempo", href: "/locaciones/secretos/camara-del-tiempo" },
    ],
  },
];

function CategoryGroup({ title, categories, href }: { title: string; categories: Category[]; href: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-xl tracking-[0.2em] uppercase text-[oklch(0.88_0.02_60)]"
          style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
        >
          {title}
        </h3>
        <Link
          href={href}
          className="text-xs tracking-[0.2em] uppercase text-[oklch(0.72_0.08_65)] hover:text-[oklch(0.88_0.02_60)] transition-colors"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Ver todo →
        </Link>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-[oklch(0.72_0.08_65/15%)] overflow-hidden">
            <button
              onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[oklch(0.72_0.08_65/5%)] transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[oklch(0.72_0.08_65)] group-hover:text-[oklch(0.88_0.02_60)] transition-colors">
                  {cat.icon}
                </span>
                <span
                  className="text-sm tracking-[0.15em] uppercase text-[oklch(0.78_0.02_60)] group-hover:text-[oklch(0.88_0.02_60)] transition-colors"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {cat.label}
                </span>
              </div>
              <motion.div
                animate={{ rotate: openId === cat.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[oklch(0.45_0.02_60)]"
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === cat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-1 border-t border-[oklch(0.72_0.08_65/10%)]">
                    <p
                      className="text-[oklch(0.45_0.02_60)] text-xs mb-3 italic"
                      style={{ fontFamily: "var(--font-crimson)" }}
                    >
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="text-xs tracking-[0.15em] uppercase text-[oklch(0.55_0.02_60)] hover:text-[oklch(0.72_0.08_65)] border border-[oklch(0.72_0.08_65/20%)] hover:border-[oklch(0.72_0.08_65/50%)] px-3 py-1.5 transition-all duration-200"
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoriesSection() {
  return (
    <section className="relative py-24 px-4 bg-[oklch(0.07_0.006_270)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.08_65/40%)] to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Explore the World
          </h2>
          <div className="ornament-divider mt-6">
            <span className="text-[oklch(0.72_0.08_65)]">✦</span>
          </div>
        </motion.div>

        {/* Three column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/items"
              className="block border border-[oklch(0.72_0.08_65/15%)] p-6 hover:border-[oklch(0.72_0.08_65/40%)] hover:bg-[oklch(0.72_0.08_65/5%)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="w-6 h-6 text-[oklch(0.72_0.08_65)] group-hover:text-[oklch(0.88_0.02_60)] transition-colors" />
                <h3
                  className="text-lg tracking-[0.15em] uppercase text-[oklch(0.88_0.02_60)]"
                  style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
                >
                  Items
                </h3>
              </div>
              <p
                className="text-[oklch(0.45_0.02_60)] text-sm"
                style={{ fontFamily: "var(--font-crimson)" }}
              >
                Weapons, armor, and artifacts that shape the fate of heroes.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              href="/locations"
              className="block border border-[oklch(0.72_0.08_65/15%)] p-6 hover:border-[oklch(0.72_0.08_65/40%)] hover:bg-[oklch(0.72_0.08_65/5%)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-6 h-6 text-[oklch(0.72_0.08_65)] group-hover:text-[oklch(0.88_0.02_60)] transition-colors" />
                <h3
                  className="text-lg tracking-[0.15em] uppercase text-[oklch(0.88_0.02_60)]"
                  style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
                >
                  Locations
                </h3>
              </div>
              <p
                className="text-[oklch(0.45_0.02_60)] text-sm"
                style={{ fontFamily: "var(--font-crimson)" }}
              >
                Regions, dungeons, and secrets hidden across the realm.
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/bestiary"
              className="block border border-[oklch(0.72_0.08_65/15%)] p-6 hover:border-[oklch(0.72_0.08_65/40%)] hover:bg-[oklch(0.72_0.08_65/5%)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Skull className="w-6 h-6 text-[oklch(0.72_0.08_65)] group-hover:text-[oklch(0.88_0.02_60)] transition-colors" />
                <h3
                  className="text-lg tracking-[0.15em] uppercase text-[oklch(0.88_0.02_60)]"
                  style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700 }}
                >
                  Bestiary
                </h3>
              </div>
              <p
                className="text-[oklch(0.45_0.02_60)] text-sm"
                style={{ fontFamily: "var(--font-crimson)" }}
              >
                Creatures of darkness, from common foes to legendary beasts.
              </p>
            </Link>
          </motion.div>
        </div>

        {/* Two column grid for detailed categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <CategoryGroup title="Objetos" categories={CATEGORIES} href="/objetos" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <CategoryGroup title="Locaciones" categories={LOCATIONS} href="/locaciones" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.08_65/40%)] to-transparent" />
    </section>
  );
}
