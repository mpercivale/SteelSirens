
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sword, Shield, MapPin, Skull, Key, Flame } from "lucide-react";
import { getHomeCopy, type Language } from "@/lib/i18n";

// Custom SVG Icons for "The World" section
const DungeonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const TreasureIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
    <path d="M12 9v4" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
  </svg>
);

const worldCategories = [
  {
    title: "Regions",
    description: "The great lands of the known world",
    icon: MapPin,
    href: "/locations?type=region",
  },
  {
    title: "Dungeons",
    description: "Places of darkness and peril",
    icon: DungeonIcon,
    href: "/locations?type=dungeon",
  },
  {
    title: "Secrets",
    description: "Hidden locations few have found",
    icon: TreasureIcon,
    href: "/locations?type=secret",
  },
];

const itemCategories = [
  {
    title: "Weapons",
    description: "Instruments of war forged in ancient fires",
    icon: Sword,
    href: "/items?category=weapons",
  },
  {
    title: "Armor",
    description: "Protection against the darkness",
    icon: Shield,
    href: "/items?category=armor",
  },
  {
    title: "Key Items",
    description: "Artifacts of immeasurable power",
    icon: Key,
    href: "/items?category=key",
  },
];

interface Props {
  lang: Language;
}

export default function CategorySection({ lang }: Props) {
  const t = getHomeCopy(lang);

  return (
    <section className="relative py-24 px-4 bg-[oklch(0.07_0.006_270)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-dim/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Main Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-dim" />
            <Flame className="w-5 h-5 text-gold-dim" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-dim" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gold-dim mb-4 font-serif tracking-wide">
            {t.categories.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-serif">
            {t.categories.subtitle}
          </p>
        </motion.div>

        {/* The World Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-dim" />
            <h3 className="text-3xl font-bold text-gold-dim font-serif">{t.categories.worldTitle}</h3>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-dim" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {worldCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={category.href}>
                    <div className="group border border-gold-dim/20 bg-black/20 p-6 hover:border-gold-dim/50 hover:bg-gold-dim/5 transition-all duration-300">
                      <Icon className="w-8 h-8 text-gold-dim mb-3 group-hover:text-gold transition-colors" />
                      <h4 className="text-xl font-bold text-gold mb-2 font-serif">
                        {t.categories.world[index]?.title ?? category.title}
                      </h4>
                      <p className="text-muted-foreground text-sm font-serif">
                        {t.categories.world[index]?.description ?? category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-dim" />
            <h3 className="text-3xl font-bold text-gold-dim font-serif">{t.categories.arsenalTitle}</h3>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-dim" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {itemCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={category.href}>
                    <div className="group border border-gold-dim/20 bg-black/20 p-6 hover:border-gold-dim/50 hover:bg-gold-dim/5 transition-all duration-300">
                      <Icon className="w-8 h-8 text-gold-dim mb-3 group-hover:text-gold transition-colors" />
                      <h4 className="text-xl font-bold text-gold mb-2 font-serif">
                        {t.categories.items[index]?.title ?? category.title}
                      </h4>
                      <p className="text-muted-foreground text-sm font-serif">
                        {t.categories.items[index]?.description ?? category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-dim/40 to-transparent" />
    </section>
  );
}
