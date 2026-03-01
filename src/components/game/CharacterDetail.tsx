
"use client";

import { Character, Personaje } from "@/types/game";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import ModelViewer3D from "./ModelViewer3D";
import CharacterGlow from "./CharacterGlow";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockObjetos } from "@/data/mock-data";
import RelationsNodeMap from "./RelationsNodeMap";
import {
  getCharacterCircleContent,
  getCharacterCircleIdentities,
  getCharacterDetailContent,
  getCharacterDetailCopy,
  getItemContent,
  type Language,
} from "@/lib/i18n";

interface CharacterDetailProps {
  character: Character;
  personaje: Personaje;
  lang?: Language;
}

type AshParticleSeed = {
  left: number;
  top: number;
  duration: number;
  delay: number;
};

type ChronicleSection = {
  title: string;
  metaLines: string[];
  content: string;
};

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

export function CharacterDetail({ character, personaje, lang = "en" }: CharacterDetailProps) {
  const [is3DMode, setIs3DMode] = useState(false);
  const [displayName, setDisplayName] = useState(character.name);
  const [isLoreExpanded, setIsLoreExpanded] = useState(false);
  const [expandedChronicleCards, setExpandedChronicleCards] = useState<Record<number, boolean>>({});
  const characterGlowColor = personaje.color_glow || personaje.colorGlow || character.colorGlow || "#ffffff";
  const copy = getCharacterDetailCopy(lang);
  const dialogueTitle = lang === "es" ? "Diálogos" : lang === "ja" ? "台詞" : "Dialogues";
  const dialogueHint =
    lang === "es"
      ? "Espacio para añadir audios de diálogo del personaje."
      : lang === "ja"
      ? "キャラクターの台詞音声を追加するためのスペースです。"
      : "Space to add the character's dialogue audios.";
  const dialogueEmptyLabel =
    lang === "es"
      ? "Sin audios aún. Puedes añadirlos en mock-data usando dialogueAudios."
      : lang === "ja"
      ? "まだ音声がありません。mock-data の dialogueAudios に追加できます。"
      : "No audios yet. You can add them in mock-data using dialogueAudios.";
  const ashParticleSeeds = useMemo<AshParticleSeed[]>(() => {
    const nextRandom = createSeededRng(`${personaje.slug}-${lang}-character-detail-ash`);
    return Array.from({ length: 20 }, () => ({
      left: nextRandom() * 100,
      top: nextRandom() * 100,
      duration: 3 + nextRandom() * 2,
      delay: nextRandom() * 2,
    }));
  }, [personaje.slug, lang]);

  const resolvedCharacterLore =
    character.lore?.[lang === "ja" ? "jp" : lang] ??
    character.lore?.es ??
    character.lore?.en ??
    character.lore?.jp ??
    "";

  const localizedCharacter = getCharacterDetailContent(lang, {
    slug: personaje.slug,
    title: character.title,
    class: character.class,
    origin: character.origin,
    shortDescription: character.shortDescription,
    lore: resolvedCharacterLore,
    build: {
      archetype: character.build?.archetype,
      weaponClass: character.build?.weaponClass,
      damageFocus: character.build?.damageFocus,
    },
  });

  const loreText = localizedCharacter.lore || copy.empty.noLore;
  const loreIsLong = useMemo(() => {
    const lineCount = loreText.split("\n").length;
    return loreText.length > 900 || lineCount > 18;
  }, [loreText]);
  const chronicleSections = useMemo<ChronicleSection[]>(() => {
    const lines = loreText.split("\n");
    const headerPattern = /^(Day\s+.+—.*|Día\s+.+—.*|出立より.+日目\s*—?.*)$/u;
    const separatorPattern = /^[—-]{3,}$/u;

    const sections: Array<{ title: string; body: string[] }> = [];
    let current: { title: string; body: string[] } | null = null;

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (headerPattern.test(trimmed)) {
        if (current) {
          sections.push(current);
        }
        current = { title: trimmed, body: [] };
        continue;
      }

      if (!current) {
        continue;
      }

      if (separatorPattern.test(trimmed)) {
        continue;
      }

      current.body.push(rawLine.trimStart());
    }

    if (current) {
      sections.push(current);
    }

    return sections
      .map((section) => {
        const rawContent = section.body.join("\n").trim();
        const contentLines = rawContent.split("\n");
        const metaLines: string[] = [];
        let bodyStartIndex = 0;

        for (let index = 0; index < contentLines.length; index += 1) {
          const line = contentLines[index].trim();
          if (!line) {
            bodyStartIndex = index + 1;
            break;
          }
          if (metaLines.length < 3) {
            metaLines.push(line);
            bodyStartIndex = index + 1;
            continue;
          }
          break;
        }

        const bodyContent = contentLines.slice(bodyStartIndex).join("\n").trim();

        return {
          title: section.title,
          metaLines,
          content: bodyContent.length > 0 ? bodyContent : rawContent,
        };
      })
      .filter((section) => section.title.length > 0 && section.content.length > 0);
  }, [loreText]);
  const isMaidenChronicleCards = personaje.slug === "la-doncella" && chronicleSections.length >= 2;
  const sealedLetterLabel = lang === "es" ? "Carta sellada" : lang === "ja" ? "封蝋書簡" : "Sealed Letter";

  useEffect(() => {
    const identities = getCharacterCircleIdentities(lang, personaje);
    const picked = identities[Math.floor(Math.random() * identities.length)] ?? identities[0];
    setDisplayName(picked?.name ?? character.name);
  }, [personaje.id, lang]);

  useEffect(() => {
    setIsLoreExpanded(false);
  }, [personaje.slug, lang]);

  useEffect(() => {
    setExpandedChronicleCards({});
  }, [personaje.slug, lang, loreText]);

  const statEntries = [
    { label: copy.stats.vigor, value: character.stats?.vigor ?? character.stats?.vitality },
    { label: copy.stats.mind, value: character.stats?.mind },
    { label: copy.stats.endurance, value: character.stats?.endurance ?? character.stats?.defense },
    { label: copy.stats.strength, value: character.stats?.strength },
    { label: copy.stats.dexterity, value: character.stats?.dexterity },
    { label: copy.stats.intelligence, value: character.stats?.intelligence ?? character.stats?.magic },
    { label: copy.stats.faith, value: character.stats?.faith },
    { label: copy.stats.arcane, value: character.stats?.arcane },
  ];

  const numericStatValues = statEntries
    .map((entry) => entry.value)
    .filter((value): value is number => typeof value === "number");

  const maxStatValue = numericStatValues.length > 0 ? Math.max(100, ...numericStatValues) : 100;

  type Standing = "hostile" | "neutral" | "friendly" | "honored" | "revered" | "exalted";

  const deriveStanding = (relationType: string): Standing => {
    const normalized = relationType.toLowerCase();
    if (["antagonistic", "antagonist", "corruptor", "moral opposition"].some((v) => normalized.includes(v))) {
      return "hostile";
    }
    if (["mentor", "mentee", "catalyst"].some((v) => normalized.includes(v))) {
      return "friendly";
    }
    if (["savior", "former mentor", "cryptic guide"].some((v) => normalized.includes(v))) {
      return "honored";
    }
    if (["mirror", "recognition", "wary", "mutual distrust", "uneasy alliance"].some((v) => normalized.includes(v))) {
      return "neutral";
    }
    return "neutral";
  };

  const standingLabel = copy.standings as Record<Standing, string>;

  const relationNameToSlug: Record<string, string> = {
    "el perro": "el-perro",
    "the dog": "el-perro",
    "the hound": "el-perro",
    "el sabueso": "el-perro",
    "猟犬": "el-perro",
    "エル・ペロ": "el-perro",
    "el escudero": "el-escudero",
    "the squire": "el-escudero",
    "従者": "el-escudero",
    "la doncella": "la-doncella",
    "the maiden": "la-doncella",
    "乙女": "la-doncella",
    "el juez": "el-juez",
    "the judge": "el-juez",
    "裁き手": "el-juez",
    "el hechicero": "el-hechicero",
    "the sorcerer": "el-hechicero",
    "魔術師": "el-hechicero",
    "el viejo del manto blanco": "el-viejo-manto-blanco",
    "the old man in white cloak": "el-viejo-manto-blanco",
    "白き外套の老翁": "el-viejo-manto-blanco",
    "la custodia": "ruth",
    ruth: "ruth",
    "the hidden mage": "ruth",
    "the custodian": "ruth",
    "depths custodian": "ruth",
    "隠されし魔導者": "ruth",
  };

  const localizeRelationCharacterName = (name: string) => {
    const slug = relationNameToSlug[name.trim().toLowerCase()];
    if (!slug) return name;
    return getCharacterCircleContent(lang, { slug, name }).name || name;
  };

  const localizedRelationType = (relationType: string) => {
    const normalized = relationType.toLowerCase();
    if (lang === "en") return relationType;

    const mapsByLang: Record<Exclude<Language, "en">, Array<[string, string]>> = {
      es: [
        ["mentor", "Mentor"],
        ["mentee", "Aprendiz"],
        ["wary respect", "Respeto cauteloso"],
        ["wary", "Desconfianza"],
        ["open hostility", "Hostilidad abierta"],
        ["antagonistic", "Antagonista"],
        ["catalyst", "Catalizador"],
        ["moral opposition", "Oposición moral"],
        ["uneasy curiosity", "Curiosidad inquieta"],
        ["target of obsession", "Objetivo de obsesión"],
        ["savior", "Salvador"],
        ["guarded trust", "Confianza cautelosa"],
        ["mirror", "Espejo"],
        ["destabilizing presence", "Presencia desestabilizadora"],
        ["broken bond", "Vínculo roto"],
        ["corruptor", "Corruptor"],
        ["recognition", "Reconocimiento"],
        ["power struggle", "Lucha de poder"],
        ["useful instrument", "Instrumento útil"],
        ["mutual threat", "Amenaza mutua"],
        ["uneasy alliance", "Alianza tensa"],
        ["mutual distrust", "Desconfianza mutua"],
        ["distant sympathy", "Simpatía distante"],
        ["volatile study", "Estudio volátil"],
        ["historical interest", "Interés histórico"],
        ["arcane rivalry", "Rivalidad arcana"],
        ["former mentor", "Antiguo mentor"],
        ["cryptic guide", "Guía críptica"],
        ["fearful recognition", "Reconocimiento temeroso"],
        ["measured distance", "Distancia medida"],
        ["cold appraisal", "Evaluación fría"],
        ["distrust", "Desconfianza"],
        ["obsessed custodian", "Custodia obsesiva"],
        ["interference", "Interferencia"],
        ["contested ground", "Terreno disputado"],
        ["arcane respect", "Respeto arcano"],
        ["relic reverence", "Veneración por reliquias"],
        ["antagonist", "Antagonista"],
      ],
      ja: [
        ["mentor", "師"],
        ["mentee", "弟子"],
        ["wary respect", "警戒を伴う敬意"],
        ["wary", "警戒"],
        ["open hostility", "露骨な敵意"],
        ["antagonistic", "敵対"],
        ["catalyst", "触媒"],
        ["moral opposition", "道徳的対立"],
        ["uneasy curiosity", "不穏な好奇心"],
        ["target of obsession", "執着の対象"],
        ["savior", "救い手"],
        ["guarded trust", "慎重な信頼"],
        ["mirror", "鏡像"],
        ["destabilizing presence", "不安定化させる存在"],
        ["broken bond", "壊れた絆"],
        ["corruptor", "堕落の誘導者"],
        ["recognition", "認識"],
        ["power struggle", "権力闘争"],
        ["useful instrument", "有用な道具"],
        ["mutual threat", "相互の脅威"],
        ["uneasy alliance", "不穏な同盟"],
        ["mutual distrust", "相互不信"],
        ["distant sympathy", "遠い共感"],
        ["volatile study", "不安定な研究対象"],
        ["historical interest", "歴史的関心"],
        ["arcane rivalry", "神秘の競合"],
        ["former mentor", "かつての師"],
        ["cryptic guide", "謎めいた導き手"],
        ["fearful recognition", "恐れを伴う認識"],
        ["measured distance", "節度ある距離"],
        ["cold appraisal", "冷徹な評価"],
        ["distrust", "不信"],
        ["obsessed custodian", "執着する守護者"],
        ["interference", "干渉"],
        ["contested ground", "争奪領域"],
        ["arcane respect", "神秘への敬意"],
        ["relic reverence", "遺物への崇敬"],
        ["antagonist", "敵対者"],
      ],
    };

    const map = mapsByLang[lang as Exclude<Language, "en">];

    const found = map.find(([needle]) => normalized.includes(needle));
    return found ? found[1] : relationType;
  };

  const relationNodes = (character.relationships ?? []).map((relation, index) => {
    const standing = relation.standing ?? deriveStanding(relation.type);
    const localizedName = localizeRelationCharacterName(relation.characterName);

    return {
      id: `${relation.characterName}-${index}`,
      label: localizedName,
      standing,
      typeLabel: localizedRelationType(relation.type),
      description: relation.description,
    };
  });

  const renderBuildLinks = (
    title: string,
    entries?: Array<{ name: string; itemSlug: string }>,
  ) => {
    if (!entries || entries.length === 0) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-foreground font-semibold font-serif">{title}</p>
          <p className="text-sm text-foreground/70 font-serif italic">{copy.empty.noBuildEntries}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-foreground font-semibold font-serif">{title}</p>
        <div className="flex flex-wrap gap-2">
          {entries.map((entry) => (
            <Link key={`${title}-${entry.itemSlug}-${entry.name}`} href={`/items/${entry.itemSlug}?lang=${lang}`}>
              <Badge
                variant="outline"
                className="border-accent/40 text-foreground bg-black/35 font-serif hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {(() => {
                  const item = mockObjetos.find((obj) => obj.slug === entry.itemSlug);
                  if (!item) return entry.name;
                  return getItemContent(lang, item.id)?.name ?? item.name;
                })()}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black/95 to-black/90">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link href={`/characters?lang=${lang}`}>
          <Button
            variant="ghost"
            className="text-foreground hover:text-foreground hover:bg-accent/20 font-serif border border-accent/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {copy.backToCharacters}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Character Image/Model */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative lg:order-2"
          >
            {/* 2D/3D Toggle */}
            <div className="flex items-center justify-end space-x-3 mb-4">
              <Label htmlFor="char-view-mode" className="text-sm font-serif text-foreground/80 cursor-pointer">
                {copy.mode2d}
              </Label>
              <Switch
                id="char-view-mode"
                checked={is3DMode}
                onCheckedChange={setIs3DMode}
                className="data-[state=checked]:bg-accent"
              />
              <Label htmlFor="char-view-mode" className="text-sm font-serif text-foreground/80 cursor-pointer">
                {copy.mode3d}
              </Label>
            </div>

            {/* Image/Model Container */}
            <div className="relative h-[560px] md:h-[700px] lg:h-[820px] overflow-visible bg-gradient-to-b from-black/20 via-black/35 to-black/60 backdrop-blur-sm">
              {is3DMode ? (
                <ModelViewer3D
                  modelUrl={character.model3dUrl}
                  fallbackMessage={copy.modelFallback}
                  className="w-full h-full"
                />
              ) : (
                <>
                  <div className="absolute left-1/2 top-1/2 z-0 w-[340px] h-[560px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <CharacterGlow
                      characterSlug={personaje.slug}
                      colorGlow={characterGlowColor}
                      isActive={true}
                    />
                  </div>
                  
                  {/* Character PNG */}
                  <div className="relative z-10 w-full h-full overflow-visible">
                    <motion.div
                      className="relative w-full h-full overflow-visible"
                      animate={{
                        filter: personaje.slug === "ruth"
                          ? [
                              // Multi-color simultáneo: lavanda + rosa + cian
                              `drop-shadow(0 0 1px #D8BFD866) drop-shadow(0 0 2.5px #FFE4F144) drop-shadow(0 0 4px #E0F7FA33) drop-shadow(0 0 1.5px #F0E6FF44)`,
                              // Cambia énfasis: cian + violeta + rosa
                              `drop-shadow(0 0 1.5px #E0F7FA88) drop-shadow(0 0 3.5px #F5E6FF55) drop-shadow(0 0 5px #FFE4F133) drop-shadow(0 0 2.5px #B0E0E644)`,
                              // Cambia énfasis: rosa + lavanda + violeta
                              `drop-shadow(0 0 1px #FFE4F166) drop-shadow(0 0 2.5px #F0D9FF44) drop-shadow(0 0 4px #D8BFD833) drop-shadow(0 0 1.5px #FAF0FF44)`,
                              // Cambia énfasis: violeta + cian + lavanda
                              `drop-shadow(0 0 1.5px #F5E6FF88) drop-shadow(0 0 3.5px #B0E0E655) drop-shadow(0 0 5px #D8BFD833) drop-shadow(0 0 2.5px #E6E6FA44)`,
                              // Vuelve al inicio
                              `drop-shadow(0 0 1px #D8BFD866) drop-shadow(0 0 2.5px #FFE4F144) drop-shadow(0 0 4px #E0F7FA33) drop-shadow(0 0 1.5px #F0E6FF44)`,
                            ]
                          : [
                              `drop-shadow(0 0 0.5px ${characterGlowColor}41) drop-shadow(0 0 2px ${characterGlowColor}30) drop-shadow(0 0 4px ${characterGlowColor}20)`,
                              `drop-shadow(0 0 1.1px ${characterGlowColor}83) drop-shadow(0 0 4.4px ${characterGlowColor}5E) drop-shadow(0 0 8px ${characterGlowColor}38)`,
                              `drop-shadow(0 0 0.5px ${characterGlowColor}41) drop-shadow(0 0 2px ${characterGlowColor}30) drop-shadow(0 0 4px ${characterGlowColor}20)`,
                            ],
                      }}
                      transition={{
                        duration: (() => {
                          switch (personaje.slug) {
                            case "el-juez": return 1.8;
                            case "la-doncella": return 3.2;
                            case "el-escudero": return 2.4;
                            case "el-perro": return 2.8;
                            case "el-hechicero": return 2.2;
                            case "el-viejo-manto-blanco": return 3.5;
                            case "ruth": return 2.0;
                            default: return 2.5;
                          }
                        })(),
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Image
                        src={character.imagePngUrl || "/placeholder-character.png"}
                        alt={displayName}
                        width={1200}
                        height={1800}
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 h-[108%] w-auto max-w-none object-contain object-bottom drop-shadow-2xl relative z-10"
                      />
                    </motion.div>
                  </div>

                  {/* Ash Particles Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-30">
                      {ashParticleSeeds.map((seed, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            left: `${seed.left}%`,
                            top: `${seed.top}%`,
                            backgroundColor: characterGlowColor,
                          }}
                          animate={{
                            y: [0, -100],
                            opacity: [0.6, 0],
                          }}
                          transition={{
                            duration: seed.duration,
                            repeat: Infinity,
                            delay: seed.delay,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Character Stats */}
            {character.stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 rounded border border-accent/35 bg-black/50 px-4 py-4 space-y-3"
              >
                {statEntries.map((stat) => (
                  <div key={stat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-serif uppercase tracking-[0.2em]">
                      <span className="text-foreground/80">{stat.label}</span>
                      <span className="text-foreground font-semibold tracking-[0.08em]">
                        {typeof stat.value === "number" ? stat.value : "--"}
                      </span>
                    </div>
                    <div className="h-[3px] w-full bg-accent/20">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width:
                            typeof stat.value === "number"
                              ? `${Math.max(6, (stat.value / maxStatValue) * 100)}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Character Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:order-1"
          >
            {/* Title and Name */}
            <div>
              {character.title && (
                <p className="text-sm text-foreground/80 font-serif uppercase tracking-widest mb-2">
                  {localizedCharacter.title}
                </p>
              )}
              <h1 className="text-5xl md:text-6xl font-bold text-foreground font-serif mb-4">
                {displayName}
              </h1>
              <div className="flex flex-wrap gap-2">
                {character.class && (
                  <Badge variant="outline" className="border-accent/40 text-foreground bg-black/35 font-serif">
                    {localizedCharacter.class}
                  </Badge>
                )}
                {character.origin && (
                  <Badge variant="outline" className="border-accent/40 text-foreground bg-black/35 font-serif">
                    {localizedCharacter.origin}
                  </Badge>
                )}
                {character.status && (
                  <Badge
                    variant="outline"
                    className={`font-serif ${
                      character.status === "alive"
                        ? "border-green-400/50 text-green-300 bg-black/30"
                        : character.status === "deceased"
                        ? "border-red-400/50 text-red-300 bg-black/30"
                        : "border-accent/40 text-foreground bg-black/35"
                    }`}
                  >
                    {copy.status[character.status]}
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="bg-accent/35" />

            {/* Short Description */}
            {character.shortDescription && (
              <p className="text-lg text-foreground/80 font-serif leading-relaxed italic">
                {localizedCharacter.shortDescription}
              </p>
            )}

            {/* Tabs for detailed info */}
            <Tabs defaultValue="lore" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/55 border border-accent/35">
                <TabsTrigger value="lore" className="font-serif text-foreground/70 data-[state=active]:bg-accent/25 data-[state=active]:text-foreground">
                  {copy.tabs.lore}
                </TabsTrigger>
                <TabsTrigger value="build" className="font-serif text-foreground/70 data-[state=active]:bg-accent/25 data-[state=active]:text-foreground">
                  {copy.tabs.build}
                </TabsTrigger>
                <TabsTrigger value="relations" className="font-serif text-foreground/70 data-[state=active]:bg-accent/25 data-[state=active]:text-foreground">
                  {copy.tabs.relations}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lore" className="mt-6">
                <div className="bg-black/50 backdrop-blur-sm border border-accent/35 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground font-serif mb-4">{copy.sections.chronicle}</h3>
                  <div className="prose prose-invert prose-stone max-w-none">
                    {isMaidenChronicleCards ? (
                      <div className="space-y-6">
                        {chronicleSections.map((section, index) => (
                          <div
                            key={`${section.title}-${index}`}
                            className={`flex ${index % 2 === 0 ? "justify-start md:pr-16 lg:pr-24" : "justify-end md:pl-16 lg:pl-24"}`}
                          >
                            <div className="w-full md:w-[80%] border border-accent/55 bg-gradient-to-b from-accent/70 via-transparent to-black/85 backdrop-blur-sm rounded-none overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
                              <div className="p-4 text-left">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-accent/95 font-semibold">
                                  {sealedLetterLabel}
                                </p>
                                <p className="text-base sm:text-lg text-foreground font-serif tracking-[0.02em] font-semibold mt-1">
                                  {section.title}
                                </p>
                                {section.metaLines.length > 0 && (
                                  <div className="mt-1 text-[11px] font-serif text-foreground/95 tracking-[0.03em]">
                                    {section.metaLines.map((metaLine, metaIndex) => (
                                      <span
                                        key={`${section.title}-meta-${metaIndex}`}
                                        className="inline-block mr-3"
                                      >
                                        {metaLine}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {(() => {
                                const isCardExpanded = Boolean(expandedChronicleCards[index]);
                                const cardLineCount = section.content.split("\n").length;
                                const isCardLong = section.content.length > 420 || cardLineCount > 10;

                                return (
                                  <div className="p-4 pt-1">
                                    <div
                                      className={`relative transition-all duration-300 ${
                                        isCardLong && !isCardExpanded ? "max-h-[200px] overflow-hidden" : ""
                                      }`}
                                    >
                                      <p className="text-foreground font-serif leading-relaxed whitespace-pre-line pb-1">
                                        {section.content}
                                      </p>
                                      {isCardLong && !isCardExpanded && (
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />
                                      )}
                                    </div>

                                    {isCardLong && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                          setExpandedChronicleCards((previous) => ({
                                            ...previous,
                                            [index]: !Boolean(previous[index]),
                                          }))
                                        }
                                        className="mt-4 rounded-none border-accent/70 bg-accent/55 text-black hover:bg-accent/75 hover:text-black font-serif font-semibold uppercase tracking-[0.14em] px-5 py-2 h-auto skew-x-[-14deg] transition-all duration-200"
                                      >
                                        <span className="inline-block skew-x-[14deg] text-[11px] sm:text-xs">
                                          {isCardExpanded ? copy.actions.readLess : copy.actions.readMore}
                                        </span>
                                      </Button>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div
                          className={`relative transition-all duration-300 ${
                            loreIsLong && !isLoreExpanded ? "max-h-[360px] overflow-hidden" : ""
                          }`}
                        >
                          <p className="text-foreground/80 font-serif leading-relaxed whitespace-pre-line">
                            {loreText}
                          </p>
                          {loreIsLong && !isLoreExpanded && (
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />
                          )}
                        </div>
                        {loreIsLong && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsLoreExpanded((prev) => !prev)}
                            className="mt-4 rounded-none border-accent/55 bg-black/65 text-foreground hover:bg-accent/20 hover:text-foreground font-serif uppercase tracking-[0.14em] px-5 py-2 h-auto skew-x-[-14deg] transition-all duration-200"
                          >
                            <span className="inline-block skew-x-[14deg] text-[11px] sm:text-xs">
                              {isLoreExpanded ? copy.actions.readLess : copy.actions.readMore}
                            </span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <Separator className="bg-accent/30 my-6" />

                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-foreground font-serif">{dialogueTitle}</h4>
                    <p className="text-sm text-foreground/70 font-serif">{dialogueHint}</p>

                    {character.dialogueAudios && character.dialogueAudios.length > 0 ? (
                      <div className="space-y-3">
                        {character.dialogueAudios.map((audio, index) => (
                          <div
                            key={`${audio.title}-${index}`}
                            className="border border-accent/25 bg-black/35 rounded px-3 py-3"
                          >
                            <p className="text-sm text-foreground font-serif mb-2">{audio.title}</p>
                            {audio.description && (
                              <p className="text-xs text-foreground/70 font-serif mb-2">{audio.description}</p>
                            )}
                            <audio controls preload="none" className="w-full">
                              <source src={audio.src} />
                            </audio>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-accent/30 bg-black/30 rounded px-3 py-4">
                        <p className="text-sm text-foreground/65 font-serif italic">{dialogueEmptyLabel}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="build" className="mt-6">
                <div className="bg-black/50 backdrop-blur-sm border border-accent/35 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground font-serif mb-4">{copy.sections.buildLoadout}</h3>
                  {character.build ? (
                    <div className="space-y-5">
                      <div className="space-y-2 border-l-2 border-accent/40 pl-4">
                        {character.build.archetype && (
                          <p className="text-sm text-foreground/80 font-serif">
                            <span className="text-foreground font-semibold">{copy.labels.archetype}:</span> {localizedCharacter.build.archetype}
                          </p>
                        )}
                        {character.build.weaponClass && (
                          <p className="text-sm text-foreground/80 font-serif">
                            <span className="text-foreground font-semibold">{copy.labels.weaponStyle}:</span> {localizedCharacter.build.weaponClass}
                          </p>
                        )}
                        {character.build.damageFocus && (
                          <p className="text-sm text-foreground/80 font-serif">
                            <span className="text-foreground font-semibold">{copy.labels.focus}:</span> {localizedCharacter.build.damageFocus}
                          </p>
                        )}
                      </div>

                      {renderBuildLinks(copy.labels.itemsEquipped, character.build.carriedItems)}
                      {renderBuildLinks(copy.labels.spells, character.build.spells)}
                      {renderBuildLinks(copy.labels.enchantments, character.build.enchantments)}
                    </div>
                  ) : (
                    <p className="text-foreground/70 font-serif italic">
                      {copy.empty.noBuild}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="relations" className="mt-6">
                <div className="bg-black/50 backdrop-blur-sm border border-accent/35 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground font-serif mb-4">{copy.sections.relationships}</h3>
                  {relationNodes.length > 0 ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm text-foreground/85 font-serif mb-3">{copy.sections.relationMap}</p>
                        <RelationsNodeMap
                          centerLabel={displayName}
                          nodes={relationNodes.map((node) => ({
                            id: node.id,
                            label: node.label,
                            standing: node.standing,
                          }))}
                          standingLabels={standingLabel}
                        />
                      </div>

                      <div>
                        <p className="text-sm text-foreground/85 font-serif mb-2">{copy.sections.reputation}</p>
                        <div className="space-y-2">
                          {relationNodes.map((relation) => (
                            <div
                              key={`rep-${relation.id}`}
                              className="flex flex-wrap items-center justify-between gap-2 border border-accent/25 bg-black/35 rounded px-3 py-2"
                            >
                              <div>
                                <p className="text-sm text-foreground font-serif">{relation.label}</p>
                                <p className="text-xs text-foreground/70 font-serif">
                                  {copy.labels.relationType}: {relation.typeLabel}
                                </p>
                              </div>
                              <Badge variant="outline" className="border-accent/40 text-foreground bg-black/35 font-serif">
                                {copy.labels.standing}: {standingLabel[relation.standing]}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/70 font-serif italic">
                      {copy.empty.noRelationsMap}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Art Gallery */}
      {character.artGallery && character.artGallery.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-accent font-serif mb-8 text-center">
              {copy.sections.conceptArtGallery}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {character.artGallery.map((art, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative aspect-video rounded-lg overflow-hidden border-2 border-accent/30 group cursor-pointer"
                >
                  <Image
                    src={art}
                    alt={`${character.name} concept art ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
