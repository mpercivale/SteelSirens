
"use client";

import { Beast, Item } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BeastDetail } from "./BeastDetail";
import { 
  User,
  Users,
  Ghost,
  Moon,
  PawPrint,
  Eye,
  Sparkles,
  Droplet,
  Shield,
  Flame
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { resolveLanguage, type Language } from "@/lib/i18n";
import { getCreatureTranslation, getRaceLabel as getTranslatedRaceLabel } from "@/lib/bestiary-translations";
import { getBeastUnlockRequirements, getDiscoveredCharacterSlugs, isBeastUnlocked } from "@/lib/progression";

type WispParticleSeed = {
  size: number;
  angle: number;
  spawnRadius: number;
  radialDrift: number;
  durationJitter: number;
  delay: number;
};

type WispRaySeed = {
  angle: number;
  spawnRadius: number;
  length: number;
  duration: number;
  delay: number;
};

type AshSeed = {
  left: number;
  top: number;
  delay: number;
};

type BeastParticleSeed = {
  wispLayers: WispParticleSeed[][];
  wispRays: WispRaySeed[];
  ash: AshSeed[];
};

const wispParticleSystems = [
  { count: 186, color: "rgba(181, 213, 255, 0.6)", minSize: 0.45, maxSize: 1.55, rise: 34, duration: 2.9 },
  { count: 82, color: "rgba(129, 249, 255, 0.55)", minSize: 0.4, maxSize: 1.35, rise: 42, duration: 2.5 },
  { count: 56, color: "rgba(255, 244, 181, 0.5)", minSize: 0.35, maxSize: 1.15, rise: 30, duration: 2.3 },
  { count: 56, color: "rgba(255, 197, 197, 0.5)", minSize: 0.35, maxSize: 1.2, rise: 36, duration: 2.4 },
] as const;

const WISP_RAYS_COUNT = 34;
const ASH_PARTICLES_COUNT = 16;

const createSeededRng = (seedText: string) => {
  let hash = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  let state = hash >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const createBeastParticleSeed = (beastId: string): BeastParticleSeed => {
  const random = createSeededRng(beastId);

  const wispLayers = wispParticleSystems.map((system) =>
    Array.from({ length: system.count }, () => ({
      size: system.minSize + random() * (system.maxSize - system.minSize),
      angle: random() * Math.PI * 2,
      spawnRadius: random() * 12,
      radialDrift: 36 + random() * 72,
      durationJitter: random() * 1.8,
      delay: random() * 2,
    }))
  );

  const wispRays = Array.from({ length: WISP_RAYS_COUNT }, () => ({
    angle: random() * Math.PI * 2,
    spawnRadius: random() * 4,
    length: 10 + random() * 22,
    duration: 4.8 + random() * 2.4,
    delay: random() * 2.2,
  }));

  const ash = Array.from({ length: ASH_PARTICLES_COUNT }, () => ({
    left: random() * 100,
    top: random() * 100,
    delay: random(),
  }));

  return { wispLayers, wispRays, ash };
};

interface BestiaryGridProps {
  beasts: Beast[];
  items: Item[];
  lang?: Language;
}

const raceCategoriesBase = [
  { value: "all", labelEn: "All Creatures", labelEs: "Todas las Criaturas", labelJa: "すべての生き物" },
  { value: "humanoid", labelEn: "Humanoid", labelEs: "Humanoide", labelJa: "人間" },
  { value: "demihuman", labelEn: "Demihuman", labelEs: "Semihumano", labelJa: "半人間" },
  { value: "demon", labelEn: "Demon", labelEs: "Demonio", labelJa: "悪魔" },
  { value: "vampire", labelEn: "Vampire", labelEs: "Vampiro", labelJa: "吸血鬼" },
  { value: "undead", labelEn: "Undead", labelEs: "No Muerto", labelJa: "アンデッド" },
  { value: "beast", labelEn: "Beast", labelEs: "Bestia", labelJa: "獣" },
  { value: "dragon", labelEn: "Dragon", labelEs: "Dragón", labelJa: "竜" },
  { value: "aberration", labelEn: "Aberration", labelEs: "Abominación", labelJa: "異形" },
  { value: "elemental", labelEn: "Elemental", labelEs: "Elemental", labelJa: "元素" },
];

export function BestiaryGrid({ beasts, items, lang }: BestiaryGridProps) {
  const [selectedRace, setSelectedRace] = useState("all");
  const [hoveredBeastId, setHoveredBeastId] = useState<string | null>(null);
  const [trollPortraitIndex, setTrollPortraitIndex] = useState(0);
  const [licantroposPortraitIndex, setLicantroposPortraitIndex] = useState(0);
  const [variantTick, setVariantTick] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedBeast, setSelectedBeast] = useState<Beast | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [discoveredCharacterSlugs, setDiscoveredCharacterSlugs] = useState<string[]>([]);
  
  // Fallback to search params if lang prop not provided
  const searchParams = useSearchParams();
  const finalLang = lang || (resolveLanguage(searchParams.get("lang")) as Language);
  const japaneseTypographyClass = finalLang === "ja" ? "font-noto-serif-jp [&_*]:!font-noto-serif-jp" : "";

  // Rotate troll and licantropos portraits every 4.5 seconds
  const trollPortraitOptions = ["troll-gordo", "troll-delgado", "troll-bajito"];
  const licantroposPortraitOptions = ["licantropos-v1", "licantropos-v2", "licantropos-v3"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTrollPortraitIndex((prev) => (prev + 1) % trollPortraitOptions.length);
      setLicantroposPortraitIndex((prev) => (prev + 1) % licantroposPortraitOptions.length);
      setVariantTick((prev) => prev + 1);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setDiscoveredCharacterSlugs(getDiscoveredCharacterSlugs());
  }, []);

  useEffect(() => {
    const onStorage = () => setDiscoveredCharacterSlugs(getDiscoveredCharacterSlugs());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filteredBeasts = selectedRace === "all"
    ? beasts
    : beasts.filter(beast => beast.race === selectedRace);

  const goToPreviousBeast = useCallback(() => {
    setSelectedBeast((current) => {
      if (!current) return current;
      const currentIndex = beasts.findIndex((beast) => beast.slug === current.slug);
      if (currentIndex === -1) return current;
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : beasts.length - 1;
      return beasts[previousIndex] ?? current;
    });
  }, [beasts]);

  const goToNextBeast = useCallback(() => {
    setSelectedBeast((current) => {
      if (!current) return current;
      const currentIndex = beasts.findIndex((beast) => beast.slug === current.slug);
      if (currentIndex === -1) return current;
      const nextIndex = currentIndex < beasts.length - 1 ? currentIndex + 1 : 0;
      return beasts[nextIndex] ?? current;
    });
  }, [beasts]);

  const particleSeeds = useMemo(
    () =>
      beasts.reduce<Record<string, BeastParticleSeed>>((accumulator, beast) => {
        accumulator[beast.id] = createBeastParticleSeed(beast.id);
        return accumulator;
      }, {}),
    [beasts]
  );

  const getRaceColor = (race?: string) => {
    switch (race) {
      case "humanoid":
        return "border-[oklch(0.72_0.08_75/60%)] text-blue-300 bg-black";
      case "demihuman":
        return "border-[oklch(0.72_0.08_75/60%)] text-cyan-300 bg-black";
      case "demon":
        return "border-[oklch(0.72_0.08_75/60%)] text-red-300 bg-black";
      case "vampire":
        return "border-[oklch(0.72_0.08_75/60%)] text-purple-300 bg-black";
      case "undead":
        return "border-[oklch(0.72_0.08_75/60%)] text-gray-300 bg-black";
      case "beast":
        return "border-[oklch(0.72_0.08_75/60%)] text-green-300 bg-black";
      case "dragon":
        return "border-[oklch(0.72_0.08_75/60%)] text-orange-300 bg-black";
      case "aberration":
        return "border-[oklch(0.72_0.08_75/60%)] text-pink-300 bg-black";
      case "elemental":
        return "border-[oklch(0.72_0.08_75/60%)] text-yellow-300 bg-black";
      default:
        return "border-[oklch(0.72_0.08_75/60%)] text-amber-300 bg-black";
    }
  };

  const getDisplayRaceLabel = (race?: string) => {
    return getTranslatedRaceLabel(finalLang, race || "");
  };

  const getRaceIcon = (race?: string) => {
    const iconClass = "w-3.5 h-3.5";
    switch (race) {
      case "humanoid":
        return <User className={iconClass} />;
      case "demihuman":
        return <Users className={iconClass} />;
      case "demon":
        return <Flame className={iconClass} />;
      case "vampire":
        return <Droplet className={iconClass} />;
      case "undead":
        return <Ghost className={iconClass} />;
      case "beast":
        return <PawPrint className={iconClass} />;
      case "dragon":
        return <Flame className={iconClass} />;
      case "aberration":
        return <Eye className={iconClass} />;
      case "elemental":
        return <Sparkles className={iconClass} />;
      default:
        return <Shield className={iconClass} />;
    }
  };

  return (
    <div className={`space-y-8 ${japaneseTypographyClass}`}>
      {/* Race Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {raceCategoriesBase.map((category) => {
          const label = finalLang === "es" ? category.labelEs : finalLang === "ja" ? category.labelJa : category.labelEn;
          const fontClass = finalLang === "ja" ? "font-noto-serif-jp" : "font-serif";
          return (
            <button
              key={category.value}
              onClick={() => setSelectedRace(category.value)}
              className={cn(
                `px-4 py-2 ${fontClass} text-sm transition-all border-2`,
                selectedRace === category.value
                  ? "bg-accent/60 text-accent border-accent shadow-lg shadow-accent/50"
                  : "bg-black/40 text-muted-foreground/70 border-accent/20 hover:border-accent/60 hover:text-accent hover:bg-accent/10"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Beasts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredBeasts.map((beast, index) => {
          const isHovered = hoveredBeastId === beast.id;
          const translation = getCreatureTranslation(finalLang, beast.slug);
          const displayName = translation?.name || beast.name;
          const displayDesc = translation?.short || beast.shortDescription;
          const fontClass = finalLang === "ja" ? "font-noto-serif-jp" : "font-serif";
          const isUnlocked = isBeastUnlocked(beast, discoveredCharacterSlugs);
          const requiredCount = getBeastUnlockRequirements(beast).length;
          const sealedLabel = finalLang === "es" ? "Entrada Sellada" : finalLang === "ja" ? "封印済み" : "Sealed Entry";
          const sealedHint =
            finalLang === "es"
              ? `Descubre personajes para desbloquear (${requiredCount})`
              : finalLang === "ja"
              ? `キャラクター発見で解除（${requiredCount}）`
              : `Discover characters to unlock (${requiredCount})`;
          const currentPreviewSlug =
            beast.slug === "trolls-psiquicos"
              ? trollPortraitOptions[trollPortraitIndex] ?? "troll-bajito"
              : beast.slug === "licantropos"
              ? licantroposPortraitOptions[licantroposPortraitIndex] ?? "licantropos-v1"
              : beast.slug === "golems-de-la-cosecha"
              ? "hombre-de-paja"
              : beast.slug;
          const portraitSlug = currentPreviewSlug;
          const isShortTrollPreview =
            beast.slug === "trolls-psiquicos" && currentPreviewSlug === "troll-bajito";
          const imagePrimarySrc = isShortTrollPreview
            ? "/images/bestiary/troll-bajito.png"
            : `/images/bestiary/portraits/${portraitSlug}-portrait.png`;
          const imageFallbackSrc = `/images/bestiary/${portraitSlug}.png`;
          const imageFinalFallbackSrc = `/images/bestiary/${beast.slug}.png`;
          const isVariantPreview = beast.slug === "trolls-psiquicos" || beast.slug === "licantropos";
          const imageKey = isVariantPreview
            ? `${beast.slug}-${portraitSlug}-${variantTick}`
            : `${beast.slug}-${portraitSlug}`;

          return (
          <motion.div
            key={beast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onMouseEnter={() => setHoveredBeastId(beast.id)}
            onMouseLeave={() => setHoveredBeastId(null)}
            className="transition-transform duration-500 ease-out will-change-transform hover:scale-[1.02]"
          >
            <div 
              onClick={() => {
                if (!isUnlocked) {
                  return;
                }
                setSelectedBeast(beast);
                setIsDetailOpen(true);
              }}
            >
              <div className="relative group">
                {/* Race Badge - Over border line, top layer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                  <Badge
                    variant="outline"
                    className={`font-serif text-xs border-2 px-2 py-1 ${getRaceColor(beast.race)}`}
                  >
                    {getRaceIcon(beast.race)}
                  </Badge>
                </div>

                <div className={`aspect-square bg-black/40 backdrop-blur-sm border-2 overflow-hidden transition-[border-color,box-shadow,transform] duration-500 ease-out transform-gpu ${
                  isUnlocked
                    ? "border-[oklch(0.72_0.08_75/20%)] hover:border-[oklch(0.72_0.08_75/50%)] cursor-pointer group-hover:shadow-[0_0_20px_oklch(0.72_0.08_75/18%)]"
                    : "border-[oklch(0.72_0.08_75/14%)] cursor-not-allowed"
                }`}>
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-accent/50 via-accent/20 to-transparent opacity-[0.08] group-hover:opacity-100 transition-opacity duration-700 ease-out" />

                  {/* Beast Icon/Image */}
                  <div
                    className={cn(
                      "relative w-full h-full flex items-center justify-center",
                      beast.slug === "wisp" ? "p-3" : "p-0 overflow-hidden"
                    )}
                  >
                    {beast.slug === "wisp" && (
                      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-900 ease-out ${isHovered ? "opacity-100" : "opacity-0"}`}>
                        <motion.div
                          className="absolute inset-[22%] rounded-full pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(186,216,255,0.18) 0%, rgba(130,218,255,0.1) 45%, rgba(130,218,255,0) 78%)",
                            filter: "blur(14px)",
                          }}
                          animate={{
                            opacity: [0.06, 0.18, 0.06],
                            scale: [0.95, 1.08, 0.95],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          className="absolute inset-[18%] rounded-full pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(196,228,255,0.12) 0%, rgba(136,224,255,0.07) 42%, rgba(136,224,255,0) 82%)",
                            filter: "blur(20px)",
                          }}
                          animate={{
                            opacity: [0.03, 0.11, 0.03],
                            scale: [0.92, 1.14, 0.92],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.35,
                          }}
                        />
                      </div>
                    )}
                    <AnimatePresence mode="sync" initial={false}>
                      <motion.div
                        key={imageKey}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{
                          opacity: { duration: 1.5, ease: "easeInOut" },
                          scale: { duration: 1.5, ease: "easeInOut" },
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={imagePrimarySrc}
                          alt={beast.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                          onError={(event) => {
                            const target = event.currentTarget as HTMLImageElement;
                            if (!target.src.includes(imageFallbackSrc) && !target.src.includes(imageFinalFallbackSrc) && !target.src.includes("placeholder-beast.svg")) {
                              target.src = imageFallbackSrc;
                            } else if (!target.src.includes(imageFinalFallbackSrc) && !target.src.includes("placeholder-beast.svg")) {
                              target.src = imageFinalFallbackSrc;
                            } else if (!target.src.includes("placeholder-beast.svg")) {
                              target.src = "/images/bestiary/placeholder-beast.svg";
                            }
                          }}
                          className={`transition-[transform,filter] duration-700 ease-out object-contain scale-[1.0] group-hover:scale-[1.03] transform-gpu will-change-transform`}
                          style={{
                            filter: `${isHovered ? "grayscale(0) saturate(1) brightness(1)" : "grayscale(1) saturate(0.1) brightness(0.62)"} ${
                          beast.slug === "wisp"
                            ? isHovered
                              ? "drop-shadow(0 0 10px rgba(186, 216, 255, 0.34)) drop-shadow(0 0 16px rgba(88, 224, 255, 0.22)) drop-shadow(0 0 6px rgba(255, 126, 220, 0.12))"
                              : "drop-shadow(0 0 6px rgba(186, 216, 255, 0.12)) drop-shadow(0 0 8px rgba(88, 224, 255, 0.08))"
                            : beast.slug === "cabalgata-nocturna"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(187, 22, 0, 0.38)) drop-shadow(0 0 8px rgba(184, 88, 96, 0.36)) drop-shadow(0 0 4px rgba(28, 24, 66, 0.45))"
                              : "drop-shadow(0 0 8px rgba(128, 100, 113, 0.24)) drop-shadow(0 0 4px rgba(120, 88, 184, 0.14))"
                            : beast.slug === "esfinge"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(125, 167, 161, 0.5)) drop-shadow(0 0 8px rgba(135, 185, 231, 0.25)) drop-shadow(0 0 4px rgba(131, 43, 139, 0.4))"
                              : "drop-shadow(0 0 8px rgba(110, 104, 87, 0.2)) drop-shadow(0 0 4px rgba(218, 165, 32, 0.12))"
                            : beast.slug === "gallo-de-tres-cabezas"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(115, 122, 122, 0.5)) drop-shadow(0 0 8px rgba(132, 143, 156, 0.43)) drop-shadow(0 0 4px rgba(178, 34, 34, 0.4))"
                              : "drop-shadow(0 0 8px rgba(90, 89, 97, 0.2)) drop-shadow(0 0 4px rgba(102, 115, 117, 0.12))"
                            : beast.slug === "lobizon"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(100, 130, 180, 0.5)) drop-shadow(0 0 8px rgba(175, 172, 169, 0.35)) drop-shadow(0 0 4px rgba(70, 70, 70, 0.4))"
                              : "drop-shadow(0 0 8px rgba(100, 130, 180, 0.2)) drop-shadow(0 0 4px rgba(156, 151, 145, 0.12))"
                            : beast.slug === "semihumanos"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(70, 100, 140, 0.5)) drop-shadow(0 0 8px rgba(100, 140, 180, 0.35)) drop-shadow(0 0 4px rgba(50, 50, 80, 0.4))"
                              : "drop-shadow(0 0 8px rgba(70, 100, 140, 0.2)) drop-shadow(0 0 4px rgba(100, 140, 180, 0.12))"
                            : beast.slug === "troll-gordo" || beast.slug === "troll-delgado" || beast.slug === "troll-bajito" || beast.slug === "trolls-psiquicos"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(139, 146, 141, 0.64)) drop-shadow(0 0 8px rgba(172, 172, 153, 0.35)) drop-shadow(0 0 4px rgba(138, 134, 129, 0.4))"
                              : "drop-shadow(0 0 8px rgba(97, 110, 82, 0.2)) drop-shadow(0 0 4px rgba(171, 173, 140, 0.12))"
                            : beast.slug === "golem-de-barro"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(160, 82, 45, 0.5)) drop-shadow(0 0 8px rgba(205, 130, 0, 0.35)) drop-shadow(0 0 4px rgba(100, 50, 10, 0.4))"
                              : "drop-shadow(0 0 8px rgba(160, 82, 45, 0.2)) drop-shadow(0 0 4px rgba(205, 130, 0, 0.12))"
                            : beast.slug === "dragon"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(184, 92, 23, 0.5)) drop-shadow(0 0 8px rgba(255, 165, 0, 0.35)) drop-shadow(0 0 4px rgba(139, 69, 19, 0.4))"
                              : "drop-shadow(0 0 8px rgba(184, 92, 23, 0.2)) drop-shadow(0 0 4px rgba(255, 165, 0, 0.12))"
                            : beast.slug === "dragon-joven"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(185, 176, 169, 0.5)) drop-shadow(0 0 8px rgba(196, 196, 196, 0.35)) drop-shadow(0 0 4px rgba(105, 102, 99, 0.4))"
                              : "drop-shadow(0 0 8px rgba(122, 118, 115, 0.2)) drop-shadow(0 0 4px rgba(107, 106, 103, 0.12))"
                            : beast.slug === "hombre-de-paja"
                            ? isHovered
                              ? "drop-shadow(0 0 12px rgba(184, 134, 11, 0.5)) drop-shadow(0 0 8px rgba(218, 191, 138, 0.35)) drop-shadow(0 0 4px rgba(139, 101, 8, 0.4))"
                              : "drop-shadow(0 0 8px rgba(184, 134, 11, 0.2)) drop-shadow(0 0 4px rgba(218, 191, 138, 0.12))"
                            : isHovered
                            ? "drop-shadow(0 0 12px rgba(180, 130, 70, 0.5)) drop-shadow(0 0 6px rgba(180, 130, 70, 0.3))"
                            : "drop-shadow(0 0 8px rgba(180, 130, 70, 0.2)) drop-shadow(0 0 4px rgba(180, 130, 70, 0.1))"
                          }`,
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent px-3 pt-6 pb-2">
                    <h3 className={`souls-title text-xs tracking-widest text-[oklch(0.88_0.01_60)] text-center line-clamp-2 ${fontClass}`}>
                      {isUnlocked ? displayName : "???"}
                    </h3>
                    {isUnlocked && displayDesc && (
                      <p className={`text-[10px] souls-text text-[oklch(0.55_0.01_60)] mt-1 text-center line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${fontClass}`}>
                        {displayDesc}
                      </p>
                    )}
                  </div>

                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center px-3 text-center">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[oklch(0.72_0.08_75)] font-semibold">{sealedLabel}</p>
                      <p className="mt-2 text-[10px] text-foreground/70 font-serif leading-relaxed">{sealedHint}</p>
                    </div>
                  )}

                  {/* Ash particles on hover */}
                  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-900 ease-out ${beast.slug === "wisp" ? (isHovered ? "opacity-100 z-30" : "opacity-0") : "opacity-0 group-hover:opacity-100"}`}>
                    {hasMounted && (beast.slug === "wisp" ? (
                      <>
                        {wispParticleSystems.map((system, systemIndex) => {
                          const layerSeeds = particleSeeds[beast.id]?.wispLayers[systemIndex] || [];
                          return (
                          <div key={`wisp-layer-${systemIndex}`} className="absolute inset-0">
                            {layerSeeds.map((seed, i) => {
                              const size = seed.size;
                              const angle = seed.angle;
                              const spawnRadius = seed.spawnRadius;
                              const radialDrift = seed.radialDrift;
                              const startX = 50 + Math.cos(angle) * spawnRadius;
                              const startY = 50 + Math.sin(angle) * spawnRadius;
                              return (
                                <motion.div
                                  key={`wisp-${systemIndex}-${i}`}
                                  className="absolute rounded-full"
                                  style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    left: `${startX}%`,
                                    top: `${startY}%`,
                                    background: system.color,
                                    boxShadow: `0 0 ${2 + size * 1.3}px ${system.color}`,
                                    filter: "saturate(1.05)",
                                  }}
                                  animate={{
                                    x: [0, Math.cos(angle) * radialDrift],
                                    y: [0, Math.sin(angle) * radialDrift - system.rise * 0.5],
                                    opacity: [0.04, 0.55, 0],
                                    scale: [0.8, 1.1, 0.95],
                                  }}
                                  transition={{
                                    duration: system.duration + 1.6 + seed.durationJitter,
                                    repeat: Infinity,
                                    delay: seed.delay,
                                    ease: "easeOut",
                                  }}
                                />
                              );
                            })}
                          </div>
                          );
                        })}

                        <div className="absolute inset-0">
                          {(particleSeeds[beast.id]?.wispRays || []).map((seed, i) => {
                            const angle = seed.angle;
                            const angleDeg = (angle * 180) / Math.PI;
                            const spawnRadius = seed.spawnRadius;
                            const length = seed.length;
                            const startX = 50 + Math.cos(angle) * spawnRadius;
                            const startY = 50 + Math.sin(angle) * spawnRadius;
                            const color = i % 4 === 0
                              ? "rgba(188, 220, 255, 0.52)"
                              : i % 4 === 1
                              ? "rgba(118, 246, 255, 0.45)"
                              : i % 4 === 2
                              ? "rgba(255, 235, 156, 0.4)"
                              : "rgba(255, 178, 233, 0.4)";
                            return (
                              <motion.div
                                key={`wisp-ray-${i}`}
                                className="absolute origin-left rounded-full"
                                style={{
                                  width: `${length}px`,
                                  height: "1px",
                                  left: `${startX}%`,
                                  top: `${startY}%`,
                                  rotate: `${angleDeg}deg`,
                                  background: `linear-gradient(90deg, ${color} 0%, rgba(255,255,255,0) 100%)`,
                                  boxShadow: `0 0 5px ${color}`,
                                }}
                                animate={{
                                  rotate: [`${angleDeg}deg`, `${angleDeg}deg`],
                                  opacity: [0, 0.65, 0],
                                  scaleX: [0.08, 1.35, 0.42],
                                  scaleY: [0.85, 1.1, 0.9],
                                }}
                                transition={{
                                  duration: seed.duration,
                                  repeat: Infinity,
                                  delay: seed.delay,
                                  ease: "easeOut",
                                }}
                              />
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      (particleSeeds[beast.id]?.ash || []).map((seed, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-accent/60 rounded-full"
                          style={{
                            left: `${seed.left}%`,
                            top: `${seed.top}%`,
                          }}
                          animate={{
                            y: [0, -40],
                            opacity: [0.6, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: seed.delay,
                          }}
                        />
                      ))
                    ))}
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        );})}
      </div>

      {/* No results message */}
      {filteredBeasts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif text-lg">
            No creatures found in this category
          </p>
        </div>
      )}

      {/* Beast Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={(open) => {
        setIsDetailOpen(open);
        if (!open) setSelectedBeast(null);
      }}>
        <DialogContent
          lang={finalLang}
          className={`modal-scrollbar max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-visible p-0 bg-background/95 backdrop-blur-xl border-2 border-[oklch(0.72_0.08_75/35%)] shadow-[0_0_20px_oklch(0.72_0.08_75/15%)] ${japaneseTypographyClass}`}
        >
          <DialogTitle className="sr-only">
            {selectedBeast ? getCreatureTranslation(finalLang, selectedBeast.slug)?.name || selectedBeast.name : "Beast Detail"}
          </DialogTitle>
          {selectedBeast && (
            <BeastDetail
              beast={selectedBeast}
              allBeasts={beasts}
              allItems={items}
              lang={finalLang}
              enableRouteNavigation={false}
              showInternalNavigation={true}
              onPrevious={goToPreviousBeast}
              onNext={goToNextBeast}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
