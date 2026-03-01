export interface Character {
  id: string;
  name: string;
  title?: string;
  slug: string;
  lore?: {
    es?: string;
    en?: string;
    jp?: string;
  };
  shortDescription?: string;
  imagePngUrl?: string;
  imageArtUrl?: string;
  model3dUrl?: string;
  class?: string;
  origin?: string;
  status?: "alive" | "deceased" | "unknown";
  isProtagonist?: boolean;
  circleOrder?: number;
  active?: boolean;
  colorGlow?: string;
  quotes?: string[];
  dialogueAudios?: Array<{
    title: string;
    src: string;
    description?: string;
  }>;
  stats?: {
    vigor?: number;
    mind?: number;
    endurance?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    faith?: number;
    arcane?: number;
    defense?: number;
    vitality?: number;
    magic?: number;
  };
  build?: {
    archetype?: string;
    weaponClass?: string;
    damageFocus?: string;
    recommendedWeapons?: string[];
    carriedItems?: Array<{
      name: string;
      itemSlug: string;
    }>;
    spells?: Array<{
      name: string;
      itemSlug: string;
    }>;
    enchantments?: Array<{
      name: string;
      itemSlug: string;
    }>;
  };
  abilities?: Array<{
    name: string;
    description: string;
  }>;
  relationships?: Array<{
    characterName: string;
    type: string;
    description?: string;
    standing?: "hostile" | "neutral" | "friendly" | "honored" | "revered" | "exalted";
    targetKind?: "character" | "faction" | "group";
  }>;
  artGallery?: string[];
  // Removed chronicles property as lore already supports translations.
}

// Spanish alias for Character
export type Personaje = Character & {
  nombre?: string;
  titulo?: string;
  imagen_png_url?: string;
  clase?: string;
  descripcion_corta?: string;
  es_protagonista?: boolean;
  color_glow?: string;
  audios_dialogo?: Array<{
    title: string;
    src: string;
    description?: string;
  }>;
};

export interface Item {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string;
  lorDescription?: string;
  shortDescription?: string;
  imageUrl?: string;
  model3dUrl?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  howToObtain?: string;
  stats?: Record<string, unknown>;
  associatedCharacterId?: string;
  active?: boolean;
}

// Spanish alias for Item
export type Objeto = Item & {
  nombre?: string;
  categoria_id?: string;
  subcategoria_id?: string;
  descripcion_lore?: string;
  descripcion_corta?: string;
  imagen_url?: string;
  rareza?: string;
  como_obtener?: string;
};

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: "region" | "dungeon" | "secret";
  loreDescription?: string;
  shortDescription?: string;
  imageUrl?: string;
  mapImageUrl?: string;
  parentRegionId?: string;
  dangerLevel?: "low" | "medium" | "high" | "extreme";
  discovered?: boolean;
  active?: boolean;
}

// Spanish alias for Location
export type Locacion = Location & {
  nombre?: string;
  tipo?: string;
  descripcion_lore?: string;
  descripcion_corta?: string;
  imagen_url?: string;
  peligrosidad?: string;
  descubierto?: boolean;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: "item" | "location";
  parentCategoryId?: string;
  description?: string;
  icon?: string;
  order?: number;
}

// Spanish alias for Category
export type Categoria = Category & {
  nombre?: string;
  categoria_padre_id?: string;
};

export interface Update {
  id: string;
  title: string;
  slug: string;
  type: "character" | "item" | "location" | "lore" | "announcement";
  shortDescription?: string;
  content?: string;
  imageUrl?: string;
  referenceId?: string;
  referenceType?: string;
  isFeatured?: boolean;
  published?: boolean;
  publishDate?: string;
}

// Spanish alias for Update
export type Actualizacion = Update & {
  titulo?: string;
  tipo?: string;
  descripcion_corta?: string;
  imagen_url?: string;
  contenido?: string;
  es_destacado?: boolean;
  fecha_publicacion?: string;
};

// Beast type now uses race/type instead of rarity-based categories
export type BeastDrop = {
  itemName: string;
  rarity: string;
  dropRate: string;
};

export type BeastStatBlock = {
  health?: number;
  attack?: number;
  defense?: number;
  speed?: number;
};

export type BeastAbility = {
  name: string;
  description: string;
};

export interface BeastVariant {
  id?: string;
  slug: string;
  name: string;
  name_es?: string;
  name_ja?: string;
  shortDescription?: string;
  shortDescription_es?: string;
  shortDescription_ja?: string;
  loreDescription?: string;
  loreDescription_es?: string;
  loreDescription_ja?: string;
  subtype?: string;
  subtype_es?: string;
  subtype_ja?: string;
  iconUrl?: string;
  imageUrl?: string;
  model3dUrl?: string;
  has3dModel?: boolean;
  dangerLevel?: "low" | "medium" | "high" | "extreme";
  habitat?: string;
  habitat_es?: string;
  habitat_ja?: string;
  habitatImages?: string[];
  weaknesses?: string[];
  resistances?: string[];
  drops?: BeastDrop[];
  stats?: BeastStatBlock;
  abilities?: BeastAbility[];
}

export interface Beast {
  id: string;
  name: string;
  slug: string;
  race: "humanoid" | "demihuman" | "demon" | "vampire" | "undead" | "beast" | "dragon" | "aberration" | "elemental";
  unlockByCharacterSlugs?: string[];
  subtype?: string;
  loreDescription?: string;
  shortDescription?: string;
  // Translations
  name_es?: string;
  name_ja?: string;
  shortDescription_es?: string;
  shortDescription_ja?: string;
  loreDescription_es?: string;
  loreDescription_ja?: string;
  subtype_es?: string;
  subtype_ja?: string;
  habitat_es?: string;
  habitat_ja?: string;
  iconUrl?: string;
  imageUrl?: string;
  model3dUrl?: string;
  has3dModel?: boolean;
  dangerLevel?: "low" | "medium" | "high" | "extreme";
  habitat?: string;
  habitatImages?: string[];
  weaknesses?: string[];
  resistances?: string[];
  drops?: BeastDrop[];
  stats?: BeastStatBlock;
  abilities?: BeastAbility[];
  variants?: BeastVariant[];
  isBoss?: boolean;
  active?: boolean;
}
