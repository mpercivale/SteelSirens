import type { Beast } from "@/types/game";

export const DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY = "steel_sirens_discovered_character_slugs";

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
