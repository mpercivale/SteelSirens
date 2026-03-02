import type { Beast, Item, Objeto } from "@/types/game";

export const DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY = "steel_sirens_discovered_character_slugs";
export const DISCOVERED_ITEM_SLUGS_STORAGE_KEY = "steel_sirens_discovered_item_slugs";
export const LOCATION_SECRET_PROGRESS_STORAGE_KEY = "steel_sirens_location_secret_progress";
export const GAME_FLAGS_STORAGE_KEY = "steel_sirens_game_flags";

export type GameFlag = "unlock_monastery_secret" | "unlock_sewers" | "unlock_depths";

type GameFlagsState = Partial<Record<GameFlag, boolean>>;

const defaultUnlockByRace: Record<string, string[]> = {
  humanoid: ["el-juez"],
  demihuman: ["el-perro"],
  demon: ["el-hechicero"],
  vampire: ["la-doncella"],
  undead: ["el-juez"],
  beast: ["el-perro"],
  dragon: ["el-viejo-manto-blanco"],
  aberration: ["ruth"],
  elemental: ["el-hechicero"],
};

export function getDiscoveredCharacterSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function markCharacterDiscovered(slug?: string | null): string[] {
  if (!slug || typeof window === "undefined") {
    return getDiscoveredCharacterSlugs();
  }

  const current = new Set(getDiscoveredCharacterSlugs());
  current.add(slug);
  const updated = Array.from(current);
  window.localStorage.setItem(DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

type ItemDiscoveryShape = Pick<Item, "slug" | "categoryId" | "subcategoryId" | "rarity"> &
  Partial<Pick<Objeto, "categoria_id" | "subcategoria_id" | "rareza">>;

export function getDiscoveredItemSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DISCOVERED_ITEM_SLUGS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function markItemDiscovered(slug?: string | null): string[] {
  if (!slug || typeof window === "undefined") {
    return getDiscoveredItemSlugs();
  }

  const current = new Set(getDiscoveredItemSlugs());
  current.add(slug);
  const updated = Array.from(current);
  window.localStorage.setItem(DISCOVERED_ITEM_SLUGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isItemHiddenUntilDiscovered(item: ItemDiscoveryShape): boolean {
  const categoryId = item.categoryId ?? item.categoria_id ?? "";
  const subcategoryId = item.subcategoryId ?? item.subcategoria_id ?? "";
  const rarity = (item.rarity ?? item.rareza ?? "").toLowerCase();

  if (categoryId === "key_items") {
    return true;
  }

  if (subcategoryId === "quest_relics" || subcategoryId === "runes") {
    return true;
  }

  return rarity === "epic" || rarity === "legendary";
}

export function isItemDiscoveredForList(item: ItemDiscoveryShape, discoveredItemSlugs: string[]): boolean {
  if (!isItemHiddenUntilDiscovered(item)) {
    return true;
  }

  if (!item.slug) {
    return false;
  }

  return new Set(discoveredItemSlugs).has(item.slug);
}

type LocationSecretProgress = Record<string, number>;

export function getLocationSecretProgress(): LocationSecretProgress {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LOCATION_SECRET_PROGRESS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed as Record<string, unknown>).reduce<LocationSecretProgress>((acc, [key, value]) => {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        acc[key] = Math.floor(value);
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export function getLocationFoundSecrets(locationKey?: string | null): number {
  if (!locationKey) {
    return 0;
  }

  const progress = getLocationSecretProgress();
  return progress[locationKey] ?? 0;
}

export function markLocationSecretFound(locationKey?: string | null): number {
  if (!locationKey || typeof window === "undefined") {
    return 0;
  }

  const progress = getLocationSecretProgress();
  const nextValue = (progress[locationKey] ?? 0) + 1;
  const updated: LocationSecretProgress = {
    ...progress,
    [locationKey]: nextValue,
  };

  window.localStorage.setItem(LOCATION_SECRET_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
  return nextValue;
}

export function getGameFlags(): GameFlagsState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(GAME_FLAGS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : {};

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed as Record<string, unknown>).reduce<GameFlagsState>((acc, [key, value]) => {
      if (typeof value === "boolean") {
        acc[key as GameFlag] = value;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export function isGameFlagEnabled(flag: GameFlag): boolean {
  const flags = getGameFlags();
  return Boolean(flags[flag]);
}

export function setGameFlag(flag: GameFlag, enabled = true): GameFlagsState {
  if (typeof window === "undefined") {
    return {};
  }

  const current = getGameFlags();
  const next: GameFlagsState = {
    ...current,
    [flag]: enabled,
  };

  window.localStorage.setItem(GAME_FLAGS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getBeastUnlockRequirements(beast: Beast): string[] {
  if (beast.unlockByCharacterSlugs && beast.unlockByCharacterSlugs.length > 0) {
    return beast.unlockByCharacterSlugs;
  }

  return defaultUnlockByRace[beast.race] ?? [];
}

export function isBeastUnlocked(beast: Beast, discoveredCharacterSlugs: string[]): boolean {
  const required = getBeastUnlockRequirements(beast);
  if (required.length === 0) {
    return true;
  }

  const discovered = new Set(discoveredCharacterSlugs);
  return required.every((slug) => discovered.has(slug));
}
