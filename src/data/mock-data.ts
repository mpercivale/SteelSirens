
import { Character, Item, Location, Category, Update, Beast, Personaje, Objeto, Locacion, Categoria, Actualizacion } from "@/types/game";

export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "El Perro",
    title: "The Street Bandit",
    slug: "el-perro",
    lore: `**Role:**
- Street bandit, pragmatic, cunning, petty.
- Represents **common humanity**, with vices and glimpses of virtue.

**Motivation / Objectives:**
- Reach the tower in search of **riches and personal gain**.
- Fulfill a **promise to a dead friend**, which binds him to the journey and the care of the boy.

**Transformation Arc:**
- Beginning: selfish opportunist.
- During the journey: bond with the boy awakens protective affection and confronts his past.
- End: remains vulgar and petty, but capable of acting for someone other than himself.

**Relationships:**
- **El Escudero:** growing affection, improvised mentor.
- **La Doncella:** sees her as a risk.
- **El Juez:** tension and jabs; protects the boy from corruption.
- **El Hechicero:** distrust and curiosity; considers him unpredictable and a risk to survival.

**Notes:**
- "Perro" reflects vulgarity, pettiness and street survival.
- Cunning, drunk, selfish, but with moments of care towards the boy.`,
    shortDescription: "A street-smart bandit with a hidden heart, bound by a promise to protect the boy",
    imagePngUrl: "https://cdn.chat2db-ai.com/app/avatar/custom/e75a0ce4-86ac-423d-bd44-6f29eb04b419_755151.png",
    class: "Bandit",
    origin: "The Streets",
    status: "alive",
    isProtagonist: true,
    circleOrder: 0,
    colorGlow: "#8B4513",
    quotes: [
      "Keep your coin close and your blade closer.",
      "I've seen worse... barely.",
      "The boy's got more guts than sense.",
      "Trust? That's a luxury for the dead.",
      "One more job, they always say...",
      "I didn't promise to be a saint.",
    ],
    stats: {
      vigor: 45,
      mind: 18,
      endurance: 35,
      strength: 38,
      dexterity: 50,
      intelligence: 12,
      faith: 14,
      arcane: 30,
      defense: 35,
      vitality: 45,
      magic: 12,
    },
    build: {
      archetype: "Dex/Arcane Opportunist",
      weaponClass: "Curved Sword + Dagger",
      damageFocus: "Bleed pressure and fast punish",
      recommendedWeapons: ["Bandit's Curved Sword", "Reduvia", "Scavenger's Curved Sword"],
      carriedItems: [
        { name: "Blade of the Fallen", itemSlug: "blade-fallen" },
        { name: "Ashbound Gauntlets", itemSlug: "ashbound-gauntlets" },
        { name: "Cinder Bomb", itemSlug: "cinder-bomb" },
      ],
      spells: [{ name: "Rune Fragment Reading", itemSlug: "tablet-of-runes" }],
      enchantments: [{ name: "Nocturne Edge Coating", itemSlug: "nocturne-resin" }],
    },
    abilities: [
      {
        name: "Street Cunning",
        description: "Uses dirty tricks and improvised tactics to gain advantage in combat",
      },
      {
        name: "Protective Instinct",
        description: "Increases defense when protecting allies, especially the boy",
      },
    ],
    relationships: [
      {
        characterName: "El Escudero",
        type: "Mentor",
        description: "Growing affection, improvised mentor figure",
        standing: "honored",
        targetKind: "character",
      },
      {
        characterName: "La Doncella",
        type: "Wary",
        description: "Sees her as a risk to the group",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Juez",
        type: "Antagonistic",
        description: "Constant tension; protects the boy from his corruption",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Mutual Distrust",
        description: "Considers him useful but unpredictable and dangerous",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Wary Respect",
        description: "Knows his reputation and keeps a cautious distance",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Open Hostility",
        description: "Sees her as a direct threat to the group and the boy",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "2",
    name: "El Escudero",
    title: "The Pure Heart",
    slug: "el-escudero",
    lore: `**Role:**
- Central protagonist, medieval peasant boy.
- Represents **purity, hope and moral growth** in a hostile world.

**Motivation / Objectives:**
- Fulfill his father's promise: be an upright man and maintain values.
- Survive the journey and learn from the adult world.
- Help La Doncella and keep the group emotionally united.

**Transformation Arc:**
- Beginning: naive, fair, without strength or experience.
- During the journey: exposed to horrors and human contradictions, learns to deal with ambiguity.
- End: young man capable of difficult decisions, maintaining his humanity despite the influences of the Judge and La Doncella's trauma.

**Relationships:**
- **El Perro:** mentor and affective figure, learning cunning and pragmatism.
- **La Doncella:** catalyst for human recovery.
- **El Juez:** source of moral conflict; tests his ethics and values.
- **Group:** moral and emotional center; his innocence contrasts with the horrors and corruptions around.

**Notes:**
- Peasant boy, clear eyes, expressive.
- Innocence and curiosity facing a dark world.
- Small actions reveal his ethics: selfless help, silent courage, affection towards La Doncella.`,
    shortDescription: "An innocent peasant boy who becomes the moral compass of a corrupted world",
    imagePngUrl: "https://cdn.chat2db-ai.com/app/avatar/custom/474801d3-27b5-4d9e-a6ce-ec7ce85c8e93_755151.png",
    class: "Squire",
    origin: "Rural Village",
    status: "alive",
    isProtagonist: true,
    circleOrder: 1,
    colorGlow: "#4CAF50",
    quotes: [
      "Father said to always do what's right...",
      "There must be good in everyone, right?",
      "I won't let fear decide for me.",
      "Maybe we can help them.",
      "I promised I'd be brave.",
      "Is this what courage feels like?",
    ],
    stats: {
      vigor: 40,
      mind: 22,
      endurance: 34,
      strength: 32,
      dexterity: 30,
      intelligence: 18,
      faith: 36,
      arcane: 16,
      defense: 34,
      vitality: 40,
      magic: 18,
    },
    build: {
      archetype: "Quality/Faith Vanguard",
      weaponClass: "Straight Sword + Medium Shield",
      damageFocus: "Guard counters and sustained frontline",
      recommendedWeapons: ["Lordsworn's Straight Sword", "Brass Shield", "Golden Halberd"],
      carriedItems: [
        { name: "Ember Pike", itemSlug: "ember-pike" },
        { name: "Iron Vigil Helm", itemSlug: "iron-vigil-helm" },
        { name: "Crimson Elixir", itemSlug: "crimson-elixir" },
      ],
      spells: [{ name: "Vow Sigil Prayer", itemSlug: "relic-of-the-vow" }],
      enchantments: [{ name: "Minor Shadow Resin", itemSlug: "nocturne-resin" }],
    },
    abilities: [
      {
        name: "Pure Heart",
        description: "His innocence provides hope and moral clarity to allies",
      },
      {
        name: "Unwavering Courage",
        description: "Despite fear, stands firm when protecting others",
      },
    ],
    relationships: [
      {
        characterName: "El Perro",
        type: "Mentee",
        description: "Learns pragmatism and street smarts from his protector",
        standing: "honored",
        targetKind: "character",
      },
      {
        characterName: "La Doncella",
        type: "Catalyst",
        description: "His presence helps her recover her humanity",
        standing: "revered",
        targetKind: "character",
      },
      {
        characterName: "El Juez",
        type: "Moral Opposition",
        description: "Resists his attempts at corruption",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Uneasy Curiosity",
        description: "Listens to his knowledge but distrusts his obsession",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Cryptic Guide",
        description: "Receives brief, enigmatic guidance from him",
        standing: "honored",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Target of Obsession",
        description: "Her plans for La Doncella put him in direct danger",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "3",
    name: "La Doncella",
    title: "The Hollow Princess",
    slug: "la-doncella",
    lore: `**Role:**
- Daughter of a wizard and princess, partially resurrected as a monster.
- Represents **corruption through trauma and the recovery of humanity**.

**Motivation / Objectives:**
- Survive, remain functional, **approach Ismael**, who helps her recover humanity.
- The tower represents **a threat and an inevitable destiny**, not her main objective.

**Transformation Arc:**
- Beginning: empty shell, erratic and animal-like.
- During the journey: recovers humanity thanks to the boy.
- End: more human, but with residual animal impulses.

**Relationships:**
- **El Escudero:** catalyst of humanity.
- **El Juez:** respect, tension; he perceives her as an equal monster.
- **El Perro:** initial distrust; calculable risk.
- **El Hechicero:** his presence and magic can destabilize her; minimal but disturbing interaction.

**Notes:**
- Silent, barely any facial gestures.
- Appearance: blonde, pearl eyes, insectoid body with blue beetle armor.`,
    shortDescription: "A resurrected princess trapped between monster and human, seeking redemption",
    imagePngUrl: "https://cdn.chat2db-ai.com/app/avatar/custom/530c7180-e4d2-4d9d-967a-927d8295a6cc_755151.png",
    class: "Corrupted Noble",
    origin: "Royal Bloodline",
    status: "unknown",
    isProtagonist: true,
    circleOrder: 2,
    colorGlow: "#FFB6C1",
    quotes: [
      "...Home...",
      "...Remember...",
      "...Warm...",
      "...Safe...?",
      "...Mother...",
      "...Light...",
    ],
    stats: {
      vigor: 55,
      mind: 30,
      endurance: 40,
      strength: 58,
      dexterity: 34,
      intelligence: 52,
      faith: 28,
      arcane: 46,
      defense: 40,
      vitality: 55,
      magic: 52,
    },
    build: {
      archetype: "Hybrid Predator",
      weaponClass: "Twinblade + Claw",
      damageFocus: "Burst staggers and arcane-infused pressure",
      recommendedWeapons: ["Godskin Peeler", "Hookclaws", "Eleonora's Poleblade"],
      carriedItems: [
        { name: "Blade of the Fallen", itemSlug: "blade-fallen" },
        { name: "Grave Greaves", itemSlug: "grave-greaves" },
        { name: "Crimson Elixir", itemSlug: "crimson-elixir" },
      ],
      spells: [{ name: "Eclipsed Pulse", itemSlug: "eclipsed-catalyst" }],
      enchantments: [{ name: "Nocturne Carapace Infusion", itemSlug: "nocturne-resin" }],
    },
    abilities: [
      {
        name: "Insectoid Fury",
        description: "Unleashes monstrous strength in moments of danger",
      },
      {
        name: "Recovering Humanity",
        description: "Gradually regains human emotions and control through the boy's influence",
      },
    ],
    relationships: [
      {
        characterName: "El Escudero",
        type: "Savior",
        description: "His presence is the key to her humanity",
        standing: "exalted",
        targetKind: "character",
      },
      {
        characterName: "El Perro",
        type: "Guarded Trust",
        description: "Initially distrustful, now sees him as rough protection",
        standing: "friendly",
        targetKind: "character",
      },
      {
        characterName: "El Juez",
        type: "Mirror",
        description: "He recognizes her as a fellow monster",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Destabilizing Presence",
        description: "His magic unsettles her fragile mental balance",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Fearful Recognition",
        description: "Senses ancient familiarity, but keeps distance",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Broken Bond",
        description: "Source of care and trauma she tries to escape from",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "4",
    name: "El Juez",
    title: "The Necessary Evil",
    slug: "el-juez",
    lore: `**Role:**
- Fanatic, charismatic, medieval psychopath inspired by Judge Holden.
- Represents the **necessary evil** and the moral corruption of the group.

**Motivation / Objectives:**
- Reach the tower to obtain the **power he assumes the tower will give him**, reinforcing his fanaticism and control.
- Corrupt the boy and maintain his influence over the group.

**Transformation Arc:**
- Beginning: fearsome authority, smiling and manipulative.
- During the journey: remains corrupt, but his evil keeps the group alive.
- End: reveals his monstrosity; becomes enraged if La Doncella recovers humanity.

**Relationships:**
- **El Escudero:** tries to corrupt him, test his ethics.
- **La Doncella:** silent respect; recognizes in her an equal monster.
- **El Perro:** constant tension; conflict of morality and control.
- **El Hechicero:** sees him as a useful resource, though doesn't fully trust; intellectual tension.

**Notes:**
- Acute psychopathy, manipulative, smiling.
- His aberrant acts sustain the group's survival.`,
    shortDescription: "A charismatic psychopath whose evil deeds paradoxically keep the group alive",
    imagePngUrl: "https://cdn.chat2db-ai.com/app/avatar/custom/11be65e4-96f4-4411-b52a-6ad20d42d9e1_755151.png",
    class: "Fanatic",
    origin: "Unknown",
    status: "alive",
    isProtagonist: true,
    circleOrder: 3,
    colorGlow: "#6B0000",
    quotes: [
      "War is the ultimate form of divination.",
      "Morality is the luxury of the weak.",
      "The boy will learn... or he will perish.",
      "There is no sin in survival, only necessity.",
      "I am the hand that shapes destiny.",
      "The tower calls to those who understand power.",
    ],
    stats: {
      vigor: 80,
      mind: 72,
      endurance: 78,
      strength: 82,
      dexterity: 80,
      intelligence: 76,
      faith: 74,
      arcane: 79,
      defense: 78,
      vitality: 80,
      magic: 76,
    },
    build: {
      archetype: "Omni Generalist (Overpowered)",
      weaponClass: "Colossal Sword + Seal + Staff",
      damageFocus: "Universal scaling and oppressive versatility",
      recommendedWeapons: ["Blasphemous Blade", "Dark Moon Greatsword", "Rivers of Blood"],
      carriedItems: [
        { name: "Blade of the Fallen", itemSlug: "blade-fallen" },
        { name: "Oathsplitter Axe", itemSlug: "oathsplitter-axe" },
        { name: "Knight's Ashen Cuirass", itemSlug: "knights-ashen-cuirass" },
      ],
      spells: [
        { name: "Eclipse Decree", itemSlug: "eclipsed-catalyst" },
        { name: "Runic Verdict", itemSlug: "tablet-of-runes" },
      ],
      enchantments: [
        { name: "Nocturne Weapon Blessing", itemSlug: "nocturne-resin" },
        { name: "Oathbound Conviction", itemSlug: "relic-of-the-vow" },
      ],
    },
    abilities: [
      {
        name: "Corrupting Influence",
        description: "Manipulates and tests the morality of those around him",
      },
      {
        name: "Necessary Evil",
        description: "His ruthless actions often ensure the group's survival",
      },
    ],
    relationships: [
      {
        characterName: "El Escudero",
        type: "Corruptor",
        description: "Attempts to break the boy's moral compass",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "La Doncella",
        type: "Recognition",
        description: "Sees her as a kindred monstrous spirit",
        standing: "honored",
        targetKind: "character",
      },
      {
        characterName: "El Perro",
        type: "Power Struggle",
        description: "Constant contest of control and influence over the group",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Useful Instrument",
        description: "Keeps him close as a resource, without full trust",
        standing: "friendly",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Former Mentor",
        description: "Still reveres him as an ideological predecessor",
        standing: "revered",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Mutual Threat",
        description: "Both seek control over La Doncella and the tower's power",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "5",
    name: "El Hechicero",
    title: "The Obsessed Scholar",
    slug: "el-hechicero",
    lore: `**Role:**
- Wizard from distant lands, obsessed with arcane knowledge.
- Represents **intellectual ambition and vulnerability to greater forces**.

**Motivation / Objectives:**
- Reach the tower to access the secret library and **discover forbidden knowledge**.
- Satisfy his ambition, even if the tower distorts him.

**Transformation Arc:**
- Beginning: calm, confident, obsessive.
- During the journey: exposure to the tower begins to distort his mind; paranoia and obsession grow.
- End: early victim of the tower's influence; his fall warns the group.

**Relationships:**
- **El Escudero:** distant, conceptual presence; admiration and partial learning.
- **El Perro:** mutual distrust; impractical but necessary.
- **La Doncella:** minimal interaction, may exacerbate her mental distortion.
- **El Juez:** cautious respect; calculated risk for the Judge's plans.

**Notes:**
- Appearance: Arabic robes, astronomical symbols, amulets.
- Personality: obsessive, meticulous, arrogant, vulnerable to the tower.
- Narrative function: introduces the surreal and distorting influence of the tower on the mind.`,
    shortDescription: "An obsessed mage whose quest for knowledge leads to his own corruption",
    imagePngUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=400&fit=crop",
    class: "Sorcerer",
    origin: "Distant Eastern Lands",
    status: "alive",
    isProtagonist: true,
    circleOrder: 4,
    colorGlow: "#E6D68A",
    quotes: [
      "The stars whisper secrets to those who listen.",
      "Knowledge is the only true immortality.",
      "The tower holds answers... I must know.",
      "Every spell has a price, every truth a cost.",
      "Do you hear it? The tower... it speaks...",
      "I am so close to understanding...",
    ],
    stats: {
      vigor: 28,
      mind: 65,
      endurance: 24,
      strength: 14,
      dexterity: 20,
      intelligence: 88,
      faith: 42,
      arcane: 36,
      defense: 24,
      vitality: 28,
      magic: 88,
    },
    build: {
      archetype: "Pure Sorcery Artillery",
      weaponClass: "Glintstone Staff + Sidearm",
      damageFocus: "Long-range spell burst",
      recommendedWeapons: ["Carian Regal Scepter", "Moonveil", "Wing of Astel"],
      carriedItems: [
        { name: "Eclipsed Catalyst", itemSlug: "eclipsed-catalyst" },
        { name: "Tablet of Runes", itemSlug: "tablet-of-runes" },
        { name: "Seal Key of the Tower", itemSlug: "seal-key-tower" },
      ],
      spells: [
        { name: "Eclipse Comet", itemSlug: "eclipsed-catalyst" },
        { name: "Dust Archive Glyph", itemSlug: "tablet-of-runes" },
      ],
      enchantments: [{ name: "Nocturne Arcane Coating", itemSlug: "nocturne-resin" }],
    },
    abilities: [
      {
        name: "Arcane Obsession",
        description: "Vast knowledge of forbidden magic and ancient texts",
      },
      {
        name: "Tower's Whisper",
        description: "Increasingly affected by the tower's corrupting influence",
      },
    ],
    relationships: [
      {
        characterName: "El Juez",
        type: "Uneasy Alliance",
        description: "Useful but unpredictable resource",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Perro",
        type: "Mutual Distrust",
        description: "Seen as impractical but necessary",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Escudero",
        type: "Distant Sympathy",
        description: "Recognizes his purity, but remains emotionally distant",
        standing: "friendly",
        targetKind: "character",
      },
      {
        characterName: "La Doncella",
        type: "Volatile Study",
        description: "Her condition fascinates and unsettles his research",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Historical Interest",
        description: "Respects his legacy but sees him as a fading relic",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Arcane Rivalry",
        description: "Competing magical visions and methods",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "6",
    name: "El Viejo del Manto Blanco",
    title: "The Baron of the Frontier",
    slug: "el-viejo-manto-blanco",
    lore: `**Background:**

**Role:**
- Formerly a politician and figure of power in the Holy See, ruthless and manipulative, feared by kingdoms and armies.
- Today, a senile old man dragging his white blanket.

Formerly known as the **Baron of the Frontier**, he was one of the most powerful men of his era, feared by neighboring peoples and grudgingly respected by the Holy See. He was **an inspiration for the Judge**, to whom he taught that power is measured not only in cunning but in the hardness of one's fist. His greatest feat was the **conquest and reconquest of Al'kabra**, where he annihilated entire villages, razed pagan temples and looted forbidden relics. One of them, a fragment of cloth torn from a sacrificial altar, became his mantle.

Today there remains only a weak old man, with his mind lost in blurred memories and the fixed obsession of returning to the **Well**. He escaped from the Holy See room where they kept him alive only out of pity.

**Appearance:**
- Bald with short cropped white hair.
- Veiled, opaque, moist eyes that seem not to focus at all.
- His skin is pale, almost translucent, marked by senile spots.
- Walks hunched over, dragging **the White Mantle**, too large for his skeletal body.
- When he stops, he looks like an upright corpse that refuses to fall.

**Motivation:**
- Reach the **Well**, the place that seems to claim him from antiquity, linked to the entity that partially possesses him.
- Does not seek power or active influence; his only goal is the Well.

**Appearance:**
- Appears sporadically throughout the journey, always in trouble or in unusual places.
- His encounters are brief, disconcerting and give hints of his glorious past, but also of his decadence.

**Relationships:**
- **El Juez:** Recognized the Old Man as mentor and inspiration; sees in him the echoes of his own philosophy, though also perceives his decadence.
- **El Perro and El Hechicero:** Know his reputation; the Sorcerer knows of his past campaigns and conquests, but is indifferent to him.
- **El Escudero:** The only one with whom he interacts more directly; guides, confuses or provokes reflections, but always briefly and ambiguously.
- **La Doncella:** Recognizes the presence of something strange in her—the entity or essence that inhabits her body—and reacts with fear or caution, avoiding direct contact; observes her sideways, keeping distance.`,
    shortDescription: "A once-powerful baron now reduced to a senile wanderer, haunted by his past",
    imagePngUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=400&fit=crop",
    class: "Fallen Noble",
    origin: "The Holy See",
    status: "alive",
    isProtagonist: true,
    circleOrder: 5,
    colorGlow: "#D3D3D3",
    quotes: [
      "The Well... it calls...",
      "I remember... conquest... glory...",
      "Al'kabra burned... as it should...",
      "Power is... was... mine...",
      "The mantle... it remembers...",
      "Where... where am I?",
    ],
    stats: {
      vigor: 26,
      mind: 48,
      endurance: 20,
      strength: 18,
      dexterity: 16,
      intelligence: 62,
      faith: 58,
      arcane: 64,
      defense: 20,
      vitality: 26,
      magic: 62,
    },
    build: {
      archetype: "Arcane/Faith Relic Keeper",
      weaponClass: "Spear + Sacred Catalyst",
      damageFocus: "Status buildup and ritual damage",
      recommendedWeapons: ["Cleanrot Spear", "Dragon Communion Seal", "Ripple Crescent Halberd"],
      carriedItems: [
        { name: "Penitent Mace", itemSlug: "penitent-mace" },
        { name: "Relic of the Vow", itemSlug: "relic-of-the-vow" },
        { name: "Grave Greaves", itemSlug: "grave-greaves" },
      ],
      spells: [{ name: "Ancestral Rune Murmur", itemSlug: "tablet-of-runes" }],
      enchantments: [{ name: "Wellbound Resin Rite", itemSlug: "nocturne-resin" }],
    },
    abilities: [
      {
        name: "Echoes of Power",
        description: "Occasional flashes of his former ruthless authority",
      },
      {
        name: "The Well's Call",
        description: "Drawn inexorably toward an ancient, mysterious destination",
      },
    ],
    relationships: [
      {
        characterName: "El Juez",
        type: "Former Mentor",
        description: "The Judge's philosophical inspiration, now decayed",
        standing: "revered",
        targetKind: "character",
      },
      {
        characterName: "El Escudero",
        type: "Cryptic Guide",
        description: "Offers brief, ambiguous guidance to the boy",
        standing: "honored",
        targetKind: "character",
      },
      {
        characterName: "La Doncella",
        type: "Fearful Recognition",
        description: "Senses the entity within her and keeps his distance",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Perro",
        type: "Measured Distance",
        description: "Observes his instincts and street caution with curiosity",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Cold Appraisal",
        description: "Recognizes his intellect but finds him spiritually hollow",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "La Custodia",
        type: "Distrust",
        description: "Perceives her obsession as dangerous and unstable",
        standing: "hostile",
        targetKind: "character",
      },
    ],
  },
  {
    id: "7",
    name: "La Custodia",
    title: "Warden of the Depths",
    slug: "ruth",
    lore: `**Alias / Titles:**
  - **La Figura Velada**: respectful/fearful title used by some servants and cults.
  - **Custodia de las Profundidades**: nickname whispered among the most superstitious of the staff.
  - **La Custodia**: name used by internal cults, referring to this figure's role as guardian of La Doncella and the tower's secrets.
- Her real name remains unknown to most.

**Role:**
  - Guardian of La Doncella and exceptional self-taught mage-alchemist.
- Central figure of the mansion, whose madness and obsession create a **microcosm within the tower**.
- Partially controls the servants and failed experiments, but power is **diffuse and fragmented**, generating internal conflicts and minor cults.

**Motivation / Objectives:**
- Completely revive La Doncella and restore her humanity.
  - Preserve the legacy and authority of the tower's original magister without revealing who stands behind the mantle.
- Maintain the mansion's structure as a reflection of her obsession and control over space and the horrors created.

**Transformation Arc:**
  1. **Beginning:** protective and determined, newly initiated in magic, learns quickly out of necessity.
  2. **Progression:** frustration from medical and magical failures, experimentation with dark magic, obsession with perfecting resurrection.
  3. **Intermediate madness:** adopts the former magister's symbols and protocol, mansion's microcosm slowly fragments, internal cults and factions emerge.
4. **Maximum rupture:** La Doncella escapes; the tower responds by completely deforming, the Hidden Mage's madness intensifies, loses contact with reality, becomes isolated and dangerous.

**Relationships:**
  - **La Doncella:** source of devotion, obsession and madness. The escape triggers a partial collapse of both the Custodia and the mansion.
  - **The Former Magister of the Tower:** source of authority, symbols and doctrine.
- **Servants and minions:** fear, some whisper and conspire, others form minor cults, others still hold respect and loyalty.

**Notes / Psychology:**
  - **Gradual and natural** madness, based on obsessive attachment and the belief that magic can fix everything.
  - The mansion/tower is a living reflection of this emotional state: starts coherent and functional, then fragments and becomes surreal as madness progresses.
  - The Custodia maintains some control, but the dispersion of servants and internal cults creates **dynamics of tension and conspiracy** within the tower.
- Personality: loving → obsessive → manipulative and calculating → isolated and deranged.

**Appearance:**
  - Initially austere, then adopts **the former magister's clothing and symbols** (robes, amulets, alchemical signs).
  - Intense gaze, mix of care and threat, reflecting obsession and instability.

**Narrative Function:**
- Catalyst of La Doncella's story and the tower's surrealist progression.
- Allows exploration of gradual madness, obsession and consequences of extreme love.
- Introduces microcosm of internal conflicts: cults, factions, ambivalent servants, which brings tension and exploration dynamics to the group.`,
    shortDescription: "A veiled guardian consumed by obsession, architect of the tower's madness",
    imagePngUrl: "https://cdn.chat2db-ai.com/app/avatar/custom/032f2f0e-548b-4969-9542-ecc6af107bb7_755151.png",
    class: "Archmage",
    origin: "The Tower",
    status: "alive",
    isProtagonist: false,
    circleOrder: 6,
    colorGlow: "#9370DB",
    quotes: [
      "The heir will rise again... no matter the cost.",
      "The tower bends to my will, as all things should.",
      "Love is the greatest magic of all.",
      "I will not fail this vow. Not again.",
      "The servants whisper... but they obey.",
      "That knowledge lives through this mantle now.",
    ],
    stats: {
      vigor: 42,
      mind: 78,
      endurance: 34,
      strength: 22,
      dexterity: 26,
      intelligence: 92,
      faith: 70,
      arcane: 68,
      defense: 34,
      vitality: 42,
      magic: 92,
    },
    build: {
      archetype: "Archmage Controller",
      weaponClass: "Staff + Sacred Seal",
      damageFocus: "Area denial, control, and high scaling spells",
      recommendedWeapons: ["Lusat's Glintstone Staff", "Prince of Death's Staff", "Sword of Night and Flame"],
      carriedItems: [
        { name: "Eclipsed Catalyst", itemSlug: "eclipsed-catalyst" },
        { name: "Seal Key of the Tower", itemSlug: "seal-key-tower" },
        { name: "Relic of the Vow", itemSlug: "relic-of-the-vow" },
      ],
      spells: [
        { name: "Depths Convergence", itemSlug: "eclipsed-catalyst" },
        { name: "Resurrection Formula", itemSlug: "tablet-of-runes" },
      ],
      enchantments: [
        { name: "Nocturne Sigil Imbuement", itemSlug: "nocturne-resin" },
        { name: "Vowbound Mantle Rite", itemSlug: "relic-of-the-vow" },
      ],
    },
    abilities: [
      {
        name: "Veiled Obsession",
        description: "An all-consuming bond fuels unnatural magical power",
      },
      {
        name: "Tower's Architect",
        description: "The mansion itself bends to this will and madness",
      },
      {
        name: "Alchemical Mastery",
        description: "Self-taught expertise in forbidden transmutation and resurrection",
      },
      {
        name: "Fragmented Authority",
        description: "Commands loyalty from some servants while others conspire in shadows",
      },
    ],
    relationships: [
      {
        characterName: "La Doncella",
        type: "Obsessed Custodian",
        description: "Source of devotion, madness, and desperate actions",
        standing: "exalted",
        targetKind: "character",
      },
      {
        characterName: "El Juez",
        type: "Antagonist",
        description: "Sees the group as threats to reclaiming La Doncella",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Escudero",
        type: "Interference",
        description: "His influence over La Doncella undermines her control",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Perro",
        type: "Contested Ground",
        description: "Considers him a violent obstacle to her plans",
        standing: "hostile",
        targetKind: "character",
      },
      {
        characterName: "El Hechicero",
        type: "Arcane Respect",
        description: "Acknowledges his knowledge, but distrusts his ambition",
        standing: "neutral",
        targetKind: "character",
      },
      {
        characterName: "El Viejo del Manto Blanco",
        type: "Relic Reverence",
        description: "Sees in him a fragment of the old tower's authority",
        standing: "honored",
        targetKind: "character",
      },
    ],
  },
];

// Spanish-compatible alias: maps English fields to Spanish field names
export const mockPersonajes: Personaje[] = mockCharacters.map((c) => ({
  ...c,
  nombre: c.name,
  titulo: c.title,
  imagen_png_url: c.imagePngUrl,
  clase: c.class,
  descripcion_corta: c.shortDescription,
  es_protagonista: c.isProtagonist,
  color_glow: c.colorGlow,
}));

export const mockItems: Item[] = [
  {
    id: "1",
    name: "Blade of the Fallen",
    slug: "blade-fallen",
    categoryId: "weapons",
    subcategoryId: "swords",
    lorDescription: "Forged from the souls of fallen warriors, this blade hungers for battle. Its edge never dulls, and it whispers dark promises to those who wield it.",
    shortDescription: "A cursed greatsword that feeds on the souls of the defeated",
    imageUrl: "https://images.unsplash.com/photo-1592840331788-a7c8a2e6e47c?w=400&h=400&fit=crop",
    rarity: "legendary",
    howToObtain: "Defeat the Lord of Cinders in the Kiln of the First Flame",
    stats: {
      damage: 250,
      weight: 12,
      durability: 100,
      scaling: "A (Strength)",
    },
  },
  {
    id: "2",
    name: "Oathsplitter Axe",
    slug: "oathsplitter-axe",
    categoryId: "weapons",
    subcategoryId: "axes",
    lorDescription: "A heavy executioner's axe once carried by frontier judges. Its edge is chipped by countless verdicts.",
    shortDescription: "A two-handed axe built for brutal finishing blows",
    imageUrl: "https://images.unsplash.com/photo-1517999349371-c43520457b23?w=400&h=400&fit=crop",
    rarity: "epic",
    howToObtain: "Found in the Chapel of Broken Oaths",
  },
  {
    id: "3",
    name: "Penitent Mace",
    slug: "penitent-mace",
    categoryId: "weapons",
    subcategoryId: "maces",
    lorDescription: "A ritual mace used in inquisitorial rites. Every dent carries a confession that was never written.",
    shortDescription: "A sanctified blunt weapon with crushing impact",
    imageUrl: "https://images.unsplash.com/photo-1608889175119-9d9f5a6c4292?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Dropped by Cathedral Wardens",
  },
  {
    id: "4",
    name: "Ember Pike",
    slug: "ember-pike",
    categoryId: "weapons",
    subcategoryId: "spears",
    lorDescription: "A long pike tipped with emberglass that flares in the presence of corrupted blood.",
    shortDescription: "A reach weapon favored by ashland sentries",
    imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Purchased from the Pilgrim Quartermaster",
  },
  {
    id: "5",
    name: "Eclipsed Catalyst",
    slug: "eclipsed-catalyst",
    categoryId: "weapons",
    subcategoryId: "staffs",
    lorDescription: "A branch of black silver attuned to lunar rites and forbidden invocations.",
    shortDescription: "A staff-catalyst that amplifies dark sorceries",
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=400&fit=crop",
    rarity: "epic",
    howToObtain: "Reward for completing the Eclipse Covenant",
  },
  {
    id: "6",
    name: "Iron Vigil Helm",
    slug: "iron-vigil-helm",
    categoryId: "armor",
    subcategoryId: "helms",
    lorDescription: "A closed helm worn by tower sentinels that watched in silence for decades.",
    shortDescription: "Balanced helm with high slash resistance",
    imageUrl: "https://images.unsplash.com/photo-1628015081020-435cd0fe4e72?w=400&h=400&fit=crop",
    rarity: "common",
    howToObtain: "Looted from Vigil Sentinels",
  },
  {
    id: "7",
    name: "Knight's Ashen Cuirass",
    slug: "knights-ashen-cuirass",
    categoryId: "armor",
    subcategoryId: "chest",
    lorDescription: "A breastplate darkened by soot that never washes away.",
    shortDescription: "Heavy chest armor with strong fire mitigation",
    imageUrl: "https://images.unsplash.com/photo-1590831759961-9f0f4f9f4b9e?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Found in the Barracks Reliquary",
  },
  {
    id: "8",
    name: "Ashbound Gauntlets",
    slug: "ashbound-gauntlets",
    categoryId: "armor",
    subcategoryId: "gauntlets",
    lorDescription: "Layered gauntlets engraved with binding seals.",
    shortDescription: "Reinforced gauntlets for close-quarters combat",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Crafted by the Ironbound Artisan",
  },
  {
    id: "9",
    name: "Grave Greaves",
    slug: "grave-greaves",
    categoryId: "armor",
    subcategoryId: "greaves",
    lorDescription: "Leg armor forged from reclaimed funerary steel.",
    shortDescription: "Sturdy leg protection with high poise",
    imageUrl: "https://images.unsplash.com/photo-1592878849122-5b4f6d53b2c4?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Dropped by Gravewatch Champions",
  },
  {
    id: "10",
    name: "Crimson Elixir",
    slug: "crimson-elixir",
    categoryId: "consumables",
    subcategoryId: "potions",
    lorDescription: "A mysterious red liquid that restores vitality. Its origins are unknown, but many believe it contains the essence of life itself.",
    shortDescription: "Restores a large amount of health",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Crafted by alchemists or found in hidden chests",
    stats: {
      healing: 500,
      duration: "Instant",
    },
  },
  {
    id: "11",
    name: "Cinder Bomb",
    slug: "cinder-bomb",
    categoryId: "consumables",
    subcategoryId: "bombs",
    lorDescription: "A clay shell packed with ember powder and cursed fragments.",
    shortDescription: "Explodes in a burst of ashfire",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=400&fit=crop",
    rarity: "common",
    howToObtain: "Crafted at any field workbench",
  },
  {
    id: "12",
    name: "Nocturne Resin",
    slug: "nocturne-resin",
    categoryId: "consumables",
    subcategoryId: "resins",
    lorDescription: "A viscous black resin used to coat weapons with void-touched energy.",
    shortDescription: "Temporarily buffs weapon damage with shadow",
    imageUrl: "https://images.unsplash.com/photo-1615486363873-7c1f6f7d98ae?w=400&h=400&fit=crop",
    rarity: "epic",
    howToObtain: "Reward from the Veiled Alchemist",
  },
  {
    id: "13",
    name: "Seal Key of the Tower",
    slug: "seal-key-tower",
    categoryId: "key_items",
    subcategoryId: "keys",
    lorDescription: "An archaic key engraved with seven lock sigils.",
    shortDescription: "Unlocks sealed gates in the upper tower",
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop",
    rarity: "legendary",
    howToObtain: "Given by the Custodian after the third covenant",
  },
  {
    id: "14",
    name: "Relic of the Vow",
    slug: "relic-of-the-vow",
    categoryId: "key_items",
    subcategoryId: "quest_relics",
    lorDescription: "A relic that resonates with oaths sworn in blood and ash.",
    shortDescription: "A quest artifact linked to the central covenant",
    imageUrl: "https://images.unsplash.com/photo-1628191082170-228d3f9f2bb1?w=400&h=400&fit=crop",
    rarity: "legendary",
    howToObtain: "Recovered from the Mirror Crypt",
  },
  {
    id: "15",
    name: "Tablet of Runes",
    slug: "tablet-of-runes",
    categoryId: "key_items",
    subcategoryId: "runes",
    lorDescription: "A fractured tablet etched with migration runes and warding circles.",
    shortDescription: "Contains decipherable runes needed for ancient seals",
    imageUrl: "https://images.unsplash.com/photo-1618856387104-9d8ad6bc36a1?w=400&h=400&fit=crop",
    rarity: "epic",
    howToObtain: "Found in the Archive of Dust",
  },
  {
    id: "16",
    name: "Tear of the Abyss",
    slug: "tear-abyss",
    categoryId: "materials",
    subcategoryId: "boss_materials",
    lorDescription: "A crystalline tear formed from the despair of the abyss itself. Its surface fractures with each heartbeat, as if the void itself weeps.",
    shortDescription: "A crystalline material containing the essence of the abyss",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    rarity: "epic",
    howToObtain: "Dropped by boss creatures from the depths",
    stats: {
      arcane: 50,
      weight: 2,
      durability: 50,
    },
  },
  {
    id: "17",
    name: "Remembrance of Radahn",
    slug: "remembrance-radahn",
    categoryId: "materials",
    subcategoryId: "boss_materials",
    lorDescription: "A remembrance of the starscourge himself. Within it dwells a fraction of his gravity-bending might, still struggling against the void.",
    shortDescription: "The soul essence of a defeated demigod warrior",
    imageUrl: "https://images.unsplash.com/photo-1577720643272-265b07f21a9b?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Dropped by demigod-class bosses",
    stats: {
      strength: 30,
      weight: 3,
      durability: 75,
    },
  },
  {
    id: "18",
    name: "Rune of the Depths",
    slug: "rune-depths",
    categoryId: "key_items",
    subcategoryId: "runes",
    lorDescription: "A rune inscribed with the geometry of the deep places. It hums with the cold resonance of stone and earth.",
    shortDescription: "An ancient rune pulled from the depths of the abyss",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    rarity: "rare",
    howToObtain: "Found in underground caverns and deep dungeons",
    stats: {
      weight: 1,
      durability: 100,
    },
  },
  {
    id: "19",
    name: "Golden Seed",
    slug: "golden-seed",
    categoryId: "materials",
    subcategoryId: "crafting",
    lorDescription: "A seed gilded by age and power. It grows nowhere, yet thrums with potential—as if waiting to bloom in some forgotten garden.",
    shortDescription: "A precious seed used in sacred crafting rituals",
    imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop",
    rarity: "uncommon",
    howToObtain: "Harvested from defeated creatures or found in treasure",
    stats: {
      weight: 1,
      durability: 50,
    },
  },
];

// Spanish-compatible alias
export const mockObjetos: Objeto[] = mockItems.map((item) => ({
  ...item,
  nombre: item.name,
  categoria_id: item.categoryId,
  subcategoria_id: item.subcategoryId,
  descripcion_lore: item.lorDescription,
  descripcion_corta: item.shortDescription,
  imagen_url: item.imageUrl,
  rareza: item.rarity,
  como_obtener: item.howToObtain,
}));

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "The Ashen Wastes",
    slug: "ashen-wastes",
    type: "region",
    loreDescription: "A desolate land covered in perpetual ash and darkness. Once a thriving kingdom, now only ruins and wandering souls remain. The air itself seems to drain the life from those who dare to traverse it.",
    shortDescription: "A cursed wasteland where kingdoms fell to ash",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
    dangerLevel: "high",
    discovered: true,
  },
  {
    id: "2",
    name: "Cathedral of the Deep",
    slug: "cathedral-deep",
    type: "dungeon",
    loreDescription: "An ancient cathedral that has been corrupted by dark forces. Its halls echo with the prayers of the damned, and unspeakable horrors lurk in its depths.",
    shortDescription: "A corrupted holy place filled with darkness",
    imageUrl: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800&h=600&fit=crop",
    dangerLevel: "extreme",
    discovered: true,
  },
];

// Spanish-compatible alias
export const mockLocaciones: Locacion[] = mockLocations.map((loc) => ({
  ...loc,
  nombre: loc.name,
  tipo: loc.type,
  descripcion_lore: loc.loreDescription,
  descripcion_corta: loc.shortDescription,
  imagen_url: loc.imageUrl,
  peligrosidad: loc.dangerLevel,
  descubierto: loc.discovered,
}));

export const mockCategories: Category[] = [
  {
    id: "weapons",
    name: "Weapons",
    slug: "weapons",
    type: "item",
    description: "Instruments of war and destruction",
    icon: "Sword",
    order: 0,
  },
  {
    id: "swords",
    name: "Swords",
    slug: "swords",
    type: "item",
    parentCategoryId: "weapons",
    order: 0,
  },
  {
    id: "axes",
    name: "Axes",
    slug: "axes",
    type: "item",
    parentCategoryId: "weapons",
    order: 1,
  },
  {
    id: "maces",
    name: "Maces",
    slug: "maces",
    type: "item",
    parentCategoryId: "weapons",
    order: 2,
  },
  {
    id: "spears",
    name: "Spears",
    slug: "spears",
    type: "item",
    parentCategoryId: "weapons",
    order: 3,
  },
  {
    id: "staffs",
    name: "Staffs & Catalysts",
    slug: "staffs-catalysts",
    type: "item",
    parentCategoryId: "weapons",
    order: 4,
  },
  {
    id: "armor",
    name: "Armor",
    slug: "armor",
    type: "item",
    description: "Protection against steel, ash, and curses",
    icon: "Shield",
    order: 1,
  },
  {
    id: "helms",
    name: "Helms",
    slug: "helms",
    type: "item",
    parentCategoryId: "armor",
    order: 0,
  },
  {
    id: "chest",
    name: "Chest Armor",
    slug: "chest-armor",
    type: "item",
    parentCategoryId: "armor",
    order: 1,
  },
  {
    id: "gauntlets",
    name: "Gauntlets",
    slug: "gauntlets",
    type: "item",
    parentCategoryId: "armor",
    order: 2,
  },
  {
    id: "greaves",
    name: "Greaves",
    slug: "greaves",
    type: "item",
    parentCategoryId: "armor",
    order: 3,
  },
  {
    id: "consumables",
    name: "Consumables",
    slug: "consumables",
    type: "item",
    description: "Items that can be used once",
    icon: "Flask",
    order: 2,
  },
  {
    id: "potions",
    name: "Potions",
    slug: "potions",
    type: "item",
    parentCategoryId: "consumables",
    order: 0,
  },
  {
    id: "bombs",
    name: "Bombs",
    slug: "bombs",
    type: "item",
    parentCategoryId: "consumables",
    order: 1,
  },
  {
    id: "resins",
    name: "Resins & Buffs",
    slug: "resins-buffs",
    type: "item",
    parentCategoryId: "consumables",
    order: 2,
  },
  {
    id: "key_items",
    name: "Key Items",
    slug: "key-items",
    type: "item",
    description: "Relics tied to progression and hidden truths",
    icon: "Key",
    order: 3,
  },
  {
    id: "keys",
    name: "Keys",
    slug: "keys",
    type: "item",
    parentCategoryId: "key_items",
    order: 0,
  },
  {
    id: "quest_relics",
    name: "Quest Relics",
    slug: "quest-relics",
    type: "item",
    parentCategoryId: "key_items",
    order: 1,
  },
  {
    id: "runes",
    name: "Runes & Seals",
    slug: "runes-seals",
    type: "item",
    parentCategoryId: "key_items",
    order: 2,
  },
];

// Spanish-compatible alias
export const mockCategorias: Categoria[] = mockCategories.map((cat) => ({
  ...cat,
  nombre: cat.name,
  categoria_padre_id: cat.parentCategoryId,
}));

export const mockUpdates: Update[] = [
  {
    id: "1",
    title: "The Ashen Knight Rises",
    slug: "ashen-knight-rises",
    type: "character",
    shortDescription: "Discover the tragic tale of Aldric, the fallen knight seeking redemption",
    content: "In the darkest corners of the Ashen Wastes, a lone figure emerges...",
    imageUrl: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=1200&h=600&fit=crop",
    referenceId: "1",
    referenceType: "character",
    isFeatured: true,
    published: true,
    publishDate: new Date().toISOString(),
  },
];

// Spanish-compatible alias
export const mockActualizaciones: Actualizacion[] = mockUpdates.map((u) => ({
  ...u,
  titulo: u.title,
  tipo: u.type,
  descripcion_corta: u.shortDescription,
  imagen_url: u.imageUrl,
  contenido: u.content,
  es_destacado: u.isFeatured,
  fecha_publicacion: u.publishDate,
}));

export const mockBeasts: Beast[] = [
  {
    id: "1",
    name: "Aguijones del Valle",
    slug: "aguijones-del-valle",
    race: "beast",
    subtype: "Plaga",
    shortDescription: "Bestias punzantes que acechan cultivos y caminos abiertos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Pradera",
    dangerLevel: "medium",
    drops: [
      { itemName: "Cinder Bomb", rarity: "common", dropRate: "60%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "40%" },
      { itemName: "Penitent Mace", rarity: "rare", dropRate: "15%" },
    ],
  },
  {
    id: "2",
    name: "Armaduras Reaimadas",
    slug: "armaduras-reaimadas",
    race: "undead",
    subtype: "Constructo maldito",
    shortDescription: "Corazas vacías animadas por juramentos no resueltos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mansión de los Auremont",
    dangerLevel: "high",
    drops: [
      { itemName: "Knight's Ashen Cuirass", rarity: "rare", dropRate: "25%" },
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "35%" },
      { itemName: "Seal Key of the Tower", rarity: "epic", dropRate: "10%" },
    ],
  },
  {
    id: "3",
    name: "Bestias de Laboratorio",
    slug: "bestias-de-laboratorio",
    race: "aberration",
    subtype: "Experimento",
    shortDescription: "Criaturas alteradas por procedimientos antinaturales.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mansión de los Auremont",
    dangerLevel: "high",
    drops: [
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "35%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "20%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "30%" },
    ],
  },
  {
    id: "4",
    name: "Brujas",
    slug: "brujas",
    race: "humanoid",
    subtype: "Conjuradora",
    shortDescription: "Oficiantes de ritos antiguos y magia hostil.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "high",
    drops: [
      { itemName: "Eclipsed Catalyst", rarity: "rare", dropRate: "25%" },
      { itemName: "Tablet of Runes", rarity: "epic", dropRate: "15%" },
      { itemName: "Nocturne Resin", rarity: "rare", dropRate: "40%" },
    ],
  },
  {
    id: "5",
    name: "Cabezas de Cosecha",
    slug: "cabezas-de-cosecha",
    race: "aberration",
    subtype: "Constructo rural",
    shortDescription: "Formas grotescas nacidas de campos arruinados.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Pradera",
    dangerLevel: "medium",
    drops: [
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "50%" },
      { itemName: "Seal Key of the Tower", rarity: "rare", dropRate: "20%" },
      { itemName: "Cinder Bomb", rarity: "uncommon", dropRate: "35%" },
    ],
  },
  {
    id: "6",
    name: "Carceleros Esqueléticos",
    slug: "carceleros-esqueleticos",
    race: "undead",
    subtype: "Guardia",
    shortDescription: "Vigías óseos que custodian celdas eternas.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "high",
    drops: [
      { itemName: "Iron Vigil Helm", rarity: "rare", dropRate: "30%" },
      { itemName: "Penitent Mace", rarity: "epic", dropRate: "18%" },
      { itemName: "Relic of the Vow", rarity: "rare", dropRate: "25%" },
    ],
  },
  {
    id: "7",
    name: "Carcoma",
    slug: "carcoma",
    race: "beast",
    subtype: "Parásito",
    shortDescription: "Plaga voraz que devora madera, carne y recuerdos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "low",
    drops: [
      { itemName: "Tear of the Abyss", rarity: "common", dropRate: "55%" },
      { itemName: "Cinder Bomb", rarity: "uncommon", dropRate: "30%" },
    ],
  },
  {
    id: "8",
    name: "Carroñeros de Hueso",
    slug: "carroneros-de-hueso",
    race: "undead",
    subtype: "Merodeador",
    shortDescription: "Recolectores de restos que rondan los abismos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "high",
    drops: [
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "32%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "28%" },
      { itemName: "Ashbound Gauntlets", rarity: "epic", dropRate: "12%" },
    ],
  },
  {
    id: "9",
    name: "Carroñeros gusanos",
    slug: "carroneros-gusanos",
    race: "beast",
    subtype: "Infestación",
    shortDescription: "Nidos ambulantes que consumen todo rastro orgánico.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "medium",
    drops: [
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "45%" },
      { itemName: "Nocturne Resin", rarity: "rare", dropRate: "22%" },
    ],
  },
  {
    id: "10",
    name: "Culto del Abismo",
    slug: "culto-del-abismo",
    race: "humanoid",
    subtype: "Secta",
    shortDescription: "Fanáticos que sirven a entidades del fondo sin nombre.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "22%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "28%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "45%" },
      { itemName: "Tablet of Runes", rarity: "legendary", dropRate: "8%" },
    ],
  },
  {
    id: "12",
    name: "Dragón Guardián de Entrada",
    slug: "dragon-guardian-de-entrada",
    race: "dragon",
    subtype: "Guardián",
    shortDescription: "Centinela dracónico de puertas sagradas y juramentos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/dragon.png",
    imageUrl: "/images/bestiary/dragon.png",
    habitat: "Ruinas del Monasterio",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Blade of the Fallen", rarity: "epic", dropRate: "25%" },
      { itemName: "Relic of the Vow", rarity: "epic", dropRate: "20%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "50%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "65%" },
    ],
  },
  {
    id: "13",
    name: "El Dios Sepultado",
    slug: "el-dios-sepultado",
    race: "aberration",
    subtype: "Deidad caída",
    shortDescription: "Entidad antigua enterrada bajo capas de fe y piedra.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Oathsplitter Axe", rarity: "epic", dropRate: "18%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "24%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "32%" },
      { itemName: "Seal Key of the Tower", rarity: "legendary", dropRate: "5%" },
    ],
  },
  {
    id: "14",
    name: "El Encadenado",
    slug: "el-encadenado",
    race: "undead",
    subtype: "Penitente",
    shortDescription: "Un condenado que arrastra hierro y plegarias rotas.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "high",
    drops: [
      { itemName: "Grave Greaves", rarity: "rare", dropRate: "28%" },
      { itemName: "Tablet of Runes", rarity: "epic", dropRate: "16%" },
      { itemName: "Crimson Elixir", rarity: "rare", dropRate: "35%" },
    ],
  },
  {
    id: "15",
    name: "El Heraldo del Vacío",
    slug: "el-heraldo-del-vacio",
    race: "aberration",
    subtype: "Avatar",
    shortDescription: "Portavoz de la nada, donde la luz pierde su nombre.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Eclipsed Catalyst", rarity: "epic", dropRate: "22%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "26%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "30%" },
      { itemName: "Relic of the Vow", rarity: "legendary", dropRate: "6%" },
    ],
  },
  {
    id: "16",
    name: "El señor de las moscas",
    slug: "el-senor-de-las-moscas",
    race: "demon",
    subtype: "Señor de plaga",
    shortDescription: "Núcleo de infección que gobierna enjambres de putrefacción.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Pradera",
    dangerLevel: "high",
    isBoss: true,
    drops: [
      { itemName: "Penitent Mace", rarity: "rare", dropRate: "30%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "17%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "55%" },
    ],
  },
  {
    id: "17",
    name: "Esfinge",
    slug: "esfinge",
    race: "demihuman",
    subtype: "Guardiana",
    shortDescription: "Custodia enigmas y exige tributo de sangre o memoria.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/efige.png",
    imageUrl: "/images/bestiary/efige.png",
    habitat: "Ruinas del Monasterio",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "20%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "40%" },
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "30%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "70%" },
    ],
  },
  {
    id: "18",
    name: "Espíritus",
    slug: "espiritus",
    race: "undead",
    subtype: "Espectral",
    shortDescription: "Residuos de voluntad que no hallaron descanso.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "medium",
    drops: [
      { itemName: "Nocturne Resin", rarity: "uncommon", dropRate: "40%" },
      { itemName: "Seal Key of the Tower", rarity: "rare", dropRate: "18%" },
    ],
  },
  {
    id: "19",
    name: "Experimentos Fallidos",
    slug: "experimentos-fallidos",
    race: "aberration",
    subtype: "Mutación",
    shortDescription: "Restos vivos de pruebas prohibidas y carne cosida.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "high",
    drops: [
      { itemName: "Ashbound Gauntlets", rarity: "rare", dropRate: "25%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "32%" },
      { itemName: "Cinder Bomb", rarity: "epic", dropRate: "14%" },
    ],
  },
  {
    id: "20",
    name: "Gallo de tres cabezas",
    slug: "gallo-de-tres-cabezas",
    race: "beast",
    subtype: "Quimera rural",
    shortDescription: "Ave monstruosa de canto fúnebre al amanecer.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/gallo-de-tres-cabezas.png",
    imageUrl: "/images/bestiary/gallo-de-tres-cabezas.png",
    habitat: "Pradera",
    dangerLevel: "medium",
    drops: [
      { itemName: "Crimson Elixir", rarity: "uncommon", dropRate: "38%" },
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "20%" },
    ],
  },
  {
    id: "21",
    name: "Garrapatas de sangre",
    slug: "garrapatas-de-sangre",
    race: "beast",
    subtype: "Parásito",
    shortDescription: "Colonias hematófagas que debilitan a sus presas lentamente.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Alcantarillas",
    dangerLevel: "high",
    drops: [
      { itemName: "Tear of the Abyss", rarity: "rare", dropRate: "28%" },
      { itemName: "Tablet of Runes", rarity: "epic", dropRate: "14%" },
      { itemName: "Crimson Elixir", rarity: "uncommon", dropRate: "42%" },
    ],
  },
  {
    id: "22",
    name: "Gólems de la cosecha",
    slug: "golems-de-la-cosecha",
    race: "elemental",
    subtype: "Constructo",
    shortDescription: "Autómatas de barro y hierro ligados al ciclo del grano.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/hombre-de-paja.png",
    imageUrl: "/images/bestiary/hombre-de-paja.png",
    habitat: "Pradera",
    dangerLevel: "high",
    drops: [
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "15%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "35%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "60%" },
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "25%" },
    ],
  },
  {
    id: "23",
    name: "La Santa Compaña",
    slug: "la-santa-compana",
    race: "undead",
    subtype: "Procesión",
    shortDescription: "Cortejo de devotos muertos que marchan sin destino.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "high",
    drops: [
      { itemName: "Relic of the Vow", rarity: "rare", dropRate: "26%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "15%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "48%" },
    ],
  },
  {
    id: "24",
    name: "La Sombra del Pozo",
    slug: "la-sombra-del-pozo",
    race: "aberration",
    subtype: "Entidad",
    shortDescription: "Presencia informe que asciende de aguas estancadas.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "high",
    drops: [
      { itemName: "Knight's Ashen Cuirass", rarity: "rare", dropRate: "24%" },
      { itemName: "Remembrance of Radahn", rarity: "epic", dropRate: "16%" },
      { itemName: "Nocturne Resin", rarity: "rare", dropRate: "38%" },
    ],
  },
  {
    id: "25",
    name: "Larvas Abismales",
    slug: "larvas-abismales",
    race: "beast",
    subtype: "Infestación",
    shortDescription: "Crías de profundidad que corroen piedra y hueso.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "high",
    drops: [
      { itemName: "Seal Key of the Tower", rarity: "rare", dropRate: "21%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "19%" },
      { itemName: "Grave Greaves", rarity: "rare", dropRate: "27%" },
    ],
  },
  {
    id: "26",
    name: "Licántropos",
    slug: "licantropos",
    race: "humanoid",
    subtype: "Mutaforma",
    shortDescription: "Cazadores nocturnos entre hombre y bestia.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/licantropos.png",
    imageUrl: "/images/bestiary/licantropos.png",
    habitat: "Villa infestada",
    dangerLevel: "high",
    drops: [
      { itemName: "Oathsplitter Axe", rarity: "rare", dropRate: "29%" },
      { itemName: "Ember Pike", rarity: "epic", dropRate: "13%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "33%" },
    ],
  },
  {
    id: "26b",
    name: "Lobizón",
    slug: "lobizon",
    race: "humanoid",
    subtype: "Demonio",
    shortDescription: "Licántropo raro, más lobo que perro y más demonio que maldito.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/lobizon.png",
    imageUrl: "/images/bestiary/lobizon.png",
    habitat: "Villa infestada",
    dangerLevel: "extreme",
    drops: [
      { itemName: "Blade of the Fallen", rarity: "epic", dropRate: "20%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "23%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "48%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "29%" },
    ],
  },
  {
    id: "27",
    name: "Los Encadenados",
    slug: "los-encadenados",
    race: "undead",
    subtype: "Condenados",
    shortDescription: "Masa de cautivos unidos por hierro y dolor.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Las Profundidades",
    dangerLevel: "extreme",
    drops: [
      { itemName: "Penitent Mace", rarity: "epic", dropRate: "19%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "27%" },
      { itemName: "Seal Key of the Tower", rarity: "epic", dropRate: "31%" },
      { itemName: "Remembrance of Radahn", rarity: "legendary", dropRate: "7%" },
    ],
  },
  {
    id: "28",
    name: "Luz de la Luna Muerta",
    slug: "luz-de-la-luna-muerta",
    race: "elemental",
    subtype: "Aparición",
    shortDescription: "Resplandor frío que guía viajeros hacia su perdición.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "medium",
    drops: [
      { itemName: "Tablet of Runes", rarity: "uncommon", dropRate: "32%" },
      { itemName: "Golden Seed", rarity: "rare", dropRate: "19%" },
    ],
  },
  {
    id: "29",
    name: "Mandragoras",
    slug: "mandragoras",
    race: "elemental",
    subtype: "Flora maldita",
    shortDescription: "Raíces vivientes cuyo grito enloquece al desprevenido.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Bosque Embrujado",
    dangerLevel: "medium",
    drops: [
      { itemName: "Relic of the Vow", rarity: "uncommon", dropRate: "36%" },
      { itemName: "Cinder Bomb", rarity: "rare", dropRate: "21%" },
    ],
  },
  {
    id: "30",
    name: "Mayordomos Locos",
    slug: "mayordomos-locos",
    race: "humanoid",
    subtype: "Servidor corrupto",
    shortDescription: "Sirvientes de etiqueta rota y violencia ceremonial.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mansión de los Auremont",
    dangerLevel: "medium",
    drops: [
      { itemName: "Ashbound Gauntlets", rarity: "uncommon", dropRate: "41%" },
      { itemName: "Seal Key of the Tower", rarity: "rare", dropRate: "23%" },
    ],
  },
  {
    id: "31",
    name: "Miasmas",
    slug: "miasmas",
    race: "elemental",
    subtype: "Nube tóxica",
    shortDescription: "Vapores conscientes que se alimentan del aliento humano.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "high",
    drops: [
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "31%" },
      { itemName: "Rune of the Depths", rarity: "epic", dropRate: "17%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "52%" },
    ],
  },
  {
    id: "32",
    name: "Pestíferos",
    slug: "pestiferos",
    race: "undead",
    subtype: "Infectado",
    shortDescription: "Portadores de plaga que propagan ruina en cada paso.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Pradera",
    dangerLevel: "medium",
    drops: [
      { itemName: "Crimson Elixir", rarity: "uncommon", dropRate: "44%" },
      { itemName: "Ember Pike", rarity: "rare", dropRate: "24%" },
    ],
  },
  {
    id: "33",
    name: "Podredumbre Andante",
    slug: "podredumbre-andante",
    race: "undead",
    subtype: "Coloso pútrido",
    shortDescription: "Cadáver masivo en marcha perpetua, cubierto de moho.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Villa infestada",
    dangerLevel: "high",
    drops: [
      { itemName: "Grave Greaves", rarity: "epic", dropRate: "11%" },
      { itemName: "Tear of the Abyss", rarity: "rare", dropRate: "29%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "34%" },
    ],
  },
  {
    id: "34",
    name: "Prisioneros Malditos",
    slug: "prisioneros-malditos",
    race: "humanoid",
    subtype: "Condenado",
    shortDescription: "Reclusos deformados por años de tormento ritual.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "high",
    drops: [
      { itemName: "Iron Vigil Helm", rarity: "epic", dropRate: "13%" },
      { itemName: "Rune of the Depths", rarity: "rare", dropRate: "36%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "51%" },
    ],
  },
  {
    id: "35",
    name: "Ratas albinas gigantes",
    slug: "ratas-albinas-gigantes",
    race: "beast",
    subtype: "Plaga",
    shortDescription: "Roedores de gran tamaño que cazan en túneles húmedos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Alcantarillas",
    dangerLevel: "medium",
    drops: [
      { itemName: "Nocturne Resin", rarity: "uncommon", dropRate: "37%" },
      { itemName: "Crimson Elixir", rarity: "rare", dropRate: "22%" },
    ],
  },
  {
    id: "36",
    name: "Ratas Negras",
    slug: "ratas-negras",
    race: "beast",
    subtype: "Plaga",
    shortDescription: "Enjambres oportunistas que siguen la peste.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mazmorras de la Mansión",
    dangerLevel: "low",
    drops: [
      { itemName: "Tear of the Abyss", rarity: "common", dropRate: "50%" },
      { itemName: "Crimson Elixir", rarity: "uncommon", dropRate: "25%" },
    ],
  },
  {
    id: "37",
    name: "Hombre Cuervo",
    slug: "semihumanos",
    race: "demihuman",
    subtype: "Subespecie Cuervo",
    shortDescription: "Semihumano de linaje córvido, cazador sigiloso de la mansión.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/crow.png",
    imageUrl: "/images/bestiary/crow.png",
    habitat: "Mansión de los Auremont",
    dangerLevel: "medium",
    drops: [
      { itemName: "Blade of the Fallen", rarity: "uncommon", dropRate: "39%" },
      { itemName: "Tablet of Runes", rarity: "rare", dropRate: "25%" },
    ],
  },
  {
    id: "38",
    name: "Sirenas de Acero",
    slug: "sirenas-de-acero",
    race: "demihuman",
    subtype: "Linaje",
    shortDescription: "Criaturas de canto metálico ligadas a antiguas forjas.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mansión de los Auremont",
    dangerLevel: "extreme",
    isBoss: true,
    drops: [
      { itemName: "Oathsplitter Axe", rarity: "epic", dropRate: "21%" },
      { itemName: "Eclipsed Catalyst", rarity: "epic", dropRate: "24%" },
      { itemName: "Seal Key of the Tower", rarity: "epic", dropRate: "28%" },
      { itemName: "Rune of the Depths", rarity: "legendary", dropRate: "9%" },
    ],
  },
  {
    id: "39",
    name: "Sirvientes deformados",
    slug: "sirvientes-deformados",
    race: "demihuman",
    subtype: "Servidor",
    shortDescription: "Criados retorcidos por experimentación y obediencia ciega.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Alcantarillas",
    dangerLevel: "high",
    drops: [
      { itemName: "Knight's Ashen Cuirass", rarity: "epic", dropRate: "14%" },
      { itemName: "Seal Key of the Tower", rarity: "rare", dropRate: "26%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "39%" },
    ],
  },
  {
    id: "40",
    name: "Sirvientes Fantasmales",
    slug: "sirvientes-fantasmales",
    race: "undead",
    subtype: "Espectral",
    shortDescription: "Ecos domésticos de una casa que se niega a morir.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    habitat: "Mansión de los Auremont",
    dangerLevel: "medium",
    drops: [
      { itemName: "Relic of the Vow", rarity: "uncommon", dropRate: "35%" },
      { itemName: "Golden Seed", rarity: "rare", dropRate: "21%" },
    ],
  },
  {
    id: "41",
    name: "Trolls psiquicos",
    slug: "trolls-psiquicos",
    race: "demihuman",
    subtype: "Bruto mental",
    shortDescription: "Gigantes de mente errante con estallidos psiónicos que rotan entre formas.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/troll-gordo.png",
    imageUrl: "/images/bestiary/troll-gordo.png",
    habitat: "Bosque Embrujado",
    dangerLevel: "high",
    drops: [
      { itemName: "Ember Pike", rarity: "rare", dropRate: "27%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "15%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "54%" },
    ],
  },
  {
    id: "42",
    name: "Wisp",
    slug: "wisp",
    race: "elemental",
    subtype: "Luz errante",
    shortDescription: "Chispas conscientes que aparecen antes del desastre.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/wisp.png",
    imageUrl: "/images/bestiary/wisp.png",
    habitat: "Bosque Embrujado",
    dangerLevel: "low",
    drops: [
      { itemName: "Eclipsed Catalyst", rarity: "common", dropRate: "48%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "28%" },
    ],
  },
  {
    id: "43",
    name: "Gólem de Barro",
    slug: "golem-de-barro",
    race: "elemental",
    subtype: "Constructo",
    shortDescription: "Entidad de barro animado que emerge de suelos malditos.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/golem-de-barro.png",
    imageUrl: "/images/bestiary/golem-de-barro.png",
    habitat: "Pradera",
    dangerLevel: "high",
    drops: [
      { itemName: "Ashbound Gauntlets", rarity: "epic", dropRate: "13%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "37%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "53%" },
    ],
  },
  {
    id: "44",
    name: "Dragón Joven",
    slug: "dragon-joven",
    race: "dragon",
    subtype: "Juvenil",
    shortDescription: "Un dragón en su etapa juvenil, avido de fuego y conquista.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/dragon.jpg",
    imageUrl: "/images/bestiary/dragon.jpg",
    habitat: "Picos Volcánicos",
    dangerLevel: "high",
    drops: [
      { itemName: "Penitent Mace", rarity: "rare", dropRate: "32%" },
      { itemName: "Relic of the Vow", rarity: "epic", dropRate: "19%" },
      { itemName: "Remembrance of Radahn", rarity: "rare", dropRate: "40%" },
    ],
  },
  {
    id: "45",
    name: "Cabalgata Nocturna",
    slug: "cabalgata-nocturna",
    race: "undead",
    subtype: "Espectral",
    shortDescription: "Espectros envueltos en capas que guían almas con faroles fúnebres.",
    loreDescription: "Entrada del diario del Hechicero sobre esta criatura y su conducta en combate.",
    iconUrl: "/images/bestiary/cabalgata-nocturna.png",
    imageUrl: "/images/bestiary/cabalgata-nocturna.png",
    habitat: "Caminos de Penumbra",
    dangerLevel: "high",
    drops: [
      { itemName: "Iron Vigil Helm", rarity: "rare", dropRate: "31%" },
      { itemName: "Tear of the Abyss", rarity: "epic", dropRate: "18%" },
      { itemName: "Golden Seed", rarity: "uncommon", dropRate: "49%" },
    ],
  },
];
