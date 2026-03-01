
"use client";

import { Beast, BeastVariant, Item } from "@/types/game";
import { mockBeasts, mockItems } from "@/data/mock-data";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Heart, 
  Swords, 
  ShieldCheck, 
  Gauge, 
  Moon,
} from "lucide-react";
import ViewerToggle from "./ViewerToggle";
import { useState, useEffect, useMemo } from "react";
import ModelViewer3D from "./ModelViewer3D";
import { getCreatureTranslation, getHabitatLabel, getRaceLabel as getTranslatedRaceLabel } from "@/lib/bestiary-translations";
import { type Language, getBeastDetailCopy, getItemContent } from "@/lib/i18n";
import { getBeastUnlockRequirements, getDiscoveredCharacterSlugs, isBeastUnlocked } from "@/lib/progression";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BeastDetailProps {
  beast: Beast;
  lang?: Language;
  enableRouteNavigation?: boolean;
  showInternalNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const getBeastEffigyDropShadow = (slug: string) => {
  if (slug === "wisp") {
    return "drop-shadow(0 0 10px rgba(186, 216, 255, 0.34)) drop-shadow(0 0 16px rgba(88, 224, 255, 0.22)) drop-shadow(0 0 6px rgba(255, 126, 220, 0.12))";
  }
  if (slug === "cabalgata-nocturna") {
    return "drop-shadow(0 0 12px rgba(187, 22, 0, 0.38)) drop-shadow(0 0 8px rgba(184, 88, 96, 0.36)) drop-shadow(0 0 4px rgba(28, 24, 66, 0.45))";
  }
  if (slug === "esfinge") {
    return "drop-shadow(0 0 12px rgba(125, 167, 161, 0.5)) drop-shadow(0 0 8px rgba(135, 185, 231, 0.25)) drop-shadow(0 0 4px rgba(131, 43, 139, 0.4))";
  }
  if (slug === "gallo-de-tres-cabezas") {
    return "drop-shadow(0 0 12px rgba(115, 122, 122, 0.5)) drop-shadow(0 0 8px rgba(132, 143, 156, 0.43)) drop-shadow(0 0 4px rgba(178, 34, 34, 0.4))";
  }
  if (slug === "lobizon") {
    return "drop-shadow(0 0 12px rgba(100, 130, 180, 0.5)) drop-shadow(0 0 8px rgba(175, 172, 169, 0.35)) drop-shadow(0 0 4px rgba(70, 70, 70, 0.4))";
  }
  if (slug === "semihumanos") {
    return "drop-shadow(0 0 12px rgba(70, 100, 140, 0.5)) drop-shadow(0 0 8px rgba(100, 140, 180, 0.35)) drop-shadow(0 0 4px rgba(50, 50, 80, 0.4))";
  }
  if (slug === "troll-gordo" || slug === "troll-delgado" || slug === "troll-bajito" || slug === "trolls-psiquicos") {
    return "drop-shadow(0 0 12px rgba(139, 146, 141, 0.64)) drop-shadow(0 0 8px rgba(172, 172, 153, 0.35)) drop-shadow(0 0 4px rgba(138, 134, 129, 0.4))";
  }
  if (slug === "golem-de-barro") {
    return "drop-shadow(0 0 12px rgba(160, 82, 45, 0.5)) drop-shadow(0 0 8px rgba(205, 130, 0, 0.35)) drop-shadow(0 0 4px rgba(100, 50, 10, 0.4))";
  }
  if (slug === "dragon") {
    return "drop-shadow(0 0 12px rgba(184, 92, 23, 0.5)) drop-shadow(0 0 8px rgba(255, 165, 0, 0.35)) drop-shadow(0 0 4px rgba(139, 69, 19, 0.4))";
  }
  if (slug === "dragon-joven") {
    return "drop-shadow(0 0 12px rgba(185, 176, 169, 0.5)) drop-shadow(0 0 8px rgba(196, 196, 196, 0.35)) drop-shadow(0 0 4px rgba(105, 102, 99, 0.4))";
  }
  if (slug === "hombre-de-paja") {
    return "drop-shadow(0 0 12px rgba(184, 134, 11, 0.5)) drop-shadow(0 0 8px rgba(218, 191, 138, 0.35)) drop-shadow(0 0 4px rgba(139, 101, 8, 0.4))";
  }

  return "drop-shadow(0 0 12px rgba(180, 130, 70, 0.5)) drop-shadow(0 0 6px rgba(180, 130, 70, 0.3))";
};

const itemRarityColors: Record<string, string> = {
  common: "#a8a29e",
  uncommon: "#66d18f",
  rare: "#69a7ff",
  epic: "#c18cff",
  legendary: "#f2c46f",
};

export function BeastDetail({
  beast,
  lang = "en",
  enableRouteNavigation = true,
  showInternalNavigation = true,
  onPrevious,
  onNext,
}: BeastDetailProps) {
  const [is3DMode, setIs3DMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemViewMode, setItemViewMode] = useState<"2d" | "3d">("2d");
  const [selectedVariantSlug, setSelectedVariantSlug] = useState<string | null>(null);
  const [discoveredCharacterSlugs, setDiscoveredCharacterSlugs] = useState<string[]>([]);
  const router = useRouter();

  const variants = beast.variants ?? [];
  const activeVariant = useMemo(
    () => variants.find((variant) => variant.slug === selectedVariantSlug) ?? variants[0],
    [variants, selectedVariantSlug]
  );

  const activeBeast = useMemo(() => {
    if (!activeVariant) {
      return beast;
    }

    return {
      ...beast,
      ...activeVariant,
      slug: activeVariant.slug,
      name: activeVariant.name ?? beast.name,
      iconUrl: activeVariant.iconUrl ?? beast.iconUrl,
      imageUrl: activeVariant.imageUrl ?? beast.imageUrl,
      model3dUrl: activeVariant.model3dUrl ?? beast.model3dUrl,
      has3dModel: activeVariant.has3dModel ?? beast.has3dModel,
      habitatImages: activeVariant.habitatImages ?? beast.habitatImages,
      drops: activeVariant.drops ?? beast.drops,
      weaknesses: activeVariant.weaknesses ?? beast.weaknesses,
      resistances: activeVariant.resistances ?? beast.resistances,
      stats: activeVariant.stats ?? beast.stats,
      abilities: activeVariant.abilities ?? beast.abilities,
      shortDescription: activeVariant.shortDescription ?? beast.shortDescription,
      shortDescription_es: activeVariant.shortDescription_es ?? beast.shortDescription_es,
      shortDescription_ja: activeVariant.shortDescription_ja ?? beast.shortDescription_ja,
      loreDescription: activeVariant.loreDescription ?? beast.loreDescription,
      loreDescription_es: activeVariant.loreDescription_es ?? beast.loreDescription_es,
      loreDescription_ja: activeVariant.loreDescription_ja ?? beast.loreDescription_ja,
      subtype: activeVariant.subtype ?? beast.subtype,
      subtype_es: activeVariant.subtype_es ?? beast.subtype_es,
      subtype_ja: activeVariant.subtype_ja ?? beast.subtype_ja,
      habitat: activeVariant.habitat ?? beast.habitat,
      habitat_es: activeVariant.habitat_es ?? beast.habitat_es,
      habitat_ja: activeVariant.habitat_ja ?? beast.habitat_ja,
      dangerLevel: activeVariant.dangerLevel ?? beast.dangerLevel,
    } as Beast;
  }, [beast, activeVariant]);

  const habitatImages = activeBeast.habitatImages ?? [];

  // Find current beast index
  const currentIndex = mockBeasts.findIndex((b) => b.slug === beast.slug);
  const previousBeast = currentIndex > 0 ? mockBeasts[currentIndex - 1] : mockBeasts[mockBeasts.length - 1];
  const nextBeast = currentIndex < mockBeasts.length - 1 ? mockBeasts[currentIndex + 1] : mockBeasts[0];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enableRouteNavigation && onPrevious && onNext) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onPrevious();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onNext();
        }
        return;
      }

      if (!enableRouteNavigation) {
        return;
      }

      if (e.key === "ArrowLeft") {
        router.push(`/bestiary/${previousBeast.slug}`);
      } else if (e.key === "ArrowRight") {
        router.push(`/bestiary/${nextBeast.slug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableRouteNavigation, onPrevious, onNext, previousBeast, nextBeast, router]);

  useEffect(() => {
    if (!selectedItem) return;
    setItemViewMode("2d");
  }, [selectedItem]);

  useEffect(() => {
    setSelectedVariantSlug(variants[0]?.slug ?? null);
    setIs3DMode(false);
  }, [beast.slug]);

  useEffect(() => {
    setDiscoveredCharacterSlugs(getDiscoveredCharacterSlugs());
  }, []);

  useEffect(() => {
    const onStorage = () => setDiscoveredCharacterSlugs(getDiscoveredCharacterSlugs());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const navigateToBeast = (slug: string) => {
    if (!enableRouteNavigation) return;
    router.push(`/bestiary/${slug}`);
  };

  const findItem = (itemName: string): Item | undefined => {
    return mockItems.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
  };

  // Get translated labels
  const labels = getBeastDetailCopy(lang)?.labels || {
    sheet: "Species Sheet",
    loot: "Loot",
    type: "Type",
    location: "Location",
    description: "Description",
    notes: "Notes",
    notesPlaceholder: "Excerpt from the Sorcerer's journal on this creature and its behavior in combat.",
    weaknesses: "Weaknesses",
    resistances: "Resistances",
    abilities: "Abilities",
    visual: "Visual",
    noImage: "No image",
    stats: "Stats",
    howToObtain: "How to Obtain",
  };

  const legacySpanishLorePlaceholder = "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.";
  const displayLoreDescription =
    activeBeast.loreDescription === legacySpanishLorePlaceholder
      ? labels.notesPlaceholder
      : activeBeast.loreDescription;
  const variantsTitle = lang === "es" ? "Variantes" : lang === "ja" ? "亜種" : "Variants";
  const localizedVariantName = (variant: BeastVariant) => {
    if (lang === "es") {
      return variant.name_es || variant.name;
    }
    if (lang === "ja") {
      return variant.name_ja || variant.name;
    }
    return variant.name;
  };

  const selectedItemImageUrl = selectedItem?.imageUrl ?? (selectedItem as (Item & { imagen_url?: string }) | null)?.imagen_url;
  const selectedItemModel3dUrl = selectedItem?.model3dUrl ?? (selectedItem as (Item & { model3d_url?: string }) | null)?.model3d_url;
  const selectedItemRarity = selectedItem?.rarity ?? (selectedItem as (Item & { rareza?: string }) | null)?.rareza;
  const selectedItemRarityColor = selectedItemRarity ? itemRarityColors[selectedItemRarity.toLowerCase()] ?? "oklch(0.72 0.08 75)" : "oklch(0.72 0.08 75)";
  const selectedItemLocale = selectedItem ? getItemContent(lang, selectedItem.id) : undefined;
  const selectedItemDisplayName = selectedItemLocale?.name ?? selectedItem?.name;
  const selectedItemShortDescription = selectedItemLocale?.shortDescription ?? selectedItem?.shortDescription;
  const selectedItemLoreDescription = selectedItemLocale?.lorDescription ?? selectedItem?.lorDescription;
  const selectedItemHowToObtain = selectedItemLocale?.howToObtain ?? selectedItem?.howToObtain;
  const japaneseTypographyClass = lang === "ja" ? "font-noto-serif-jp [&_*]:!font-noto-serif-jp" : "";
  const isUnlocked = isBeastUnlocked(beast, discoveredCharacterSlugs);
  const requiredCount = getBeastUnlockRequirements(beast).length;
  const sealedLabel = lang === "es" ? "Entrada Sellada" : lang === "ja" ? "封印済み" : "Sealed Entry";
  const sealedHint =
    lang === "es"
      ? `Descubre personajes para desbloquear (${requiredCount})`
      : lang === "ja"
      ? `キャラクター発見で解除（${requiredCount}）`
      : `Discover characters to unlock (${requiredCount})`;

  if (!isUnlocked) {
    return (
      <div className={`space-y-8 overflow-hidden ${japaneseTypographyClass}`}>
        <Card className="relative overflow-hidden rounded-none bg-black/45 backdrop-blur-sm border-[oklch(0.72_0.08_75/25%)] p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.02_75/45%)] via-transparent to-black/65" />
          <div className="relative z-10">
            <h2 className="souls-title text-3xl text-[oklch(0.72_0.08_75)] tracking-widest">{sealedLabel}</h2>
            <div className="w-20 h-px bg-[oklch(0.72_0.08_75/50%)] mx-auto my-4" />
            <p className="text-[oklch(0.68_0.03_75)] leading-relaxed max-w-xl mx-auto souls-text">{sealedHint}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-8 overflow-hidden ${japaneseTypographyClass}`}>
      {/* Hero Section */}
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Image/Model Container with Navigation */}
          <div className="relative h-[480px] md:h-[580px] overflow-hidden bg-gradient-to-b from-black/20 via-black/35 to-black/60 backdrop-blur-sm flex items-center justify-center">
            {/* Background glow - reduced */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/8 via-transparent to-transparent" />

            {/* 2D/3D Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <ViewerToggle
                is3D={is3DMode}
                onToggle={() => setIs3DMode((v) => !v)}
                has3DModel={activeBeast.has3dModel ?? false}
              />
            </div>

            {/* Content */}
            {is3DMode && activeBeast.model3dUrl ? (
              <ModelViewer3D modelUrl={activeBeast.model3dUrl} />
            ) : (
              <div className="relative w-full h-full overflow-visible">
                {activeBeast.slug === "wisp" && (
                  <>
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(186,216,255,0.15) 0%, rgba(130,218,255,0.08) 45%, rgba(130,218,255,0) 80%)",
                        filter: "blur(18px)",
                      }}
                      animate={{
                        opacity: [0.08, 0.24, 0.08],
                        scale: [0.92, 1.12, 0.92],
                      }}
                      transition={{
                        duration: 3.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(196,228,255,0.1) 0%, rgba(136,224,255,0.05) 42%, rgba(136,224,255,0) 84%)",
                        filter: "blur(22px)",
                      }}
                      animate={{
                        opacity: [0.04, 0.16, 0.04],
                        scale: [0.9, 1.16, 0.9],
                      }}
                      transition={{
                        duration: 4.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.35,
                      }}
                    />
                  </>
                )}
                
                {/* Ground shadow effect - borderless circular gradient */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    bottom: 0,
                    width: "62%",
                    height: "88px",
                    background:
                      "radial-gradient(ellipse at center, oklch(0 0 0 / 85%) 0%, oklch(0 0 0 / 45%) 42%, transparent 78%)",
                    filter: "blur(12px)",
                  }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    bottom: 4,
                    width: "86%",
                    height: "74px",
                    background:
                      "radial-gradient(ellipse at center, oklch(0.72 0.08 75 / 22%) 0%, transparent 72%)",
                    filter: "blur(6px)",
                  }}
                />
                
                <Image
                  src={activeBeast.imageUrl || activeBeast.iconUrl || `/images/bestiary/${activeBeast.slug}.png`}
                  alt={activeBeast.name}
                  width={800}
                  height={600}
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    if (!target.src.includes("placeholder-beast.svg")) {
                      target.src = "/images/bestiary/placeholder-beast.svg";
                    }
                  }}
                  className={`absolute left-1/2 bottom-0 -translate-x-1/2 h-[95%] w-auto max-w-none object-contain object-bottom ${activeBeast.slug === "wisp" ? "relative z-10" : ""}`}
                  style={{
                    filter: getBeastEffigyDropShadow(activeBeast.slug),
                  }}
                />
              </div>
            )}

            {/* Ash particles */}
            <div className={`absolute inset-0 pointer-events-none ${activeBeast.slug === "wisp" && !is3DMode ? "z-30" : ""}`}>
              {activeBeast.slug === "wisp" && !is3DMode ? (
                <>
                  {[
                    { count: 60, color: "rgba(204, 226, 255, 0.82)", minSize: 1.2, maxSize: 3.6, rise: 85, duration: 3.3 },
                    { count: 40, color: "rgba(156, 250, 255, 0.76)", minSize: 1, maxSize: 3, rise: 98, duration: 3.1 },
                    { count: 30, color: "rgba(255, 250, 224, 0.72)", minSize: 0.9, maxSize: 2.6, rise: 74, duration: 2.8 },
                    { count: 30, color: "rgba(255, 202, 243, 0.72)", minSize: 0.9, maxSize: 2.8, rise: 80, duration: 2.9 },
                  ].map((system, systemIndex) => (
                    <div key={`wisp-detail-layer-${systemIndex}`} className="absolute inset-0">
                      {[...Array(system.count)].map((_, i) => {
                        const size = system.minSize + Math.random() * (system.maxSize - system.minSize);
                        const angle = Math.random() * Math.PI * 2;
                        const spawnRadius = Math.random() * 40;
                        const radialDrift = 100 + Math.random() * 80;
                        const startX = 50 + Math.cos(angle) * spawnRadius;
                        const startY = 50 + Math.sin(angle) * spawnRadius;
                        return (
                          <motion.div
                            key={`wisp-detail-${systemIndex}-${i}`}
                            className="absolute rounded-full"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              left: `${startX}%`,
                              top: `${startY}%`,
                              background: system.color,
                              boxShadow: `0 0 ${5 + size * 2}px ${system.color}`,
                              filter: "saturate(1.3)",
                            }}
                            animate={{
                              x: [0, Math.cos(angle) * radialDrift],
                              y: [0, Math.sin(angle) * radialDrift - system.rise * 0.45],
                              opacity: [0.08, 0.95, 0],
                              scale: [0.82, 1.15, 0.96],
                            }}
                            transition={{
                              duration: system.duration + Math.random() * 1.5,
                              repeat: Infinity,
                              delay: Math.random() * 2.5,
                              ease: "easeOut",
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}

                  <div className="absolute inset-0">
                    {[...Array(44)].map((_, i) => {
                      const angle = Math.random() * Math.PI * 2;
                      const angleDeg = (angle * 180) / Math.PI;
                      const spawnRadius = Math.random() * 2;
                      const length = 70 + Math.random() * 150;
                      const startX = 52 + Math.cos(angle) * spawnRadius;
                      const startY = 45 + Math.sin(angle) * spawnRadius;
                      const color = i % 4 === 0
                        ? "rgba(206, 229, 255, 0.52)"
                        : i % 4 === 1
                        ? "rgba(160, 250, 255, 0.48)"
                        : i % 4 === 2
                        ? "rgba(255, 240, 176, 0.44)"
                        : "rgba(255, 190, 236, 0.44)";
                      return (
                        <motion.div
                          key={`wisp-detail-ray-${i}`}
                          className="absolute origin-left rounded-full"
                          style={{
                            width: `${length}px`,
                            height: "1.px",
                            left: `${startX}%`,
                            top: `${startY}%`,
                            rotate: `${angleDeg}deg`,
                            background: `linear-gradient(90deg, ${color} 0%, rgba(255,255,255,0) 100%)`,
                            boxShadow: `0 0 px ${color}`,
                          }}
                          animate={{
                            rotate: [`${angleDeg}deg`, `${angleDeg}deg`],
                            opacity: [0, 0.72, 0],
                            scaleX: [0.08, 1.5, 0.48],
                            scaleY: [0.85, 1.15, 0.9],
                          }}
                          transition={{
                            duration: 2.6 + Math.random() * 1.6,
                            repeat: Infinity,
                            delay: Math.random() * 2.6,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Dust particles - general creatures */}
                  {[
                    { count: 60, color: "rgba(180, 160, 140, 0.4)", minSize: 0.8, maxSize: 2.2, rise: 40, duration: 2.5 },
                    { count: 40, color: "rgba(150, 130, 110, 0.3)", minSize: 0.6, maxSize: 1.8, rise: 50, duration: 2.8 },
                    { count: 30, color: "rgba(200, 180, 160, 0.25)", minSize: 0.5, maxSize: 1.5, rise: 35, duration: 2.2 },
                  ].map((system, systemIndex) => (
                    <div key={`dust-layer-${systemIndex}`} className="absolute inset-0">
                      {[...Array(system.count)].map((_, i) => {
                        const size = system.minSize + Math.random() * (system.maxSize - system.minSize);
                        const angle = Math.random() * Math.PI * 2;
                        const spawnRadius = Math.random() * 43;
                        const radialDrift = 40 + Math.random() * 80;
                        const startX = 50 + Math.cos(angle) * spawnRadius;
                        const startY = 65 + Math.sin(angle) * spawnRadius;
                        return (
                          <motion.div
                            key={`dust-${systemIndex}-${i}`}
                            className="absolute rounded-full"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              left: `${startX}%`,
                              top: `${startY}%`,
                              background: system.color,
                              boxShadow: `0 0 ${2 + size}px ${system.color}`,
                            }}
                            animate={{
                              x: [0, Math.cos(angle) * radialDrift * 0.3],
                              y: [0, Math.sin(angle) * radialDrift * 0.2 - system.rise * 0.4],
                              opacity: [0.15, 0.5, 0],
                              scale: [0.9, 1.2, 0.85],
                            }}
                            transition={{
                              duration: system.duration + Math.random() * 1.2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                              ease: "easeOut",
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Navigation Arrows - Inside container */}
            {showInternalNavigation && (
              <>
                <button
                  onClick={() => {
                    if (!enableRouteNavigation && onPrevious) {
                      onPrevious();
                      return;
                    }
                    navigateToBeast(previousBeast.slug);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[oklch(0.72_0.08_65/40%)] flex items-center justify-center text-[oklch(0.72_0.08_65)] hover:border-[oklch(0.72_0.08_65)] hover:bg-[oklch(0.72_0.08_65/10%)] transition-all duration-300"
                  title={`Anterior: ${previousBeast.name}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => {
                    if (!enableRouteNavigation && onNext) {
                      onNext();
                      return;
                    }
                    navigateToBeast(nextBeast.slug);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[oklch(0.72_0.08_65/40%)] flex items-center justify-center text-[oklch(0.72_0.08_65)] hover:border-[oklch(0.72_0.08_65)] hover:bg-[oklch(0.72_0.08_65/10%)] transition-all duration-300"
                  title={`Siguiente: ${nextBeast.name}`}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Title and Badges */}
          <div className="mt-4 space-y-4">
            {/* Centered Title */}
            <div className="text-center space-y-3">
              <h1 className={`souls-title text-4xl md:text-5xl text-[oklch(0.88_0.01_60)] tracking-widest ${lang === "ja" ? "font-noto-serif-jp" : ""}`}>
                {(() => {
                  const translation = getCreatureTranslation(lang, activeBeast.slug);
                  return translation?.name || activeBeast.name;
                })()}
              </h1>
              
              {/* Decorative line with diamond */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
                <div className="w-2 h-2 border border-[oklch(0.72_0.08_75/60%)] rotate-45" />
                <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)]" />
              </div>
            </div>

            {/* Description centered - Hidden to focus on title and image */}
            <div className="text-center hidden">
              {(() => {
                const translation = getCreatureTranslation(lang, activeBeast.slug);
                const description = translation?.short || activeBeast.shortDescription;
                return description ? (
                  <p className="souls-text text-[oklch(0.55_0.01_60)] text-sm max-w-2xl mx-auto">
                    {description}
                  </p>
                ) : null;
              })()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generic Variants Selector */}
      {variants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative py-8"
        >
          <h2 className="text-2xl font-bold text-accent font-serif mb-6 text-center">{variantsTitle}</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => {
              const translation = getCreatureTranslation(lang, variant.slug);
              const variantName = translation?.name || localizedVariantName(variant);
              const variantDescription =
                translation?.short ||
                (lang === "es"
                  ? variant.shortDescription_es || variant.shortDescription
                  : lang === "ja"
                    ? variant.shortDescription_ja || variant.shortDescription
                    : variant.shortDescription);
              const isSelected = activeBeast.slug === variant.slug;

              return (
                <button
                  key={variant.slug}
                  type="button"
                  onClick={() => {
                    setSelectedVariantSlug(variant.slug);
                    setIs3DMode(false);
                  }}
                  className={`group relative w-full text-left border p-3 bg-black/35 transition-all ${
                    isSelected
                      ? "border-accent/70 shadow-[0_0_0_1px_rgba(194,154,96,0.35)]"
                      : "border-accent/25 hover:border-accent/55"
                  }`}
                >
                  <div className="relative h-32 overflow-hidden bg-black/40">
                    <Image
                      src={variant.iconUrl || variant.imageUrl || `/images/bestiary/portraits/${variant.slug}-portrait.png`}
                      alt={variantName}
                      fill
                      sizes="240px"
                      className="object-contain p-2"
                      onError={(event) => {
                        const target = event.currentTarget as HTMLImageElement;
                        if (!target.src.includes(`/images/bestiary/${variant.slug}.png`)) {
                          target.src = `/images/bestiary/${variant.slug}.png`;
                        }
                      }}
                    />
                  </div>
                  <p className={`mt-2 text-sm font-semibold text-accent ${lang === "ja" ? "font-noto-serif-jp" : "font-serif"}`}>
                    {variantName}
                  </p>
                  {variantDescription && (
                    <p className="mt-1 text-xs text-foreground/75 leading-relaxed line-clamp-2">
                      {variantDescription}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Lore Section */}
      {activeBeast.loreDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden rounded-none bg-black/45 backdrop-blur-sm border-[oklch(0.72_0.08_75/25%)] p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.02_75/45%)] via-transparent to-black/65" />
            <div className="relative z-10">
              <h2 className="souls-title text-3xl text-[oklch(0.72_0.08_75)] tracking-widest">
                {labels.notes}
              </h2>
              <div className="w-20 h-px bg-[oklch(0.72_0.08_75/50%)] mx-auto my-4" />
              <p
                className={`text-[oklch(0.68_0.03_75)] leading-relaxed whitespace-pre-line max-w-2xl mx-auto ${lang === "ja" ? "souls-title tracking-[0.08em]" : "souls-text"}`}
              >
                {displayLoreDescription}
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Weaknesses & Resistances */}
      {((activeBeast.weaknesses?.length ?? 0) > 0 || (activeBeast.resistances?.length ?? 0) > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="rounded-none bg-black/30 backdrop-blur-sm border-[oklch(0.72_0.08_75/20%)] p-5">
            <div className="grid md:grid-cols-2 gap-4">
              {(activeBeast.weaknesses?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs souls-title tracking-[0.25em] uppercase text-[oklch(0.72_0.08_75)] mb-2">
                    {labels.weaknesses}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeBeast.weaknesses?.map((value) => (
                      <span
                        key={`weakness-${value}`}
                        className="text-xs souls-text px-2 py-1 border border-red-400/35 text-red-200/90 bg-red-500/8"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(activeBeast.resistances?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs souls-title tracking-[0.25em] uppercase text-[oklch(0.72_0.08_75)] mb-2">
                    {labels.resistances}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeBeast.resistances?.map((value) => (
                      <span
                        key={`resistance-${value}`}
                        className="text-xs souls-text px-2 py-1 border border-emerald-400/35 text-emerald-200/90 bg-emerald-500/8"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats Section */}
      {activeBeast.stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-accent/20 p-6">
            <h2 className="text-2xl font-bold text-accent font-serif mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeBeast.stats.health && (
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-accent/10">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground font-serif">Health</p>
                    <p className="text-lg font-bold text-foreground">{activeBeast.stats.health}</p>
                  </div>
                </div>
              )}
              {activeBeast.stats.attack && (
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-accent/10">
                  <Swords className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground font-serif">Attack</p>
                    <p className="text-lg font-bold text-foreground">{activeBeast.stats.attack}</p>
                  </div>
                </div>
              )}
              {activeBeast.stats.defense && (
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-accent/10">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground font-serif">Defense</p>
                    <p className="text-lg font-bold text-foreground">{activeBeast.stats.defense}</p>
                  </div>
                </div>
              )}
              {activeBeast.stats.speed && (
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-accent/10">
                  <Gauge className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground font-serif">Speed</p>
                    <p className="text-lg font-bold text-foreground">{activeBeast.stats.speed}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Combat Info */}
      <div>
        {/* Ficha and Botín Section - 50/50 Split */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Left: Information - Ficha */}
          <Card className="relative overflow-hidden rounded-none bg-black/25 backdrop-blur-sm border-[oklch(0.72_0.08_75/25%)] p-8 h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.02_75/35%)] via-transparent to-black/55" />
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="souls-title text-3xl text-[oklch(0.72_0.08_75)] tracking-widest">
                  {labels.sheet}
                </h2>
                <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)] mt-3" />
              </div>

              {/* Tipo */}
              <div className="border-b border-[oklch(0.72_0.08_75/15%)] pb-6">
                <p className="text-xs souls-title tracking-[0.3em] uppercase text-[oklch(0.55_0.01_60)] mb-3">
                  {labels.type}
                </p>
                <p className="souls-text text-[oklch(0.72_0.02_70)] text-lg">
                  {getTranslatedRaceLabel(lang, activeBeast.race)}
                </p>
              </div>

              {/* Ubicación */}
              <div className="border-b border-[oklch(0.72_0.08_75/15%)] pb-6">
                <p className="text-xs souls-title tracking-[0.3em] uppercase text-[oklch(0.55_0.01_60)] mb-3">
                  {labels.location}
                </p>
                {habitatImages.length > 0 ? (
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                    {habitatImages.map((src, index) => (
                      <div
                        key={`${activeBeast.slug}-habitat-${index}`}
                        className="relative h-24 w-36 shrink-0 overflow-hidden border border-[oklch(0.72_0.08_75/20%)]"
                      >
                        <Image
                          src={src}
                          alt={`${activeBeast.name} habitat ${index + 1}`}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="souls-text text-[oklch(0.72_0.02_70)]">
                    {lang === "es"
                      ? activeBeast.habitat_es || activeBeast.habitat || "--"
                      : lang === "ja"
                        ? activeBeast.habitat_ja || getHabitatLabel(lang, activeBeast.habitat || "") || "--"
                        : getHabitatLabel(lang, activeBeast.habitat || "") || "--"}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <p className="text-xs souls-title tracking-[0.3em] uppercase text-[oklch(0.55_0.01_60)] mb-3">
                  {labels.description}
                </p>
                {(() => {
                  const translation = getCreatureTranslation(lang, activeBeast.slug);
                  const description = translation?.short || activeBeast.shortDescription;
                  return description ? (
                    <p className="souls-text text-[oklch(0.68_0.03_75)] leading-relaxed">
                      {description}
                    </p>
                  ) : null;
                })()}
              </div>
            </div>
          </Card>

          {/* Right: Botín Grid */}
          {activeBeast.drops && activeBeast.drops.length > 0 && (
            <Card className="relative overflow-hidden rounded-none bg-black/25 backdrop-blur-sm border-[oklch(0.72_0.08_75/25%)] p-8 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.02_75/35%)] via-transparent to-black/55" />
              <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                <div>
                  <h2 className="souls-title text-3xl text-[oklch(0.72_0.08_75)] tracking-widest">
                    {labels.loot}
                  </h2>
                  <div className="w-16 h-px bg-[oklch(0.72_0.08_75/40%)] mt-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {activeBeast.drops.map((drop, index) => {
                    const item = findItem(drop.itemName);
                    const itemLocale = item ? getItemContent(lang, item.id) : undefined;
                    const dropItemName = itemLocale?.name || drop.itemName;
                    return (
                      <div key={index} className="group relative">
                        <button
                          onClick={() => {
                            if (item) setSelectedItem(item);
                          }}
                          className="w-full aspect-square border border-[oklch(0.72_0.08_75/30%)] bg-black/40 group-hover:bg-black/70 transition-all duration-300 cursor-pointer flex items-center justify-center relative overflow-hidden group-hover:scale-110 group-hover:border-[oklch(0.72_0.08_75/80%)]"
                          title={dropItemName}
                        >
                          {item?.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={dropItemName}
                              fill
                              className="object-contain p-3 group-hover:scale-125 transition-transform duration-300 group-hover:saturate-100 saturate-0"
                            />
                          ) : (
                            <div className="text-center px-2">
                              <p className="souls-text text-[oklch(0.72_0.02_70)] text-xs font-semibold group-hover:text-[oklch(0.88_0.08_75)] transition-colors">
                                {dropItemName}
                              </p>
                            </div>
                          )}
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="bg-black/95 border border-[oklch(0.72_0.08_75/50%)] px-3 py-2 rounded whitespace-nowrap">
                              <p className="souls-text text-[oklch(0.72_0.02_70)] text-xs font-semibold">
                                {dropItemName}
                              </p>
                              <p className="text-[10px] souls-title text-[oklch(0.55_0.01_60)] mt-1">
                                {drop.dropRate}
                              </p>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/95" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Abilities */}
        {activeBeast.abilities && activeBeast.abilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-none bg-black/40 backdrop-blur-sm border-accent/20 p-6 h-full">
              <h2 className="text-2xl font-bold text-accent font-serif mb-4">{labels.abilities}</h2>
              <div className="space-y-3">
                {activeBeast.abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="p-3 bg-black/40 rounded-lg border border-accent/10"
                  >
                    <h3 className="font-bold text-foreground font-serif mb-1">
                      {ability.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-serif">
                      {ability.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent 
          lang={lang}
          className={`max-w-2xl bg-black/95 border-[oklch(0.72_0.08_75/30%)] rounded-none [animation:dropInScale_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards] [&>button]:hidden ${japaneseTypographyClass}`}
        >
          <style>{`
            @keyframes dropInScale {
              from {
                scale: 1.4;
                opacity: 0;
              }
              to {
                scale: 1;
                opacity: 1;
              }
            }
          `}</style>
          <DialogHeader className="border-b border-[oklch(0.72_0.08_75/20%)] pb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="souls-title text-2xl text-[oklch(0.72_0.08_75)] tracking-widest">
                  {selectedItemDisplayName}
                </DialogTitle>
                {selectedItemRarity && (
                  <p
                    className="mt-2 text-sm souls-title tracking-[0.2em] uppercase font-semibold"
                    style={{ color: selectedItemRarityColor, textShadow: `0 0 10px ${selectedItemRarityColor}55` }}
                  >
                    {selectedItemRarity.toUpperCase()}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
            {/* Image & Model Section */}
            {(selectedItemImageUrl || selectedItemModel3dUrl) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs souls-title tracking-[0.2em] uppercase text-[oklch(0.55_0.01_60)]">
                    {labels.visual}
                  </p>
                  <ViewerToggle
                    is3D={itemViewMode === "3d"}
                    has3DModel={!!selectedItemModel3dUrl}
                    onToggle={() => setItemViewMode((prev) => (prev === "2d" ? "3d" : "2d"))}
                  />
                </div>
                <div className="relative mx-auto w-full max-w-[280px] aspect-square bg-black/40 border border-[oklch(0.72_0.08_75/20%)] overflow-hidden shadow-[0_0_20px_oklch(0.72_0.08_75/18%)]">
                  {itemViewMode === "3d" && selectedItemModel3dUrl ? (
                    <div className="absolute inset-0">
                      <ModelViewer3D modelUrl={selectedItemModel3dUrl} />
                    </div>
                  ) : selectedItemImageUrl ? (
                    <Image
                      src={selectedItemImageUrl}
                      alt={selectedItem?.name ?? "Item"}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[oklch(0.55_0.01_60)] text-xs">
                      {labels.noImage}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedItemShortDescription && (
              <div>
                <p className="text-xs souls-title tracking-[0.2em] uppercase text-[oklch(0.55_0.01_60)] mb-2">
                  {labels.description}
                </p>
                <p className="souls-text text-[oklch(0.68_0.03_75)] text-sm leading-relaxed">
                  {selectedItemShortDescription}
                </p>
              </div>
            )}

            {/* Lore Description */}
            {selectedItemLoreDescription && (
              <div>
                <p className="text-xs souls-title tracking-[0.2em] uppercase text-[oklch(0.55_0.01_60)] mb-2">
                  Lore
                </p>
                <p className="souls-text text-[oklch(0.65_0.02_75)] text-sm leading-relaxed whitespace-pre-line">
                  {selectedItemLoreDescription}
                </p>
              </div>
            )}

            {/* Stats Section */}
            {selectedItem?.stats && Object.keys(selectedItem.stats).length > 0 && (
              <div>
                <p className="text-xs souls-title tracking-[0.2em] uppercase text-[oklch(0.55_0.01_60)] mb-2">
                  {labels.stats}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedItem.stats).map(([key, value]) => (
                    <div key={key} className="p-2 border border-[oklch(0.72_0.08_75/15%)] text-xs">
                      <p className="text-[oklch(0.55_0.01_60)] capitalize">{key}</p>
                      <p className="souls-text text-[oklch(0.72_0.02_70)] font-semibold">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Obtain */}
            {selectedItemHowToObtain && (
              <div>
                <p className="text-xs souls-title tracking-[0.2em] uppercase text-[oklch(0.55_0.01_60)] mb-2">
                  {labels.howToObtain}
                </p>
                <p className="souls-text text-[oklch(0.65_0.02_75)] text-sm">
                  {selectedItemHowToObtain}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
