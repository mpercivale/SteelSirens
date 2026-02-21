export const SUPPORTED_LANGUAGES = ["en", "es", "ja"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function resolveLanguage(value?: string | null): Language {
  if (value && SUPPORTED_LANGUAGES.includes(value as Language)) {
    return value as Language;
  }
  return "en";
}

const copy = {
  en: {
    dateLocale: "en-US",
    navbar: {
      brand: "Universe",
      languageLabel: "Language",
      nav: {
        home: "Home",
        characters: "Characters",
        bestiary: "Bestiary",
        items: "Items",
        locations: "Locations",
        updates: "Updates",
      },
    },
    hero: {
      eyebrow: "✦ Enter the World ✦",
      title: "The Ashen Chronicle",
      description:
        "A world of ash and dying embers. Of fallen gods and broken oaths. Of those who walk the line between light and shadow.",
    },
    latest: {
      eyebrow: "✦ Chronicle ✦",
      title: "Latest",
      readMore: "Read More",
    },
    categories: {
      title: "Explore the Universe",
      subtitle:
        "Discover regions, dungeons, and the artifacts that shape the journey.",
      worldTitle: "The World",
      arsenalTitle: "Equipment & Relics",
      main: [
        {
          title: "Items",
          description: "Weapons, armor, and artifacts that shape destiny",
        },
        {
          title: "Locations",
          description: "Explore the vast regions and hidden places",
        },
        {
          title: "Bestiary",
          description: "Creatures of darkness and legendary beasts",
        },
      ],
      world: [
        {
          title: "Regions",
          description: "The great lands of the known world",
        },
        {
          title: "Dungeons",
          description: "Places of darkness and peril",
        },
        {
          title: "Secrets",
          description: "Hidden locations few have found",
        },
      ],
      items: [
        {
          title: "Weapons",
          description: "Instruments of war forged in ancient fires",
        },
        {
          title: "Armor",
          description: "Protection against the darkness",
        },
        {
          title: "Relics",
          description: "Key artifacts tied to fate and hidden truths",
        },
      ],
    },
    footer: {
      links: {
        characters: "Characters",
        bestiary: "Bestiary",
        items: "Items",
        locations: "Locations",
        updates: "Updates",
      },
      line1: "All lore, characters, locations, and world content are original creations.",
      line2: "All rights reserved.",
      line3:
        "Commercial use of characters, artwork, and lore is strictly prohibited without explicit written permission.",
    },
    characterCircle: {
      readLore: "Biography",
    },
  },
  es: {
    dateLocale: "es-ES",
    navbar: {
      brand: "Universo",
      languageLabel: "Idioma",
      nav: {
        home: "Inicio",
        characters: "Personajes",
        bestiary: "Bestiario",
        items: "Objetos",
        locations: "Lugares",
        updates: "Novedades",
      },
    },
    hero: {
      eyebrow: "✦ Entra al Mundo ✦",
      title: "La Crónica de Ceniza",
      description:
        "Un mundo de ceniza y brasas agonizantes. De dioses caídos y juramentos rotos. De quienes caminan entre la luz y la sombra.",
    },
    latest: {
      eyebrow: "✦ Crónica ✦",
      title: "Lo Último",
      readMore: "Leer Más",
    },
    categories: {
      title: "Explora el Universo",
      subtitle:
        "Descubre regiones, mazmorras y artefactos que marcan el viaje.",
      worldTitle: "El Mundo",
      arsenalTitle: "Equipo y Reliquias",
      main: [
        {
          title: "Objetos",
          description: "Armas, armaduras y artefactos que moldean el destino",
        },
        {
          title: "Lugares",
          description: "Explora vastas regiones y lugares ocultos",
        },
        {
          title: "Bestiario",
          description: "Criaturas de la oscuridad y bestias legendarias",
        },
      ],
      world: [
        {
          title: "Regiones",
          description: "Las grandes tierras del mundo conocido",
        },
        {
          title: "Mazmorras",
          description: "Lugares de oscuridad y peligro",
        },
        {
          title: "Secretos",
          description: "Ubicaciones ocultas que pocos han encontrado",
        },
      ],
      items: [
        {
          title: "Armas",
          description: "Instrumentos de guerra forjados en fuegos antiguos",
        },
        {
          title: "Armadura",
          description: "Protección contra la oscuridad",
        },
        {
          title: "Reliquias",
          description: "Artefactos clave ligados al destino y a secretos ocultos",
        },
      ],
    },
    footer: {
      links: {
        characters: "Personajes",
        bestiary: "Bestiario",
        items: "Objetos",
        locations: "Lugares",
        updates: "Novedades",
      },
      line1: "Todo el lore, personajes, lugares y contenido del mundo son creaciones originales.",
      line2: "Todos los derechos reservados.",
      line3:
        "El uso comercial de personajes, arte y lore está estrictamente prohibido sin permiso explícito por escrito.",
    },
    characterCircle: {
      readLore: "Biografía",
    },
  },
  ja: {
    dateLocale: "ja-JP",
    navbar: {
      brand: "ユニバース",
      languageLabel: "言語",
      nav: {
        home: "ホーム",
        characters: "キャラクター",
        bestiary: "ベスティアリ",
        items: "アイテム",
        locations: "ロケーション",
        updates: "更新",
      },
    },
    hero: {
      eyebrow: "✦ 世界へようこそ ✦",
      title: "灰の年代記",
      description:
        "灰と消えゆく残り火の世界。堕ちた神々と砕けた誓い。光と影の狭間を歩む者たちの物語。",
    },
    latest: {
      eyebrow: "✦ クロニクル ✦",
      title: "最新情報",
      readMore: "続きを読む",
    },
    categories: {
      title: "ユニバースを探索",
      subtitle: "地域、ダンジョン、そして旅を左右する遺物を見つけよう。",
      worldTitle: "世界",
      arsenalTitle: "装備と遺物",
      main: [
        {
          title: "アイテム",
          description: "運命を形作る武器、防具、遺物",
        },
        {
          title: "ロケーション",
          description: "広大な地域と隠された場所を探索",
        },
        {
          title: "ベスティアリ",
          description: "闇の怪物と伝説の獣たち",
        },
      ],
      world: [
        {
          title: "地域",
          description: "既知世界の広大な大地",
        },
        {
          title: "ダンジョン",
          description: "闇と危険に満ちた場所",
        },
        {
          title: "秘密",
          description: "ごく少数しか見つけていない隠しロケーション",
        },
      ],
      items: [
        {
          title: "武器",
          description: "古の炎で鍛えられた戦いの道具",
        },
        {
          title: "防具",
          description: "闇から身を守るための備え",
        },
        {
          title: "遺物",
          description: "運命と隠された真実に結びつく重要な遺物",
        },
      ],
    },
    footer: {
      links: {
        characters: "キャラクター",
        bestiary: "ベスティアリ",
        items: "アイテム",
        locations: "ロケーション",
        updates: "更新",
      },
      line1: "伝承、キャラクター、ロケーション、世界観コンテンツはすべてオリジナル創作です。",
      line2: "無断転載・無断利用を禁じます。",
      line3: "キャラクター、アートワーク、伝承の商用利用は、書面による明示的な許可なしに固く禁じられています。",
    },
    characterCircle: {
      readLore: "伝記",
    },
  },
} as const;

type CharacterCircleSource = {
  slug?: string;
  name?: string;
  nombre?: string;
  title?: string;
  titulo?: string;
  shortDescription?: string;
  descripcion_corta?: string;
  quotes?: string[];
};

type CharacterCircleLocaleEntry = {
  name?: string;
  title?: string;
  shortDescription?: string;
  quotes?: string[];
  aliases?: Array<{
    name: string;
    title?: string;
  }>;
};

const characterCircleLocales: Record<Language, Record<string, CharacterCircleLocaleEntry>> = {
  en: {
    "el-perro": {
      name: "The Dog",
      title: "The Street Bandit",
      quotes: ["Keep your coin close and your blade closer."],
    },
    "el-escudero": {
      name: "The Squire",
      title: "The Pure Heart",
      quotes: ["Father said to always do what's right..."],
    },
    "la-doncella": {
      name: "The Maiden",
      title: "The Hollow Princess",
      quotes: ["...Light..."],
    },
    "el-juez": {
      name: "The Judge",
      title: "The Necessary Evil",
      quotes: ["Morality is the luxury of the weak."],
    },
    "el-hechicero": {
      name: "The Sorcerer",
      title: "The Obsessed Scholar",
      quotes: ["The stars whisper secrets to those who listen."],
    },
    "el-viejo-manto-blanco": {
      name: "The Old Man in White Cloak",
      title: "The Baron of the Frontier",
      quotes: ["The Well... it calls..."],
    },
    ruth: {
      name: "The Hidden Mage",
      title: "Warden of the Depths",
      quotes: ["The heir will rise again... no matter the cost."],
      aliases: [
        { name: "The Hidden Mage", title: "Warden of the Depths" },
        { name: "The Custodian", title: "Warden of the Tower" },
        { name: "Depths Custodian", title: "The Veiled Regent" },
      ],
    },
  },
  es: {
    "el-perro": {
      name: "El Perro",
      title: "El Bandido de la Calle",
      quotes: ["Ten tus monedas cerca y tu hoja aún más."],
    },
    "el-escudero": {
      name: "El Escudero",
      title: "El Corazón Puro",
      quotes: ["Mi padre dijo que siempre haga lo correcto..."],
    },
    "la-doncella": {
      name: "La Doncella",
      title: "La Princesa Hueca",
      quotes: ["...Luz..."],
    },
    "el-juez": {
      name: "El Juez",
      title: "El Mal Necesario",
      quotes: ["La moral es el lujo de los débiles."],
    },
    "el-hechicero": {
      name: "El Hechicero",
      title: "El Erudito Obsesivo",
      quotes: ["Las estrellas susurran secretos a quien escucha."],
    },
    "el-viejo-manto-blanco": {
      name: "El Viejo del Manto Blanco",
      title: "El Barón de la Frontera",
      quotes: ["El Pozo... me llama..."],
    },
    ruth: {
      name: "La Custodia",
      title: "Custodia de las Profundidades",
      quotes: ["La heredera volverá a alzarse... cueste lo que cueste."],
      aliases: [
        { name: "La Figura Velada", title: "Custodia de las Profundidades" },
        { name: "La Custodia", title: "Guardiana de la Torre" },
        { name: "Custodia de las Profundidades", title: "Regencia Velada" },
      ],
    },
  },
  ja: {
    "el-perro": {
      name: "エル・ペロ",
      title: "街路の盗賊",
      quotes: ["金貨は近くに、刃はもっと近くに。"],
    },
    "el-escudero": {
      name: "従者",
      title: "純粋なる心",
      quotes: ["父さんは、正しいことをしろと言った..."],
    },
    "la-doncella": {
      name: "乙女",
      title: "空虚の姫",
      quotes: ["...あたたかい..."],
    },
    "el-juez": {
      name: "裁き手",
      title: "必要悪",
      quotes: ["道徳は弱者のぜいたくだ。"],
    },
    "el-hechicero": {
      name: "魔術師",
      title: "執念の学者",
      quotes: ["星々は、耳を澄ます者に秘密を囁く。"],
    },
    "el-viejo-manto-blanco": {
      name: "白き外套の老翁",
      title: "辺境の男爵",
      quotes: ["井戸が... 私を呼んでいる..."],
    },
    ruth: {
      name: "隠されし魔導者",
      title: "深淵の守り手",
      quotes: ["後継者は再び立つ... 代償が何であれ。"],
      aliases: [
        { name: "隠されし魔導者", title: "深淵の守り手" },
        { name: "守り手", title: "塔の番人" },
        { name: "深淵の守り手", title: "覆われし統治者" },
      ],
    },
  },
};

export function getCharacterCircleContent(lang: Language, character: CharacterCircleSource) {
  const slug = character.slug ?? "";
  const localized = characterCircleLocales[lang][slug];

  return {
    name: localized?.name ?? character.nombre ?? character.name ?? "",
    title: localized?.title ?? character.titulo ?? character.title ?? "",
    shortDescription:
      localized?.shortDescription ?? character.descripcion_corta ?? character.shortDescription ?? "",
    quotes: localized?.quotes ?? character.quotes ?? [],
  };
}

export function getCharacterCircleIdentities(lang: Language, character: CharacterCircleSource) {
  const slug = character.slug ?? "";
  const localized = characterCircleLocales[lang][slug];
  const fallbackName = localized?.name ?? character.nombre ?? character.name ?? "";
  const fallbackTitle = localized?.title ?? character.titulo ?? character.title ?? "";

  if (localized?.aliases && localized.aliases.length > 0) {
    return localized.aliases;
  }

  return [{ name: fallbackName, title: fallbackTitle }];
}

type CharacterDetailContentSource = {
  slug?: string;
  title?: string;
  class?: string;
  origin?: string;
  shortDescription?: string;
  lore?: string;
  build?: {
    archetype?: string;
    weaponClass?: string;
    damageFocus?: string;
  };
};

const characterDetailContentLocales: Record<Language, Record<string, Partial<CharacterDetailContentSource>>> = {
  en: {},
  es: {
    "el-perro": {
      title: "El Bandido de la Calle",
      class: "Bandido",
      origin: "Las Calles",
      shortDescription: "Un bandido callejero astuto, atado a una promesa de proteger al muchacho.",
      lore: `**Rol:**
- Bandido de calle, pragmático, astuto y ruin.
- Representa la **humanidad común**, con vicios y destellos de virtud.

**Motivación / Objetivos:**
- Alcanzar la torre en busca de **riqueza y beneficio personal**.
- Cumplir una **promesa a un amigo muerto**, que lo ata al viaje y al cuidado del niño.

**Arco de Transformación:**
- Inicio: oportunista egoísta.
- Durante el viaje: el vínculo con el niño despierta su instinto protector.
- Final: sigue siendo vulgar y mezquino, pero ya puede actuar por alguien más.

**Relaciones:**
- **El Escudero:** afecto creciente; mentor improvisado.
- **La Doncella:** la percibe como un riesgo.
- **El Juez:** tensión constante; protege al niño de su corrupción.
- **El Hechicero:** desconfianza y curiosidad; lo considera impredecible.

**Notas:**
- “Perro” refleja vulgaridad, mezquindad y supervivencia callejera.
- Astuto, bebedor, egoísta, pero con momentos reales de cuidado.`,
      build: {
        archetype: "Oportunista Destreza/Arcano",
        weaponClass: "Espada curva + daga",
        damageFocus: "Presión de sangrado y castigo veloz",
      },
    },
    "el-escudero": {
      title: "El Corazón Puro",
      class: "Escudero",
      origin: "Aldea Rural",
      shortDescription: "Un muchacho inocente que se vuelve brújula moral en un mundo corrupto.",
      lore: `Joven campesino que encarna esperanza y crecimiento moral. Comienza ingenuo, pero el viaje lo obliga a madurar sin perder su humanidad.

Su objetivo no es el poder: es sobrevivir, cumplir la promesa de su padre y sostener al grupo cuando todo se desmorona.`,
      build: {
        archetype: "Vanguardia Calidad/Fe",
        weaponClass: "Espada recta + escudo mediano",
        damageFocus: "Contraataques de guardia y frente sostenido",
      },
    },
    "la-doncella": {
      title: "La Princesa Hueca",
      class: "Noble Corrupta",
      origin: "Linaje Real",
      shortDescription: "Una princesa resucitada, atrapada entre monstruo y humanidad.",
      lore: `Hija de sangre noble, devuelta a la vida de forma incompleta. Su cuerpo y mente cargan trauma, rabia y ecos de humanidad.

No persigue gloria: intenta mantenerse funcional, sobrevivir y acercarse al niño, único vínculo capaz de estabilizarla.`,
      build: {
        archetype: "Depredadora Híbrida",
        weaponClass: "Twinblade + garras",
        damageFocus: "Ráfagas de stagger y presión arcana",
      },
    },
    "el-juez": {
      title: "El Mal Necesario",
      class: "Fanático",
      origin: "Desconocido",
      shortDescription: "Un psicópata carismático cuyo pragmatismo cruel mantiene vivo al grupo.",
      lore: `Figura fanática y manipuladora. Busca la torre para dominar su poder y quebrar la moral del muchacho.

Su violencia y frialdad son repulsivas, pero también efectivas: sobrevive donde otros dudan. Es la contradicción viva entre monstruosidad y utilidad.`,
      build: {
        archetype: "Generalista Omnímodo (Overpowered)",
        weaponClass: "Mandoble colosal + sello + bastón",
        damageFocus: "Versatilidad total y presión opresiva",
      },
    },
    "el-hechicero": {
      title: "El Erudito Obsesivo",
      class: "Hechicero",
      origin: "Tierras Orientales Lejanas",
      shortDescription: "Un mago obsesionado con el conocimiento que termina consumido por él.",
      lore: `Estudioso brillante, meticuloso y arrogante, atraído por la biblioteca secreta de la torre.

Su talento es inmenso, pero su obsesión lo vuelve frágil ante la influencia de la torre, que distorsiona su juicio.`,
      build: {
        archetype: "Artillería de Hechicería Pura",
        weaponClass: "Bastón de glintstone + arma secundaria",
        damageFocus: "Explosión mágica a larga distancia",
      },
    },
    "el-viejo-manto-blanco": {
      title: "El Barón de la Frontera",
      class: "Noble Caído",
      origin: "La Santa Sede",
      shortDescription: "Un antiguo barón temido, hoy reducido a un anciano errante y quebrado.",
      lore: `Antiguo conquistador y símbolo de autoridad brutal, ahora deambula entre recuerdos rotos y obsesión por el Pozo.

Su decadencia física contrasta con un pasado de hierro. A veces guía, a veces confunde, siempre deja ecos de algo antiguo y peligroso.`,
      build: {
        archetype: "Guardián de Reliquias Arcano/Fe",
        weaponClass: "Lanza + catalizador sagrado",
        damageFocus: "Acumulación de estado y daño ritual",
      },
    },
    ruth: {
      title: "Custodia de las Profundidades",
      class: "Archimaga",
      origin: "La Torre",
      shortDescription: "Una guardiana velada consumida por la obsesión y la locura de la torre.",
      lore: `Guardiana de La Doncella y maga-alquimista autodidacta de poder excepcional. Su amor se transforma en obsesión, y la obsesión en delirio.

La mansión refleja su mente: comienza ordenada y termina fragmentada, llena de facciones, cultos y tensiones internas.`,
      build: {
        archetype: "Archimaga de Control",
        weaponClass: "Bastón + sello sagrado",
        damageFocus: "Control de área y hechizos de alto escalado",
      },
    },
  },
  ja: {
    "el-perro": {
      title: "街路の盗賊",
      class: "盗賊",
      origin: "路地裏",
      shortDescription: "少年を守る誓いに縛られた、狡猾な街の盗賊。",
      lore: `**役割:**
- 実利的で狡猾、そして卑小な街の盗賊。
- 悪徳と小さな善を併せ持つ、**ありふれた人間性**の象徴。

**動機 / 目的:**
- **富と私益**を求めて塔へ到達すること。
- **亡き友との約束**を果たすこと。その誓いが、旅と少年を守る責務へ彼を縛る。

**変化の軌跡:**
- 序盤: 利己的な機会主義者。
- 旅の途中: 少年との絆が保護本能を呼び覚まし、過去と向き合う。
- 終盤: 下品さと卑小さは残るが、他者のために行動できるようになる。

**関係性:**
- **エル・エスクデロ:** 情が深まり、即席の導き手となる。
- **ラ・ドンセージャ:** 危険要素として警戒する。
- **エル・フエス:** 皮肉と緊張の応酬。少年を彼の腐敗から守ろうとする。
- **エル・エチセロ:** 不信と好奇心。予測不能で生存を脅かす存在と見る。

**備考:**
- 「ペロ（犬）」という呼び名は、下卑さ・卑小さ・路上での生存本能を示す。
- 狡猾で酒浸り、自己中心的だが、少年へ向ける本物の思いやりの瞬間がある。`,
      build: {
        archetype: "技量/神秘の機会主義者",
        weaponClass: "曲剣 + 短剣",
        damageFocus: "出血圧と高速の差し返し",
      },
    },
    "el-escudero": {
      title: "純粋なる心",
      class: "従者",
      origin: "農村",
      shortDescription: "腐敗した世界で道徳の羅針盤へと成長する、無垢な少年。",
      lore: `**役割:**
- 中心となる主人公であり、中世の農民の少年。
- 過酷な世界における**純粋さ・希望・倫理的成長**を体現する。

**動機 / 目的:**
- 父との約束を果たすこと。正しく生き、価値観を守る。
- 旅を生き延び、大人の世界から学ぶ。
- ラ・ドンセージャを支え、仲間の心の結束を保つ。

**変化の軌跡:**
- 序盤: 純真で公平だが、力も経験もない。
- 旅の途中: 恐怖と人間の矛盾に触れ、曖昧さに向き合う術を学ぶ。
- 終盤: 困難な決断を下せる若者へ成長し、裁き手や乙女の傷に囲まれても人間性を保つ。

**関係性:**
- **エル・ペロ:** ずる賢さと現実感覚を学ぶ師であり情の支え。
- **ラ・ドンセージャ:** 彼女の人間性回復を促す触媒。
- **エル・フエス:** 倫理観を試される、道徳的対立の源。
- **仲間全体:** 精神的中心。彼の無垢は周囲の腐敗と対照をなす。

**備考:**
- 澄んだ目と豊かな表情を持つ農民の少年。
- 闇深い世界に対する無垢さと好奇心。
- 見返りを求めない助け、静かな勇気、乙女への思いやりに倫理が表れる。`,
      build: {
        archetype: "上質/信仰の前衛",
        weaponClass: "直剣 + 中盾",
        damageFocus: "ガードカウンターと前線維持",
      },
    },
    "la-doncella": {
      title: "空虚の姫",
      class: "堕ちた貴族",
      origin: "王家の血統",
      shortDescription: "怪物と人間の狭間に囚われた、蘇生された姫。",
      lore: `**役割:**
- 魔術師の娘であり王女。半端な蘇生によって怪物化した存在。
- **外傷による腐敗と人間性の回復**を象徴する。

**動機 / 目的:**
- 生き延び、機能を保ちつつ、**イスマエルに近づく**こと。彼だけが彼女の人間性を呼び戻せる。
- 塔は主目的ではなく、**脅威であり避けられない運命**として立ちはだかる。

**変化の軌跡:**
- 序盤: 空虚で不安定、獣のように振る舞う。
- 旅の途中: 少年との絆を通じて人間性を取り戻していく。
- 終盤: より人間らしくなるが、獣性の残滓は消えない。

**関係性:**
- **エル・エスクデロ:** 人間性回復の触媒。
- **エル・フエス:** 緊張を伴う相互認識。彼は彼女を同類の怪物と見る。
- **エル・ペロ:** 当初は不信。計算可能な危険として扱う。
- **エル・エチセロ:** 彼の存在と魔術は彼女を不安定化させる。

**備考:**
- 無口で、表情の変化はほとんどない。
- 金髪、真珠色の瞳、青い甲虫装甲をまとった昆虫的な体躯。`,
      build: {
        archetype: "混成の捕食者",
        weaponClass: "ツインブレード + 爪",
        damageFocus: "高い怯み性能の連撃と神秘圧",
      },
    },
    "el-juez": {
      title: "必要悪",
      class: "狂信者",
      origin: "不明",
      shortDescription: "残酷な実利主義で仲間を生かす、カリスマ的な精神異常者。",
      lore: `**役割:**
- ジャッジ・ホールデンに着想を得た、狂信的でカリスマ性を持つ中世的サイコパス。
- 仲間の倫理を侵食する**必要悪**を体現する。

**動機 / 目的:**
- 塔が与えると信じる**力**を得るため塔へ向かい、支配と狂信を強化する。
- 少年を堕落させ、集団への影響力を維持する。

**変化の軌跡:**
- 序盤: 微笑を湛えた恐るべき権威者。
- 旅の途中: 腐敗し続けるが、その悪が結果的に一行を生かす。
- 終盤: 怪物性を露わにし、乙女が人間性を取り戻すと激昂する。

**関係性:**
- **エル・エスクデロ:** 倫理を試し、堕落へ誘う対象。
- **ラ・ドンセージャ:** 無言の敬意。彼女を同等の怪物として認める。
- **エル・ペロ:** 道徳と支配を巡る恒常的な緊張。
- **エル・エチセロ:** 有用な資源と見なすが完全には信用しない。

**備考:**
- 鋭い精神病質と操作性、常に浮かぶ笑み。
- その逸脱した行為こそが、皮肉にも一行の生存を支える。`,
      build: {
        archetype: "全能型ジェネラリスト（Overpowered）",
        weaponClass: "特大剣 + 聖印 + 杖",
        damageFocus: "完全対応力と圧殺的プレッシャー",
      },
    },
    "el-hechicero": {
      title: "執念の学者",
      class: "魔術師",
      origin: "遥か東方",
      shortDescription: "知識への執着に呑まれていく、才気あふれる魔術師。",
      lore: `**役割:**
- 塔の秘密図書館に魅入られた、優秀で傲慢な知識人。
- **知への執着**が天才性と破滅性を同時に生む存在。

**動機 / 目的:**
- 塔に隠された禁書と魔術理論を解読し、知の極地へ到達する。
- 仲間を利用しつつ、自身の研究と生存を両立させる。

**変化の軌跡:**
- 序盤: 冷静で計算高い学究肌。
- 旅の途中: 塔の影響で判断が歪み、執着が加速する。
- 終盤: 才能は増すが精神の均衡を失い、知識そのものに侵食される。

**関係性:**
- **エル・ペロ:** 実用性を認め合う一方で深い不信がある。
- **エル・エスクデロ:** 彼の純粋さに戸惑い、時に良心を刺激される。
- **ラ・ドンセージャ:** 魔力的共鳴に興味を示すが、彼女を不安定化させる。
- **エル・フエス:** 知略同士の緊張関係。互いに利用し、牽制する。

**備考:**
- 緻密で高慢、しかし未知の前では脆い。
- 才能は巨大だが、塔の囁きに最も影響されやすい。`,
      build: {
        archetype: "純魔術砲台",
        weaponClass: "輝石の杖 + 副武器",
        damageFocus: "遠距離の高火力魔術",
      },
    },
    "el-viejo-manto-blanco": {
      title: "辺境の男爵",
      class: "没落貴族",
      origin: "聖座",
      shortDescription: "かつて恐れられた男爵。今は崩れかけた老いた放浪者。",
      lore: `**役割:**
- かつての征服者であり、苛烈な権威の象徴。
- 没落後は記憶の断片と「井戸」への執着に取り憑かれた老人。

**動機 / 目的:**
- 井戸に潜む真実へ再び手を伸ばし、失った秩序を取り戻す。
- 一行に断片的な導きを与えつつ、自らの過去と妄執に囚われ続ける。

**変化の軌跡:**
- 序盤: 威厳の残響をまとった老貴族。
- 旅の途中: 正気と混濁のあいだを揺れ、時に助言し時に混乱を招く。
- 終盤: 肉体は衰えても過去の重みは消えず、古い時代の亡霊として在り続ける。

**関係性:**
- **エル・ペロ:** 互いに一定の距離を保つ、警戒混じりの敬意。
- **エル・エスクデロ:** 断片的で謎めいた導きを授ける。
- **ラ・ドンセージャ:** 彼女に古い因縁の気配を感じ取り、距離を置く。
- **エル・フエス:** 権威の衝突。互いに相手の危険性を理解している。

**備考:**
- 老衰した身体と、鋼のような過去との落差が際立つ。
- 井戸への執念は、彼の罪と使命の境界を曖昧にしている。`,
      build: {
        archetype: "神秘/信仰の遺物守護者",
        weaponClass: "槍 + 聖なる触媒",
        damageFocus: "状態蓄積と儀式的ダメージ",
      },
    },
    ruth: {
      title: "深淵の守り手",
      class: "大魔導師",
      origin: "塔",
      shortDescription: "塔の狂気と執着に蝕まれた、ヴェールの守護者。",
      lore: `**役割:**
- ラ・ドンセージャの保護者であり、独学で頂点に達した魔導錬金術師。
- 愛が執着へ、執着が狂気へと転じた悲劇の中心人物。

**動機 / 目的:**
- 乙女を守り続け、あらゆる代償を払ってでも再生を成功させる。
- 塔の支配構造を維持しつつ、自らの研究体系を完成させる。

**変化の軌跡:**
- 序盤: 冷静で理知的な守護者。
- 旅の途中: 研究と愛情が過熱し、判断が偏執へ傾く。
- 終盤: 邸宅と同じく精神も分裂し、秩序は派閥と儀式に崩れていく。

**関係性:**
- **ラ・ドンセージャ:** 庇護と支配が絡み合う、最も深い執着対象。
- **エル・エスクデロ:** 乙女を変える存在として危険視する。
- **エル・ペロ:** 粗暴な現実主義者として軽視しつつ警戒する。
- **エル・フエス:** 互いの有用性を認めるが、主導権を巡って対立する。

**備考:**
- 邸宅の変質は、彼女の精神構造そのものを映す。
- 卓越した能力の持ち主だが、執着が理性を侵食し続けている。`,
      build: {
        archetype: "制圧型アークメイジ",
        weaponClass: "杖 + 聖印",
        damageFocus: "範囲制圧と高補正スペル",
      },
    },
  },
};

export function getCharacterDetailContent(lang: Language, character: CharacterDetailContentSource) {
  const slug = character.slug ?? "";
  const localized = characterDetailContentLocales[lang][slug];

  return {
    title: localized?.title ?? character.title ?? "",
    class: localized?.class ?? character.class ?? "",
    origin: localized?.origin ?? character.origin ?? "",
    shortDescription: localized?.shortDescription ?? character.shortDescription ?? "",
    lore: localized?.lore ?? character.lore ?? "",
    build: {
      archetype: localized?.build?.archetype ?? character.build?.archetype ?? "",
      weaponClass: localized?.build?.weaponClass ?? character.build?.weaponClass ?? "",
      damageFocus: localized?.build?.damageFocus ?? character.build?.damageFocus ?? "",
    },
  };
}

export function getHomeCopy(lang: Language) {
  return copy[lang];
}

const charactersCopy = {
  en: {
    pageEyebrow: "✦ The Wanderers ✦",
    pageTitle: "Characters",
    protagonist: "Protagonist",
  },
  es: {
    pageEyebrow: "✦ Los Errantes ✦",
    pageTitle: "Personajes",
    protagonist: "Protagonista",
  },
  ja: {
    pageEyebrow: "✦ 放浪者たち ✦",
    pageTitle: "キャラクター",
    protagonist: "主人公",
  },
} as const;

export function getCharactersCopy(lang: Language) {
  return charactersCopy[lang];
}

const characterDetailCopy = {
  en: {
    backToCharacters: "Back to Characters",
    mode2d: "2D",
    mode3d: "3D",
    modelFallback: "3D model not available for this character yet",
    tabs: {
      lore: "Lore",
      build: "Arsenal",
      relations: "Relations",
    },
    sections: {
      chronicle: "Chronicle",
      buildLoadout: "Build & Loadout",
      relationships: "Relationships & Reputation",
      relationMap: "Relationship Map",
      reputation: "Reputation",
      conceptArtGallery: "Concept Art Gallery",
    },
    labels: {
      archetype: "Archetype",
      weaponStyle: "Weapon Style",
      focus: "Focus",
      itemsEquipped: "Items Equipped",
      spells: "Spells",
      enchantments: "Enchantments",
      relationType: "Bond",
      standing: "Standing",
    },
    standings: {
      hostile: "Hostile",
      neutral: "Neutral",
      friendly: "Friendly",
      honored: "Honored",
      revered: "Revered",
      exalted: "Exalted",
    },
    stats: {
      vigor: "Vigor",
      mind: "Mind",
      endurance: "Endurance",
      strength: "Strength",
      dexterity: "Dexterity",
      intelligence: "Intelligence",
      faith: "Faith",
      arcane: "Arcane",
    },
    status: {
      alive: "Alive",
      deceased: "Deceased",
      unknown: "Unknown",
    },
    empty: {
      noLore: "The chronicles of this character remain shrouded in mystery...",
      noBuild: "Build data is not available for this character yet.",
      noBuildEntries: "No entries configured for this build.",
      noRelations: "This character walks a solitary path...",
      noRelationsMap: "No relationships mapped yet.",
    },
  },
  es: {
    backToCharacters: "Volver a Personajes",
    mode2d: "2D",
    mode3d: "3D",
    modelFallback: "Modelo 3D no disponible para este personaje todavía",
    tabs: {
      lore: "Historia",
      build: "Arsenal",
      relations: "Relaciones",
    },
    sections: {
      chronicle: "Crónica",
      buildLoadout: "Arsenal y Equipamiento",
      relationships: "Relaciones y Reputación",
      relationMap: "Mapa de Relaciones",
      reputation: "Reputación",
      conceptArtGallery: "Galería de Arte Conceptual",
    },
    labels: {
      archetype: "Arquetipo",
      weaponStyle: "Estilo de Arma",
      focus: "Enfoque",
      itemsEquipped: "Objetos Equipados",
      spells: "Hechizos",
      enchantments: "Encantamientos",
      relationType: "Vínculo",
      standing: "Reputación",
    },
    standings: {
      hostile: "Hostil",
      neutral: "Neutral",
      friendly: "Amistoso",
      honored: "Honorable",
      revered: "Venerado",
      exalted: "Exaltado",
    },
    stats: {
      vigor: "Vigor",
      mind: "Mente",
      endurance: "Resistencia",
      strength: "Fuerza",
      dexterity: "Destreza",
      intelligence: "Inteligencia",
      faith: "Fe",
      arcane: "Arcano",
    },
    status: {
      alive: "Vivo",
      deceased: "Fallecido",
      unknown: "Desconocido",
    },
    empty: {
      noLore: "Las crónicas de este personaje siguen envueltas en misterio...",
      noBuild: "Aún no hay datos de build para este personaje.",
      noBuildEntries: "No hay entradas configuradas para esta build.",
      noRelations: "Este personaje camina un camino solitario...",
      noRelationsMap: "Aún no hay relaciones mapeadas.",
    },
  },
  ja: {
    backToCharacters: "キャラクター一覧へ戻る",
    mode2d: "2D",
    mode3d: "3D",
    modelFallback: "このキャラクターの3Dモデルはまだ利用できません",
    tabs: {
      lore: "伝承",
      build: "アーセナル",
      relations: "関係",
    },
    sections: {
      chronicle: "年代記",
      buildLoadout: "ビルドと装備",
      relationships: "関係と評価",
      relationMap: "関係マップ",
      reputation: "評価",
      conceptArtGallery: "コンセプトアートギャラリー",
    },
    labels: {
      archetype: "アーキタイプ",
      weaponStyle: "武器スタイル",
      focus: "特化",
      itemsEquipped: "装備アイテム",
      spells: "スペル",
      enchantments: "エンチャント",
      relationType: "関係タイプ",
      standing: "評価",
    },
    standings: {
      hostile: "敵対",
      neutral: "中立",
      friendly: "友好",
      honored: "名誉",
      revered: "崇敬",
      exalted: "崇拝",
    },
    stats: {
      vigor: "生命力",
      mind: "精神力",
      endurance: "持久力",
      strength: "筋力",
      dexterity: "技量",
      intelligence: "知力",
      faith: "信仰",
      arcane: "神秘",
    },
    status: {
      alive: "生存",
      deceased: "死亡",
      unknown: "不明",
    },
    empty: {
      noLore: "このキャラクターの年代記は、いまだ謎に包まれている...",
      noBuild: "このキャラクターのビルドデータはまだありません。",
      noBuildEntries: "このビルドには設定済みの項目がありません。",
      noRelations: "このキャラクターは孤独な道を歩んでいる...",
      noRelationsMap: "まだ関係マップのデータがありません。",
    },
  },
} as const;

export function getCharacterDetailCopy(lang: Language) {
  return characterDetailCopy[lang];
}

const bestiarioCopy = {
  en: {
    pageEyebrow: "✦ Creatures of Shadow ✦",
    pageTitle: "Bestiary",
    pageDescription: "A record of horrors, omens, and creatures that roam the edges of the known world.",
  },
  es: {
    pageEyebrow: "✦ Criaturas de la Sombra ✦",
    pageTitle: "Bestiario",
    pageDescription: "Un registro de horrores, presagios y criaturas que vagan por los límites del mundo conocido.",
  },
  ja: {
    pageEyebrow: "✦ 影に棲むものたち ✦",
    pageTitle: "ベスティアリ",
    pageDescription: "既知世界の境界を彷徨う、怪異・凶兆・異形の記録。",
  },
} as const;

export function getBestiarioCopy(lang: Language) {
  return bestiarioCopy[lang];
}

const itemsCopy = {
  en: {
    pageEyebrow: "✦ Equipment, Relics & Tools ✦",
    pageTitle: "Equipment Compendium",
    backToItems: "Back to Items",
    howToObtain: "How to Obtain",
    noItemCategories: "No item categories available yet...",
    noItemsInSubsection: "No items catalogued in this subsection yet.",
    toggleNoModel: "3D model coming soon",
    toggleNoModelTitle: "No 3D model available yet",
    toggleTo2D: "Switch to 2D view",
    toggleTo3D: "Switch to 3D view",
    viewerFallback: "3D model not available for this item yet",
    viewerRotateHint: "Drag to rotate",
    rarity: {
      comun: "Common",
      raro: "Rare",
      epico: "Epic",
      legendario: "Legendary",
    },
  },
  es: {
    pageEyebrow: "✦ Equipo, Reliquias y Herramientas ✦",
    pageTitle: "Compendio de Equipo",
    backToItems: "Volver a Objetos",
    howToObtain: "Cómo se Obtiene",
    noItemCategories: "Aún no hay categorías de objetos disponibles...",
    noItemsInSubsection: "Aún no hay objetos catalogados en esta subsección.",
    toggleNoModel: "Modelo 3D próximamente",
    toggleNoModelTitle: "Aún no hay modelo 3D disponible",
    toggleTo2D: "Cambiar a vista 2D",
    toggleTo3D: "Cambiar a vista 3D",
    viewerFallback: "Modelo 3D no disponible para este objeto todavía",
    viewerRotateHint: "Arrastra para rotar",
    rarity: {
      comun: "Común",
      raro: "Raro",
      epico: "Épico",
      legendario: "Legendario",
    },
  },
  ja: {
    pageEyebrow: "✦ 装備・遺物・道具 ✦",
    pageTitle: "装備大全",
    backToItems: "アイテム一覧へ戻る",
    howToObtain: "入手方法",
    noItemCategories: "利用可能なアイテムカテゴリはまだありません...",
    noItemsInSubsection: "このサブセクションにはまだ登録アイテムがありません。",
    toggleNoModel: "3Dモデルは近日対応",
    toggleNoModelTitle: "このアイテムの3Dモデルはまだありません",
    toggleTo2D: "2D表示へ切り替え",
    toggleTo3D: "3D表示へ切り替え",
    viewerFallback: "このアイテムの3Dモデルはまだ利用できません",
    viewerRotateHint: "ドラッグして回転",
    rarity: {
      comun: "コモン",
      raro: "レア",
      epico: "エピック",
      legendario: "レジェンダリー",
    },
  },
} as const;

const itemCategoryLocales: Record<Language, Record<string, { name: string; description?: string }>> = {
  en: {
    weapons: { name: "Weapons", description: "Blades and instruments built for combat." },
    swords: { name: "Swords" },
    axes: { name: "Axes" },
    maces: { name: "Maces" },
    spears: { name: "Spears" },
    staffs: { name: "Staffs & Catalysts" },
    armor: { name: "Armor", description: "Protection against steel, ash, and curses." },
    helms: { name: "Helms" },
    chest: { name: "Chest Armor" },
    gauntlets: { name: "Gauntlets" },
    greaves: { name: "Greaves" },
    consumables: { name: "Consumables", description: "Single-use tools, brews, and battlefield aid." },
    potions: { name: "Potions" },
    bombs: { name: "Bombs" },
    resins: { name: "Resins & Buffs" },
    key_items: { name: "Key Items", description: "Relics tied to progression, seals, and hidden truths." },
    keys: { name: "Keys" },
    quest_relics: { name: "Quest Relics" },
    runes: { name: "Runes & Seals" },
  },
  es: {
    weapons: { name: "Armas", description: "Hojas e instrumentos creados para el combate." },
    swords: { name: "Espadas" },
    axes: { name: "Hachas" },
    maces: { name: "Mazas" },
    spears: { name: "Lanzas" },
    staffs: { name: "Bastones y Catalizadores" },
    armor: { name: "Armaduras", description: "Protección contra acero, ceniza y maldiciones." },
    helms: { name: "Cascos" },
    chest: { name: "Pecheras" },
    gauntlets: { name: "Guanteletes" },
    greaves: { name: "Grebas" },
    consumables: { name: "Consumibles", description: "Objetos de un uso, brebajes y apoyo en batalla." },
    potions: { name: "Pociones" },
    bombs: { name: "Bombas" },
    resins: { name: "Resinas y Potenciadores" },
    key_items: { name: "Objetos Clave", description: "Reliquias ligadas al progreso, sellos y secretos ocultos." },
    keys: { name: "Llaves" },
    quest_relics: { name: "Reliquias de Misión" },
    runes: { name: "Runas y Sellos" },
  },
  ja: {
    weapons: { name: "武器", description: "戦いのために鍛えられた刃と武具。" },
    swords: { name: "剣" },
    axes: { name: "斧" },
    maces: { name: "メイス" },
    spears: { name: "槍" },
    staffs: { name: "杖・触媒" },
    armor: { name: "防具", description: "鋼、灰、呪いから身を守る装備。" },
    helms: { name: "兜" },
    chest: { name: "胴防具" },
    gauntlets: { name: "篭手" },
    greaves: { name: "脚防具" },
    consumables: { name: "消耗品", description: "単発で使う道具、薬剤、戦闘支援品。" },
    potions: { name: "ポーション" },
    bombs: { name: "爆弾" },
    resins: { name: "樹脂・強化" },
    key_items: { name: "重要アイテム", description: "進行、封印、隠された真実に関わる遺物。" },
    keys: { name: "鍵" },
    quest_relics: { name: "任務遺物" },
    runes: { name: "ルーン・封印" },
  },
};

// Item-specific content translations
const itemContentLocales: Record<Language, Record<string, { name: string; shortDescription: string; lorDescription: string; howToObtain: string }>> = {
  en: {
    "1": {
      name: "Blade of the Fallen",
      shortDescription: "A cursed greatsword that feeds on the souls of the defeated",
      lorDescription: "Forged from the souls of fallen warriors, this blade hungers for battle. Its edge never dulls, and it whispers dark promises to those who wield it.",
      howToObtain: "Defeat the Lord of Cinders in the Kiln of the First Flame",
    },
    "2": {
      name: "Oathsplitter Axe",
      shortDescription: "A two-handed axe built for brutal finishing blows",
      lorDescription: "A heavy executioner's axe once carried by frontier judges. Its edge is chipped by countless verdicts.",
      howToObtain: "Found in the Chapel of Broken Oaths",
    },
    "3": {
      name: "Penitent Mace",
      shortDescription: "A sanctified blunt weapon with crushing impact",
      lorDescription: "A ritual mace used in inquisitorial rites. Every dent carries a confession that was never written.",
      howToObtain: "Dropped by Cathedral Wardens",
    },
    "4": {
      name: "Ember Pike",
      shortDescription: "A reach weapon favored by ashland sentries",
      lorDescription: "A long pike tipped with emberglass that flares in the presence of corrupted blood.",
      howToObtain: "Purchased from the Pilgrim Quartermaster",
    },
    "5": {
      name: "Eclipsed Catalyst",
      shortDescription: "A staff-catalyst that amplifies dark sorceries",
      lorDescription: "A branch of black silver attuned to lunar rites and forbidden invocations.",
      howToObtain: "Reward for completing the Eclipse Covenant",
    },
    "6": {
      name: "Iron Vigil Helm",
      shortDescription: "Balanced helm with high slash resistance",
      lorDescription: "A closed helm worn by tower sentinels that watched in silence for decades.",
      howToObtain: "Looted from Vigil Sentinels",
    },
    "7": {
      name: "Knight's Ashen Cuirass",
      shortDescription: "Heavy chest armor with strong fire mitigation",
      lorDescription: "A breastplate darkened by soot that never washes away.",
      howToObtain: "Found in the Barracks Reliquary",
    },
    "8": {
      name: "Ashbound Gauntlets",
      shortDescription: "Reinforced gauntlets for close-quarters combat",
      lorDescription: "Layered gauntlets engraved with binding seals.",
      howToObtain: "Crafted by the Ironbound Artisan",
    },
    "9": {
      name: "Grave Greaves",
      shortDescription: "Sturdy leg protection with high poise",
      lorDescription: "Leg armor forged from reclaimed funerary steel.",
      howToObtain: "Dropped by Gravewatch Champions",
    },
    "10": {
      name: "Crimson Elixir",
      shortDescription: "Restores a large amount of health",
      lorDescription: "A mysterious red liquid that restores vitality. Its origins are unknown, but many believe it contains the essence of life itself.",
      howToObtain: "Crafted by alchemists or found in hidden chests",
    },
    "11": {
      name: "Cinder Bomb",
      shortDescription: "Explodes in a burst of ashfire",
      lorDescription: "A clay shell packed with ember powder and cursed fragments.",
      howToObtain: "Crafted at any field workbench",
    },
    "12": {
      name: "Nocturne Resin",
      shortDescription: "Temporarily buffs weapon damage with shadow",
      lorDescription: "A viscous black resin used to coat weapons with void-touched energy.",
      howToObtain: "Reward from the Veiled Alchemist",
    },
    "13": {
      name: "Seal Key of the Tower",
      shortDescription: "Unlocks sealed gates in the upper tower",
      lorDescription: "An archaic key engraved with seven lock sigils.",
      howToObtain: "Given by the Custodian after the third covenant",
    },
    "14": {
      name: "Relic of the Vow",
      shortDescription: "A quest artifact linked to the central covenant",
      lorDescription: "A relic that resonates with oaths sworn in blood and ash.",
      howToObtain: "Recovered from the Mirror Crypt",
    },
    "15": {
      name: "Tablet of Runes",
      shortDescription: "Contains decipherable runes needed for ancient seals",
      lorDescription: "A fractured tablet etched with migration runes and warding circles.",
      howToObtain: "Found in the Archive of Dust",
    },
  },
  es: {
    "1": {
      name: "Hoja del Caído",
      shortDescription: "Una espada maldita que se alimenta de las almas de los derrotados",
      lorDescription: "Forjada con las almas de guerreros caídos, esta hoja ansía la batalla. Su filo nunca se desafila, y susurra oscuras promesas a quienes la empuñan.",
      howToObtain: "Derrota al Señor de las Cenizas en el Horno de la Primera Llama",
    },
    "2": {
      name: "Hacha Rompe-Juramentos",
      shortDescription: "Un hacha a dos manos diseñada para golpes finales brutales",
      lorDescription: "Un pesado hacha de verdugo portada antaño por jueces de frontera. Su filo está mellado por incontables veredictos.",
      howToObtain: "Hallada en la Capilla de Juramentos Rotos",
    },
    "3": {
      name: "Maza del Penitente",
      shortDescription: "Un arma contundente santificada de impacto demoledor",
      lorDescription: "Una maza ritual utilizada en ritos inquisitoriales. Cada abolladura porta una confesión nunca escrita.",
      howToObtain: "Soltada por Guardianes de Catedral",
    },
    "4": {
      name: "Pica de Ascuas",
      shortDescription: "Un arma de alcance preferida por centinelas de las tierras ceniza",
      lorDescription: "Una larga pica con punta de cristal ascua que destella ante sangre corrupta.",
      howToObtain: "Comprada al Intendente Peregrino",
    },
    "5": {
      name: "Catalizador Eclipsado",
      shortDescription: "Un báculo-catalizador que amplifica hechicerías oscuras",
      lorDescription: "Una rama de plata negra sintonizada con ritos lunares e invocaciones prohibidas.",
      howToObtain: "Recompensa por completar el Pacto del Eclipse",
    },
    "6": {
      name: "Yelmo de Hierro Vigía",
      shortDescription: "Yelmo equilibrado con alta resistencia al corte",
      lorDescription: "Un yelmo cerrado portado por centinelas de torre que vigilaron en silencio durante décadas.",
      howToObtain: "Saqueado de Centinelas Vigías",
    },
    "7": {
      name: "Coraza Ceniza del Caballero",
      shortDescription: "Armadura de pecho pesada con fuerte mitigación al fuego",
      lorDescription: "Un peto ennegrecido por hollín que nunca se lava.",
      howToObtain: "Hallada en el Relicario del Cuartel",
    },
    "8": {
      name: "Guanteletes Atados a Ceniza",
      shortDescription: "Guanteletes reforzados para combate cuerpo a cuerpo",
      lorDescription: "Guanteletes estratificados grabados con sellos vinculantes.",
      howToObtain: "Forjados por el Artesano Forjahierro",
    },
    "9": {
      name: "Grebas de Tumba",
      shortDescription: "Protección de piernas robusta con alto equilibrio",
      lorDescription: "Armadura de piernas forjada con acero funerario recuperado.",
      howToObtain: "Soltada por Campeones Guardatumbas",
    },
    "10": {
      name: "Elixir Carmesí",
      shortDescription: "Restaura una gran cantidad de salud",
      lorDescription: "Un misterioso líquido rojo que restaura vitalidad. Sus orígenes son desconocidos, pero muchos creen que contiene la esencia de la vida misma.",
      howToObtain: "Fabricado por alquimistas o hallado en cofres ocultos",
    },
    "11": {
      name: "Bomba de Ceniza",
      shortDescription: "Explota en una ráfaga de fuego-ceniza",
      lorDescription: "Una vasija de arcilla rellena con polvo ascua y fragmentos malditos.",
      howToObtain: "Fabricada en cualquier banco de campo",
    },
    "12": {
      name: "Resina Nocturna",
      shortDescription: "Mejora temporalmente el daño del arma con sombra",
      lorDescription: "Una resina negra viscosa utilizada para recubrir armas con energía tocada por el vacío.",
      howToObtain: "Recompensa del Alquimista Velado",
    },
    "13": {
      name: "Llave Sello de la Torre",
      shortDescription: "Desbloquea puertas selladas en la torre superior",
      lorDescription: "Una llave arcaica grabada con siete sigilos de cerradura.",
      howToObtain: "Otorgada por la Custodia tras el tercer pacto",
    },
    "14": {
      name: "Reliquia del Voto",
      shortDescription: "Un artefacto de misión vinculado al pacto central",
      lorDescription: "Una reliquia que resuena con juramentos jurados en sangre y ceniza.",
      howToObtain: "Recuperada de la Cripta Espejo",
    },
    "15": {
      name: "Tablilla de Runas",
      shortDescription: "Contiene runas descifrables necesarias para sellos ancestrales",
      lorDescription: "Una tablilla fracturada grabada con runas migratorias y círculos protectores.",
      howToObtain: "Hallada en el Archivo del Polvo",
    },
  },
  ja: {
    "1": {
      name: "堕ちし者の剣",
      shortDescription: "敗者の魂を喰らう呪われた大剣",
      lorDescription: "戦死者の魂より鍛えられた刃は、戦いを渇望する。その刃は決して鈍らず、使い手に暗黒の約束を囁く。",
      howToObtain: "最初の炎の炉にて、灰の王を倒す",
    },
    "2": {
      name: "誓破りの斧",
      shortDescription: "残虐な止めの一撃のための両手斧",
      lorDescription: "辺境の裁定者が携えた重厚な処刑斧。幾多の裁きにより刃は欠けている。",
      howToObtain: "破られた誓いの礼拝堂で発見",
    },
    "3": {
      name: "贖罪の鈍器",
      shortDescription: "粉砕力を持つ聖別された打撃武器",
      lorDescription: "異端審問の儀式に用いられた鈍器。刻まれた凹みは書かれなかった告白を宿す。",
      howToObtain: "大聖堂の守護兵がドロップ",
    },
    "4": {
      name: "灰焼の長槍",
      shortDescription: "灰の地の歩哨が好む間合い武器",
      lorDescription: "焼燃硝子の穂先を持つ長槍。穢れた血に触れると煌めく。",
      howToObtain: "巡礼補給官から購入",
    },
    "5": {
      name: "蝕月の触媒",
      shortDescription: "暗黒魔術を増幅する杖型触媒",
      lorDescription: "月の儀式と禁忌の召喚に調律された黒銀の枝。",
      howToObtain: "蝕の盟約完了の報酬",
    },
    "6": {
      name: "鉄守の兜",
      shortDescription: "高斬撃耐性を持つバランス型兜",
      lorDescription: "数十年沈黙のうちに監視し続けた塔の歩哨が被った閉鎖型兜。",
      howToObtain: "守護歩哨から略奪",
    },
    "7": {
      name: "騎士の燼胴鎧",
      shortDescription: "高炎軽減を持つ重装胸鎧",
      lorDescription: "決して洗い流されぬ煤に黒く染まった胸甲。",
      howToObtain: "兵舎聖遺物室で発見",
    },
    "8": {
      name: "灰縛の篭手",
      shortDescription: "近接戦闘向けの強化篭手",
      lorDescription: "拘束の刻印が彫られた重層篭手。",
      howToObtain: "鍛鉄工匠で製作",
    },
    "9": {
      name: "墓所の脛当",
      shortDescription: "高ポイズ値を持つ堅牢な脚部防具",
      lorDescription: "葬祭用鋼を再利用して鍛造された脚鎧。",
      howToObtain: "墓守闘士がドロップ",
    },
    "10": {
      name: "紅玉霊薬",
      shortDescription: "大量の体力を回復する",
      lorDescription: "生命力を回復する謎の赤い液体。その起源は不明だが、生命の精髄を含むと信じられている。",
      howToObtain: "錬金術師が調合、または隠し宝箱で発見",
    },
    "11": {
      name: "燼火爆弾",
      shortDescription: "灰炎の爆発を引き起こす",
      lorDescription: "焼燃粉と呪われた破片を詰めた陶製の殻。",
      howToObtain: "任意の野営作業台で製作",
    },
    "12": {
      name: "夜闇の樹脂",
      shortDescription: "一時的に武器に影のダメージ強化を付与",
      lorDescription: "虚無の力を宿す黒い粘性樹脂。武器に塗布して用いる。",
      howToObtain: "隠れし錬金術師からの報酬",
    },
    "13": {
      name: "塔の封印鍵",
      shortDescription: "塔の上層の封鎖門を開く",
      lorDescription: "七つの錠前刻印が刻まれた古代の鍵。",
      howToObtain: "第三の盟約後に管理人から授かる",
    },
    "14": {
      name: "誓約の遺物",
      shortDescription: "中心盟約に紐づく任務の遺物",
      lorDescription: "血と灰で交わされた誓いに共鳴する聖遺物。",
      howToObtain: "鏡の地下墓所で回収",
    },
    "15": {
      name: "ルーンの石板",
      shortDescription: "古代の封印に必要な解読可能ルーンを含む",
      lorDescription: "移動ルーンと防御円が刻まれた破損した石板。",
      howToObtain: "塵の記録庫で発見",
    },
  },
};

export function getItemsCopy(lang: Language) {
  return itemsCopy[lang];
}

export function getItemCategoryName(lang: Language, categoryId: string, fallback: string) {
  return itemCategoryLocales[lang][categoryId]?.name ?? fallback;
}

export function getItemCategoryDescription(lang: Language, categoryId: string, fallback?: string) {
  return itemCategoryLocales[lang][categoryId]?.description ?? fallback;
}

export function getItemContent(lang: Language, itemId: string) {
  return itemContentLocales[lang][itemId];
}

const beastDetailCopy = {
  en: {
    labels: {
      sheet: "Species Sheet",
      loot: "Loot",
      type: "Type",
      location: "Location",
      description: "Description",
      notes: "Notes",
      notesPlaceholder: "Excerpt from the Sorcerer's journal on this creature and its behavior in combat.",
      weaknesses: "Weaknesses",
      resistances: "Resistances",
      rarity: "Rarity",
      dropRate: "Drop Rate",
      abilities: "Abilities",
      visual: "Visual",
      noImage: "No image",
      stats: "Stats",
      howToObtain: "How to Obtain",
    },
  },
  es: {
    labels: {
      sheet: "Ficha",
      loot: "Botín",
      type: "Tipo",
      location: "Ubicación",
      description: "Descripción",
      notes: "Notas",
      notesPlaceholder: "Fragmento del diario del Hechicero sobre esta criatura y su comportamiento en combate.",
      weaknesses: "Debilidades",
      resistances: "Resistencias",
      rarity: "Rareza",
      dropRate: "Probabilidad",
      abilities: "Habilidades",
      visual: "Visual",
      noImage: "Sin imagen",
      stats: "Estadísticas",
      howToObtain: "Cómo Obtener",
    },
  },
  ja: {
    labels: {
      sheet: "種族シート",
      loot: "戦利品",
      type: "タイプ",
      location: "場所",
      description: "説明",
      notes: "メモ",
      notesPlaceholder: "この魔物と戦闘時の挙動に関する、魔術師の日誌の抜粋。",
      weaknesses: "弱点",
      resistances: "耐性",
      rarity: "レアリティ",
      dropRate: "ドロップ率",
      abilities: "能力",
      visual: "表示",
      noImage: "画像なし",
      stats: "ステータス",
      howToObtain: "入手方法",
    },
  },
} as const;

export function getBeastDetailCopy(lang: Language) {
  return beastDetailCopy[lang];
}
