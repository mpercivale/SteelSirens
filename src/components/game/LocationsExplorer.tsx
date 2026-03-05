
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locacion } from "@/types/game";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/i18n";
import {
  DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY,
  DISCOVERED_ITEM_SLUGS_STORAGE_KEY,
  GAME_FLAGS_STORAGE_KEY,
  LOCATION_SECRET_PROGRESS_STORAGE_KEY,
  getDiscoveredCharacterSlugs,
  getDiscoveredItemSlugs,
  getGameFlags,
  getLocationSecretProgress,
  markCharacterDiscovered,
  markItemDiscovered,
} from "@/lib/progression";

interface Props {
  locations: Locacion[];
  lang?: Language;
}

const tipos = [
  { id: "all", label: "All" },
  { id: "region", label: "Regions" },
  { id: "secreto", label: "Secrets" },
];

type MainNode = {
  id: string;
  name: string;
  tipo: "region" | "mazmorra" | "secreto";
  x: number;
  y: number;
};

type EdgeCurve = {
  from: string;
  to: string;
  start: { x: number; y: number };
  control1: { x: number; y: number };
  control2: { x: number; y: number };
  end: { x: number; y: number };
  pathD: string;
  isSecretEdge: boolean;
};

type PopupHotspot = {
  id: string;
  x: number;
  y: number;
  type: "item" | "relic" | "explore" | "event" | "character";
  actionEs: string;
  actionEn: string;
  actionJa: string;
  characterSlug?: string;
  unlockItemSlug?: string;
  sceneImageSrc?: string;
  uniqueEventId?: string;
  eventTextEs?: string;
  eventTextEn?: string;
  eventTextJa?: string;
};

type PopupDialogueOption = {
  id: string;
  labelEs: string;
  labelEn: string;
  labelJa: string;
  nextLineId: string;
};

type PopupDialogueLine = {
  id: string;
  speakerSlug?: string;
  speakerNameEs?: string;
  speakerNameEn?: string;
  speakerNameJa?: string;
  textEs: string;
  textEn: string;
  textJa: string;
  nextLineId?: string;
  options?: PopupDialogueOption[];
};

type PopupDialogueScript = {
  startLineId: string;
  participantSlugs: string[];
  linesById: Record<string, PopupDialogueLine>;
};

type PopupDialogueDefinition = {
  initial: PopupDialogueScript;
  repeat?: PopupDialogueScript;
};

type UnlockRule = {
  requiresAllItems?: string[];
  requiresAnyItem?: string[];
  requiresAllCharacters?: string[];
  requiresAnyCharacter?: string[];
  requiresAllFlags?: string[];
  requiresAnyFlag?: string[];
  requiresSecrets?: Record<string, number>;
  anyOf?: UnlockRule[];
};

const CHARACTER_PORTRAIT_BY_SLUG: Record<string, string> = {
  "el-perro": "/images/bestiary/el-perro.png",
  "el-escudero": "/images/bestiary/el-escudero.png",
  "el-juez": "/images/bestiary/el-juez.png",
  "el-hechicero": "/images/maps/elden-ring-placeholder.png",
  heraldo: "/images/maps/elden-ring-placeholder.png",
  custodia: "/images/maps/elden-ring-placeholder.png",
  sacerdote: "/images/maps/elden-ring-placeholder.png",
  reclutador: "/images/maps/elden-ring-placeholder.png",
  padre: "/images/maps/elden-ring-placeholder.png",
};

const POPUP_DIALOGUE_BY_HOTSPOT_ID: Partial<Record<string, PopupDialogueDefinition>> = {
  "holy-see-speak-acolyte-gate": {
    initial: {
      startLineId: "gate-01",
      participantSlugs: ["custodia"],
      linesById: {
        "gate-01": {
          id: "gate-01",
          speakerSlug: "custodia",
          speakerNameEs: "Acólito de la Puerta",
          speakerNameEn: "Gate Acolyte",
          speakerNameJa: "門の侍祭",
          textEs: "No deberías estar aquí a estas horas. Bajo la muralla suenan campanas que nadie bendijo.",
          textEn: "You shouldn't be here at this hour. Bells ring beneath the wall that no one has ever blessed.",
          textJa: "こんな時間にここへ来るべきではない。外壁の下で、誰も祝福していない鐘が鳴るんだ。",
          options: [
            {
              id: "gate-opt-1",
              labelEs: "¿Campanas bajo tierra?",
              labelEn: "Bells underground?",
              labelJa: "地下の鐘？",
              nextLineId: "gate-02",
            },
            {
              id: "gate-opt-2",
              labelEs: "¿Quién te ordenó callar?",
              labelEn: "Who told you to stay quiet?",
              labelJa: "誰に口止めされた？",
              nextLineId: "gate-03",
            },
          ],
        },
        "gate-02": {
          id: "gate-02",
          speakerSlug: "custodia",
          speakerNameEs: "Acólito de la Puerta",
          speakerNameEn: "Gate Acolyte",
          speakerNameJa: "門の侍祭",
          textEs: "Sí. Marcan una hora antigua, la de los juramentos del pozo. Si las oyes, no sigas el sonido.",
          textEn: "Yes. They ring an ancient hour, from the well-oaths. If you hear them, do not follow the sound.",
          textJa: "ああ。井戸の誓約の古い時刻を刻んでいる。聞こえても、音を追うな。",
        },
        "gate-03": {
          id: "gate-03",
          speakerSlug: "custodia",
          speakerNameEs: "Acólito de la Puerta",
          speakerNameEn: "Gate Acolyte",
          speakerNameJa: "門の侍祭",
          textEs: "Nadie lo ordenó. Basta ver las grietas del brocal para entender por qué seguimos vivos.",
          textEn: "No one had to. Seeing the fissures in the well rim is enough to understand why we're still alive.",
          textJa: "誰にも命じられていない。井戸口の亀裂を見れば、なぜ生き延びているか分かる。",
        },
      },
    },
    repeat: {
      startLineId: "gate-r1",
      participantSlugs: ["custodia"],
      linesById: {
        "gate-r1": {
          id: "gate-r1",
          speakerSlug: "custodia",
          speakerNameEs: "Acólito de la Puerta",
          speakerNameEn: "Gate Acolyte",
          speakerNameJa: "門の侍祭",
          textEs: "Otra vez tú. Si vuelves a oír campanas bajo piedra, aléjate del brocal.",
          textEn: "You again. If you hear bells under stone, stay away from the well rim.",
          textJa: "また君か。石の下の鐘が聞こえたら、井戸口に近づくな。",
        },
      },
    },
  },
  "holy-see-speak-veteran-courtyard": {
    initial: {
      startLineId: "yard-01",
      participantSlugs: ["el-juez"],
      linesById: {
        "yard-01": {
          id: "yard-01",
          speakerSlug: "el-juez",
          speakerNameEs: "Custodio Veterano",
          speakerNameEn: "Veteran Warden",
          speakerNameJa: "古参の番人",
          textEs: "Serví cuando sellaron el brocal. Lo que subió aquella noche no debía tener nombre.",
          textEn: "I served when the shaft was sealed. What rose that night should never have had a name.",
          textJa: "井戸口を封じた夜に私はいた。あの夜に這い上がったものに、名など与えるべきではなかった。",
          options: [
            {
              id: "yard-opt-1",
              labelEs: "¿Por qué no destruirlo?",
              labelEn: "Why not destroy it?",
              labelJa: "なぜ破壊しなかった？",
              nextLineId: "yard-02",
            },
            {
              id: "yard-opt-2",
              labelEs: "¿Quién guarda la llave del sello?",
              labelEn: "Who keeps the seal key?",
              labelJa: "封印の鍵は誰が持っている？",
              nextLineId: "yard-03",
            },
          ],
        },
        "yard-02": {
          id: "yard-02",
          speakerSlug: "el-juez",
          speakerNameEs: "Custodio Veterano",
          speakerNameEn: "Veteran Warden",
          speakerNameJa: "古参の番人",
          textEs: "Porque no es piedra ni carne. Es memoria viva. Solo puedes contenerla.",
          textEn: "Because it is neither stone nor flesh. It is living memory. You can only contain it.",
          textJa: "あれは石でも肉でもない。生きた記憶だ。封じることしかできない。",
        },
        "yard-03": {
          id: "yard-03",
          speakerSlug: "el-juez",
          speakerNameEs: "Custodio Veterano",
          speakerNameEn: "Veteran Warden",
          speakerNameJa: "古参の番人",
          textEs: "Tres manos, tres llaves. Archivo, Sacristía y Sala del Juramento. Ninguna duerme en paz.",
          textEn: "Three hands, three keys. Archive, Sacristy, and Oath Hall. None of them sleep easy.",
          textJa: "三つの手、三つの鍵。文書庫、祭具室、誓約の間。誰一人、安眠していない。",
        },
      },
    },
    repeat: {
      startLineId: "yard-r1",
      participantSlugs: ["el-juez"],
      linesById: {
        "yard-r1": {
          id: "yard-r1",
          speakerSlug: "el-juez",
          speakerNameEs: "Custodio Veterano",
          speakerNameEn: "Veteran Warden",
          speakerNameJa: "古参の番人",
          textEs: "Mantén los ojos en las manos del clero, no en sus palabras.",
          textEn: "Keep your eyes on the clergy's hands, not their words.",
          textJa: "聖職者の言葉ではなく、手元を見ろ。",
        },
      },
    },
  },
  "holy-see-event-judge-appointment": {
    initial: {
      startLineId: "judge-event-01",
      participantSlugs: ["heraldo", "el-juez"],
      linesById: {
        "judge-event-01": {
          id: "judge-event-01",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Te acercas en silencio. La nave está en penumbra y el altar cubre el brocal sellado.",
          textEn: "You approach in silence. The nave is dim, and the altar covers the sealed well-rim.",
          textJa: "静かに近づく。身廊は薄暗く、祭壇が封じられた井戸口を覆っている。",
          nextLineId: "judge-event-02",
        },
        "judge-event-02": {
          id: "judge-event-02",
          speakerSlug: "heraldo",
          speakerNameEs: "Heraldo",
          speakerNameEn: "Herald",
          speakerNameJa: "伝令官",
          textEs: "Ante la asamblea, declaramos el nombramiento del nuevo Juez de la Santa Sede.",
          textEn: "Before the assembly, we declare the appointment of the new Judge of the Holy See.",
          textJa: "集会の前で、聖座の新たな裁き手の任命を宣言する。",
          nextLineId: "judge-event-03",
        },
        "judge-event-03": {
          id: "judge-event-03",
          speakerSlug: "el-juez",
          speakerNameEs: "El Juez",
          speakerNameEn: "The Judge",
          speakerNameJa: "裁き手",
          textEs: "Juro custodiar este sello y condenar a quien quiera abrir lo que duerme bajo nosotros.",
          textEn: "I swear to guard this seal and condemn those who seek to open what sleeps beneath us.",
          textJa: "この封印を守り、我らの下で眠るものを開こうとする者を断罪することを誓う。",
          nextLineId: "judge-event-04",
        },
        "judge-event-04": {
          id: "judge-event-04",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "La asamblea responde al unísono. Percibes, bajo los cánticos, un latido ajeno bajo piedra.",
          textEn: "The assembly answers in unison. Beneath the chants, you sense a foreign pulse under stone.",
          textJa: "集会が声を揃えて応じる。詠唱の底で、石の下に異質な鼓動を感じる。",
        },
      },
    },
    repeat: {
      startLineId: "judge-event-r1",
      participantSlugs: ["heraldo", "el-juez"],
      linesById: {
        "judge-event-r1": {
          id: "judge-event-r1",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "El eco del juramento persiste en la nave: obediencia arriba, hambre contenida abajo.",
          textEn: "The oath still echoes through the nave: obedience above, hunger contained below.",
          textJa: "誓約の残響が身廊に残る。上では服従、下では飢えが封じられている。",
        },
      },
    },
  },
  "holy-see-whisper-priests-cloister": {
    initial: {
      startLineId: "whisper-01",
      participantSlugs: ["sacerdote"],
      linesById: {
        "whisper-01": {
          id: "whisper-01",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Ves a dos sacerdotes cuchicheando junto al claustro. Puedes intentar obtener información sin delatarte.",
          textEn: "You spot two priests whispering by the cloister. You can try to gather information without exposing yourself.",
          textJa: "回廊のそばで司祭二人が囁いている。気づかれずに情報を得ることができそうだ。",
          options: [
            {
              id: "whisper-opt-1",
              labelEs: "Acercarte sin hacer ruido",
              labelEn: "Approach quietly",
              labelJa: "音を立てず近づく",
              nextLineId: "whisper-02",
            },
            {
              id: "whisper-opt-2",
              labelEs: "Quedarte en la sombra y escuchar",
              labelEn: "Stay in the shadows and listen",
              labelJa: "影に留まって聞く",
              nextLineId: "whisper-03",
            },
            {
              id: "whisper-opt-3",
              labelEs: "Interrumpirlos y preguntar de frente",
              labelEn: "Interrupt and ask directly",
              labelJa: "遮って正面から尋ねる",
              nextLineId: "whisper-04",
            },
          ],
        },
        "whisper-02": {
          id: "whisper-02",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Te pegas al muro y alcanzas a oír: “la ciudad bajo el pozo nos dio conocimiento, luego hambre”.",
          textEn: "You press against the wall and catch: 'the city under the well gave us knowledge, then hunger.'",
          textJa: "壁に身を寄せると聞こえる。「井戸の下の都市は知識を与え、その後に飢えをもたらした」。",
        },
        "whisper-03": {
          id: "whisper-03",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Desde la penumbra distingues otra frase: “si el sello cae, las plegarias volverán con otra boca”.",
          textEn: "From the dim corner you catch another phrase: 'if the seal falls, prayers will return through another mouth.'",
          textJa: "薄闇からさらに聞こえる。「封印が落ちれば、祈りは別の口から返ってくる」。",
        },
        "whisper-04": {
          id: "whisper-04",
          speakerSlug: "sacerdote",
          speakerNameEs: "Sacerdote Susurrante",
          speakerNameEn: "Whispering Priest",
          speakerNameJa: "囁く司祭",
          textEs: "No preguntes alto en estos muros. El pozo escucha mejor que nosotros.",
          textEn: "Do not ask loudly in these walls. The well listens better than we do.",
          textJa: "この壁の中で大声で問うな。井戸は我らよりよく聞いている。",
        },
      },
    },
    repeat: {
      startLineId: "whisper-r1",
      participantSlugs: ["sacerdote"],
      linesById: {
        "whisper-r1": {
          id: "whisper-r1",
          speakerNameEs: "Acción",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Regresas al claustro. Solo queda un eco: “no nombres lo que duerme en el fondo”.",
          textEn: "You return to the cloister. Only an echo remains: 'do not name what sleeps below.'",
          textJa: "回廊に戻ると、残っていたのは残響だけだった。「底で眠るものに名を与えるな」。",
        },
      },
    },
  },
  "holy-see-speak-dog-cart": {
    initial: {
      startLineId: "dog-01",
      participantSlugs: ["el-perro", "custodia"],
      linesById: {
        "dog-01": {
          id: "dog-01",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Bajan al Perro de la carreta, aun encadenado. Discute con un guardia sin perder la sonrisa.",
          textEn: "They pull the Dog down from the prison cart, still chained. He argues with a guard without losing his smile.",
          textJa: "鎖に繋がれたまま、犬男が囚人車から引きずり下ろされる。笑みを消さず衛兵と口論している。",
          options: [
            {
              id: "dog-opt-1",
              labelEs: "Hablar con el guardia",
              labelEn: "Talk to the guard",
              labelJa: "衛兵に話しかける",
              nextLineId: "dog-02",
            },
            {
              id: "dog-opt-2",
              labelEs: "Observar al Perro en silencio",
              labelEn: "Observe the Dog in silence",
              labelJa: "犬男を黙って観察する",
              nextLineId: "dog-03",
            },
          ],
        },
        "dog-02": {
          id: "dog-02",
          speakerSlug: "custodia",
          speakerNameEs: "Guardia",
          speakerNameEn: "Guard",
          speakerNameJa: "衛兵",
          textEs: "Este bastardo robo y mato. Ahora servira de algo en la expedicion.",
          textEn: "This bastard stole and killed. At least he'll be useful in the expedition now.",
          textJa: "この野郎は盗みも殺しもやった。せめて遠征で役に立ってもらう。",
        },
        "dog-03": {
          id: "dog-03",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "El Perro aparenta calma. Demasiada calma para alguien con grilletes en las manos.",
          textEn: "The Dog looks calm. Far too calm for someone with irons on his wrists.",
          textJa: "犬男は落ち着き払っている。手枷をはめられた者にしては、あまりにも。",
        },
      },
    },
    repeat: {
      startLineId: "dog-r1",
      participantSlugs: ["el-perro"],
      linesById: {
        "dog-r1": {
          id: "dog-r1",
          speakerSlug: "el-perro",
          speakerNameEs: "El Perro",
          speakerNameEn: "The Dog",
          speakerNameJa: "犬男",
          textEs: "No mires las cadenas. Mira quien sostiene la llave.",
          textEn: "Don't look at the chains. Look at who holds the key.",
          textJa: "鎖を見るな。鍵を持つ手を見ろ。",
        },
      },
    },
  },
  "holy-see-speak-recruiter-table": {
    initial: {
      startLineId: "recruit-01",
      participantSlugs: ["reclutador"],
      linesById: {
        "recruit-01": {
          id: "recruit-01",
          speakerSlug: "reclutador",
          speakerNameEs: "Soldado Reclutador",
          speakerNameEn: "Recruiting Soldier",
          speakerNameJa: "徴募兵",
          textEs: "La caravana parte al toque de campanas. Necesitamos brazos, no preguntas.",
          textEn: "The caravan leaves at bell toll. We need hands, not questions.",
          textJa: "鐘が鳴れば隊商は出る。必要なのは疑問ではなく働き手だ。",
          options: [
            {
              id: "recruit-opt-1",
              labelEs: "Pedir mas detalles",
              labelEn: "Ask for details",
              labelJa: "詳細を聞く",
              nextLineId: "recruit-02",
            },
            {
              id: "recruit-opt-2",
              labelEs: "Presionarlo sobre el objetivo real",
              labelEn: "Press about the real objective",
              labelJa: "本当の目的を問い詰める",
              nextLineId: "recruit-03",
            },
          ],
        },
        "recruit-02": {
          id: "recruit-02",
          speakerSlug: "reclutador",
          speakerNameEs: "Soldado Reclutador",
          speakerNameEn: "Recruiting Soldier",
          speakerNameJa: "徴募兵",
          textEs: "Ruta norte, terreno maldito, pocas provisiones. Quien se quede atras no vuelve.",
          textEn: "North route, cursed terrain, thin supplies. Whoever falls behind won't return.",
          textJa: "北路、呪われた地、乏しい補給。遅れた者は帰れない。",
        },
        "recruit-03": {
          id: "recruit-03",
          speakerSlug: "reclutador",
          speakerNameEs: "Soldado Reclutador",
          speakerNameEn: "Recruiting Soldier",
          speakerNameJa: "徴募兵",
          textEs: "Si tanto quieres saber: no es expedicion... es purga.",
          textEn: "If you really want to know: this isn't an expedition... it's a purge.",
          textJa: "そんなに知りたいなら教える。これは遠征じゃない…粛清だ。",
        },
      },
    },
  },
  "holy-see-speak-hechicero-side-yard": {
    initial: {
      startLineId: "mage-01",
      participantSlugs: ["el-hechicero", "sacerdote"],
      linesById: {
        "mage-01": {
          id: "mage-01",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Desde el patio lateral ves al Hechicero recibiendo permisos sellados de un clerigo.",
          textEn: "From the side yard you see the Sorcerer receiving sealed permits from a cleric.",
          textJa: "側庭で、魔術師が聖職者から封印文書を受け取るのが見える。",
          options: [
            {
              id: "mage-opt-1",
              labelEs: "Escuchar escondido",
              labelEn: "Eavesdrop from hiding",
              labelJa: "隠れて盗み聞く",
              nextLineId: "mage-02",
            },
            {
              id: "mage-opt-2",
              labelEs: "Acercarte sin ocultarte",
              labelEn: "Approach openly",
              labelJa: "隠れず近づく",
              nextLineId: "mage-03",
            },
          ],
        },
        "mage-02": {
          id: "mage-02",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Al oir de cerca, notas que el sello de autorizacion no coincide con el del obispado.",
          textEn: "Listening closely, you notice the authorization seal does not match the bishopric's mark.",
          textJa: "近くで聞くと、許可印が司教区の正式印と一致していないことに気づく。",
        },
        "mage-03": {
          id: "mage-03",
          speakerSlug: "el-hechicero",
          speakerNameEs: "El Hechicero",
          speakerNameEn: "The Sorcerer",
          speakerNameJa: "魔術師",
          textEs: "Llegas tarde. Las preguntas correctas se hacen antes de abrir una tumba.",
          textEn: "You're late. The right questions are asked before opening a tomb.",
          textJa: "遅かったな。正しい問いは、墓を開く前にするものだ。",
        },
      },
    },
  },
  "holy-see-event-child-father-wall": {
    initial: {
      startLineId: "wall-01",
      participantSlugs: ["padre"],
      linesById: {
        "wall-01": {
          id: "wall-01",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Junto al muro exterior, un padre abraza a su hijo mientras intenta ocultar una tos de sangre.",
          textEn: "By the outer wall, a father hugs his son while trying to hide a bloody cough.",
          textJa: "外壁のそばで、父親が血の混じる咳を隠しながら子を抱きしめている。",
          nextLineId: "wall-02",
        },
        "wall-02": {
          id: "wall-02",
          speakerNameEs: "Accion",
          speakerNameEn: "Action",
          speakerNameJa: "行動",
          textEs: "Cuando se marchan, queda un medallon familiar en el suelo.",
          textEn: "When they leave, a family medallion remains on the ground.",
          textJa: "二人が去った後、地面には家族のメダリオンだけが残っていた。",
        },
      },
    },
  },
};

const POPUP_HOTSPOTS_BY_NODE_ID: Record<string, PopupHotspot[]> = {
  "03-00": [
    {
      id: "holy-see-speak-acolyte-gate",
      x: 24,
      y: 70,
      type: "character",
      characterSlug: "custodia",
      actionEs: "Hablar con acólito en la puerta",
      actionEn: "Speak with gate acolyte",
      actionJa: "門の侍祭に話しかける",
      sceneImageSrc: "/images/maps/santa-sede/acolyte-gate.png",
      uniqueEventId: "event_holy_see_gate_acolyte",
      eventTextEs: "El acólito susurra que en la muralla exterior se oyen campanas bajo piedra, aunque nadie toca los bronces del templo.",
      eventTextEn: "The acolyte whispers that bells ring beneath the outer wall, though no one touches the temple bronzes.",
      eventTextJa: "侍祭は、神殿の鐘に触れていないのに外壁の下から鐘の音が響くと囁く。",
    },
    {
      id: "holy-see-speak-veteran-courtyard",
      x: 64,
      y: 67,
      type: "character",
      characterSlug: "el-juez",
      actionEs: "Hablar con custodio del patio",
      actionEn: "Speak with courtyard warden",
      actionJa: "中庭の番人に話しかける",
      sceneImageSrc: "/images/maps/santa-sede/veteran-courtyard.png",
      uniqueEventId: "event_holy_see_courtyard_warden",
      eventTextEs: "El custodio confirma que el brocal bajo la Santa Sede fue sellado tras una noche de cánticos sin lengua humana.",
      eventTextEn: "The warden confirms the shaft beneath the Holy See was sealed after a night of chants in no human tongue.",
      eventTextJa: "番人は、聖座の下の井戸口が人の言葉ではない詠唱の夜の後に封じられたと認める。",
    },
    {
      id: "holy-see-speak-dog-cart",
      x: 74,
      y: 78,
      type: "character",
      characterSlug: "el-perro",
      actionEs: "Observar la carreta de prisioneros",
      actionEn: "Inspect the prisoner cart",
      actionJa: "囚人車を調べる",
      sceneImageSrc: "/images/maps/santa-sede/dog-prison-cart.png",
      uniqueEventId: "event_holy_see_dog_cart",
      eventTextEs: "Has visto bajar al Perro de la carreta: encadenado, pero extrañamente sereno.",
      eventTextEn: "You watch the Dog hauled from the cart: chained, yet strangely calm.",
      eventTextJa: "犬男が囚人車から降ろされるのを見た。鎖に繋がれながら、不気味なほど落ち着いていた。",
    },
    {
      id: "holy-see-speak-recruiter-table",
      x: 52,
      y: 62,
      type: "character",
      characterSlug: "reclutador",
      actionEs: "Hablar con soldado reclutador",
      actionEn: "Talk to recruiting soldier",
      actionJa: "徴募兵に話しかける",
      sceneImageSrc: "/images/maps/elden-ring-placeholder.png",
      uniqueEventId: "event_holy_see_recruiter_table",
      eventTextEs: "El reclutador confirma la salida inminente: campanas, caravanas y una mision que llama purga.",
      eventTextEn: "The recruiter confirms imminent departure: bells, caravans, and a mission he calls a purge.",
      eventTextJa: "徴募兵は出発が迫っていると告げる。鐘、隊商、そして彼が『粛清』と呼ぶ任務。",
    },
    {
      id: "holy-see-speak-hechicero-side-yard",
      x: 78,
      y: 52,
      type: "character",
      characterSlug: "el-hechicero",
      actionEs: "Espiar al Hechicero en el patio lateral",
      actionEn: "Spy on the Sorcerer in the side yard",
      actionJa: "側庭の魔術師を探る",
      sceneImageSrc: "/images/maps/elden-ring-placeholder.png",
      uniqueEventId: "event_holy_see_hechicero_side_yard",
      eventTextEs: "Has visto al Hechicero recibir permisos sellados; algo en el sello no coincide con la version oficial.",
      eventTextEn: "You saw the Sorcerer receive sealed permits; something in that seal does not match the official story.",
      eventTextJa: "魔術師が封印文書を受け取るのを見た。その印は公式説明と一致しない。",
    },
    {
      id: "holy-see-event-child-father-wall",
      x: 12,
      y: 64,
      type: "event",
      actionEs: "Observar al nino y su padre junto al muro",
      actionEn: "Observe the child and father by the wall",
      actionJa: "壁際の父子を見守る",
      sceneImageSrc: "/images/maps/santa-sede/child-father-wall.png",
      uniqueEventId: "event_holy_see_child_father_wall",
      eventTextEs: "Has presenciado la escena del padre enfermo y su hijo; el medallon que dejaron parece importante.",
      eventTextEn: "You witness the sick father and his child; the medallion they leave behind may matter later.",
      eventTextJa: "病んだ父と子の場面を目撃した。残されたメダリオンは後で意味を持つかもしれない。",
    },
    {
      id: "holy-see-explore-outer-wall",
      x: 86,
      y: 58,
      type: "explore",
      actionEs: "Explorar la muralla exterior",
      actionEn: "Explore the outer wall",
      actionJa: "外壁を探索する",
      sceneImageSrc: "/images/maps/santa-sede/outer-wall.png",
    },
    {
      id: "holy-see-explore-sunken-road",
      x: 13,
      y: 83,
      type: "explore",
      actionEs: "Explorar camino hundido al pozo",
      actionEn: "Explore the sunken road to the well",
      actionJa: "井戸へ続く沈んだ道を探索する",
      sceneImageSrc: "/images/maps/santa-sede/sunken-road.png",
    },
    {
      id: "holy-see-event-judge-appointment",
      x: 49,
      y: 37,
      type: "event",
      actionEs: "Acercarte en silencio al nombramiento del Juez",
      actionEn: "Approach the Judge's appointment in silence",
      actionJa: "裁き手の任命に静かに近づく",
      sceneImageSrc: "/images/maps/santa-sede/judge-appointment.png",
      uniqueEventId: "event_holy_see_judge_appointment",
      eventTextEs: "Has presenciado el nombramiento del Juez: la asamblea juró obediencia mientras el sello del pozo permanecía cubierto bajo el altar.",
      eventTextEn: "You witness the Judge's appointment: the assembly swears obedience while the well-seal remains hidden beneath the altar.",
      eventTextJa: "裁き手の任命を目撃した。集会は忠誠を誓い、井戸の封印は祭壇の下に隠されたままだった。",
    },
    {
      id: "holy-see-item-appointment-act",
      x: 72,
      y: 32,
      type: "item",
      actionEs: "Recoger Acta del Nombramiento",
      actionEn: "Collect Appointment Act",
      actionJa: "任命記録を拾う",
      sceneImageSrc: "/images/maps/santa-sede/appointment-act.png",
      unlockItemSlug: "judge-appointment-act",
    },
    {
      id: "holy-see-whisper-priests-cloister",
      x: 36,
      y: 57,
      type: "character",
      characterSlug: "sacerdote",
      actionEs: "Escuchar sacerdotes cuchichear",
      actionEn: "Listen to whispering priests",
      actionJa: "司祭たちの囁きを聞く",
      sceneImageSrc: "/images/maps/santa-sede/whisper-priests.png",
      uniqueEventId: "event_holy_see_whispering_priests",
      eventTextEs: "Los sacerdotes mencionan la ciudad bajo el pozo: saber obtenido, hambre desatada y un sello mantenido con miedo.",
      eventTextEn: "The priests mention the city beneath the well: knowledge gained, hunger unleashed, and a seal upheld by fear.",
      eventTextJa: "司祭たちは井戸の下の都市を語る。得られた知識、解き放たれた飢え、そして恐れで維持される封印。",
    },
    {
      id: "holy-see-explore-north-cloister",
      x: 31,
      y: 44,
      type: "explore",
      actionEs: "Entrar al claustro norte",
      actionEn: "Enter the north cloister",
      actionJa: "北回廊に入る",
      sceneImageSrc: "/images/maps/santa-sede/north-cloister.png",
    },
    {
      id: "holy-see-explore-bell-tower-stairs",
      x: 81,
      y: 28,
      type: "explore",
      actionEs: "Subir escaleras de la torre campanario",
      actionEn: "Climb the bell tower stairs",
      actionJa: "鐘楼の階段を上る",
      sceneImageSrc: "/images/maps/santa-sede/bell-tower-stairs.png",
    },
    {
      id: "holy-see-event-corner-breath",
      x: 88,
      y: 76,
      type: "event",
      actionEs: "Notar respiración en un rincón sellado",
      actionEn: "Notice breathing in a sealed corner",
      actionJa: "封鎖された隅で呼吸音に気づく",
      sceneImageSrc: "/images/maps/santa-sede/corner-breath.png",
      uniqueEventId: "event_holy_see_corner_breath",
      eventTextEs: "El rincón parece latir bajo yeso húmedo, como si algo respirara detrás de la pared.",
      eventTextEn: "The corner seems to pulse beneath damp plaster, as if something breathes behind the wall.",
      eventTextJa: "湿った漆喰の下でその隅が脈打つ。壁の向こうで何かが呼吸しているようだ。",
    },
    {
      id: "holy-see-event-black-wax",
      x: 18,
      y: 49,
      type: "event",
      actionEs: "Examinar cera negra en el altar lateral",
      actionEn: "Inspect black wax at side altar",
      actionJa: "側祭壇の黒い蝋を調べる",
      sceneImageSrc: "/images/maps/santa-sede/black-wax-altar.png",
      uniqueEventId: "event_holy_see_black_wax",
      eventTextEs: "La cera negra conserva huellas de dedos infantiles, pese a que nadie reconoce niños en servicio aquí.",
      eventTextEn: "The black wax preserves child-sized fingerprints, though no one admits children serve here.",
      eventTextJa: "黒い蝋には子供の指跡が残っているが、ここで子供が仕えていることを誰も認めない。",
    },
    {
      id: "holy-see-explore-sealed-ossuary",
      x: 58,
      y: 84,
      type: "explore",
      actionEs: "Forzar paso al osario sellado",
      actionEn: "Force entry to sealed ossuary",
      actionJa: "封鎖された納骨堂へ進む",
      sceneImageSrc: "/images/maps/santa-sede/sealed-ossuary.png",
    },
  ],
  "03-02-1": [
    {
      id: "molino-ledger",
      x: 67,
      y: 44,
      type: "item",
      actionEs: "Recoger Registro de Wolfsbane",
      actionEn: "Collect Wolfsbane Ledger",
      actionJa: "ウルフズベイン記録を拾う",
      unlockItemSlug: "wolfsbane-ledger",
    },
    {
      id: "molino-explore-below-wheel",
      x: 46,
      y: 72,
      type: "explore",
      actionEs: "Explorar bajo la rueda",
      actionEn: "Explore beneath the wheel",
      actionJa: "水車の下を探索する",
      sceneImageSrc: "/images/maps/elden-ring-placeholder.png",
    },
    {
      id: "molino-floodgate-key",
      x: 55,
      y: 68,
      type: "relic",
      actionEs: "Recoger Llave de Compuerta",
      actionEn: "Collect Floodgate Key",
      actionJa: "水門の鍵を拾う",
      unlockItemSlug: "mill-floodgate-key",
    },
    {
      id: "molino-unique-cult-rite",
      x: 76,
      y: 36,
      type: "event",
      actionEs: "Observar ritual en la ladera",
      actionEn: "Observe rite on the hillside",
      actionJa: "丘の儀式を観察する",
      uniqueEventId: "event_mill_hillside_rite",
      eventTextEs: "Has visto a los acólitos de wolfsbane mover un cuerpo con hilos de raíces vivas.",
      eventTextEn: "You witness wolfsbane acolytes puppeteering a corpse with living root tendrils.",
      eventTextJa: "ウルフズベインの徒が生きた根で遺体を操る儀式を目撃した。",
    },
  ],
  "03-03": [
    {
      id: "forest-unique-psychic-trolls",
      x: 41,
      y: 61,
      type: "event",
      actionEs: "Observar claro maldito",
      actionEn: "Observe cursed clearing",
      actionJa: "呪われた空き地を観察する",
      uniqueEventId: "event_forest_psychic_trolls",
      eventTextEs: "Ves a trolls psíquicos reanimar un cadáver y forzarlo a caminar como señuelo.",
      eventTextEn: "You see psychic trolls reanimate a corpse and march it forward as bait.",
      eventTextJa: "精神トロルが遺体を蘇らせ、囮として歩かせる光景を見た。",
    },
    {
      id: "forest-relic-fragment",
      x: 63,
      y: 47,
      type: "relic",
      actionEs: "Recoger Sello Astillado",
      actionEn: "Collect Cracked Seal",
      actionJa: "ひび割れた封印を拾う",
      unlockItemSlug: "cracked-forest-seal",
    },
  ],
  "03-04": [
    {
      id: "villa-relic-fragment",
      x: 71,
      y: 42,
      type: "relic",
      actionEs: "Recoger Fragmento Auremont",
      actionEn: "Collect Auremont Fragment",
      actionJa: "オーレモントの欠片を拾う",
      unlockItemSlug: "auremont-relic-fragment",
    },
  ],
};

const MAIN_LOCATION_NODES: MainNode[] = [
  { id: "03-00", name: "La Santa Sede", tipo: "region", x: 45, y: 80 },
  { id: "03-01", name: "El Gran Puente", tipo: "region", x: 30, y: 62.5 },
  { id: "03-02", name: "La Pradera", tipo: "region", x: 30, y: 40 },
  { id: "03-02-1", name: "Molino Abandonado", tipo: "region", x: 32.4, y: 35.8 },
  { id: "03-03", name: "Bosque Embrujado", tipo: "region", x: 35, y: 32 },
  { id: "03-04", name: "Villa Infestada", tipo: "region", x: 57, y: 28 },
  { id: "03-05", name: "Ruinas del Monasterio", tipo: "mazmorra", x: 63.5, y: 20 },
  { id: "03-06", name: "Mansión Auremont", tipo: "mazmorra", x: 70, y: 32.5 },
  { id: "03-05-1", name: "Mazmorras de la Mansión", tipo: "mazmorra", x: 67.5, y: 41 },
  { id: "03-05-2", name: "Alcantarillas", tipo: "mazmorra", x: 70.5, y: 49.5 },
  { id: "03-05-3", name: "Las Profundidades", tipo: "secreto", x: 74, y: 59.5 },
];

const MAIN_LOCATION_EDGES: Array<[string, string]> = [
  ["03-00", "03-01"],
  ["03-01", "03-02"],
  ["03-02", "03-02-1"],
  ["03-02-1", "03-03"],
  ["03-03", "03-04"],
  ["03-04", "03-05"],
  ["03-04", "03-06"],
  ["03-05", "03-05-1"],
  ["03-05-1", "03-06"],
  ["03-05-1", "03-05-2"],
  ["03-05-2", "03-05-3"],
];

const EDGE_KEY = (fromNodeId: string, toNodeId: string) => [fromNodeId, toNodeId].sort().join("::");

const NODE_UNLOCK_RULES_BY_ID: Partial<Record<string, UnlockRule>> = {
  "03-02-1": {
    anyOf: [
      { requiresAnyCharacter: ["el-perro", "el-escudero"] },
      { requiresSecrets: { "03-02": 1 } },
    ],
  },
  "03-03": {
    anyOf: [
      { requiresAnyItem: ["wolfsbane-ledger"] },
      { requiresAnyCharacter: ["el-hechicero"] },
    ],
  },
  "03-04": {
    anyOf: [
      { requiresAllItems: ["wolfsbane-ledger", "mill-floodgate-key"] },
      { requiresAnyFlag: ["unlock_monastery_secret"] },
    ],
  },
  "03-05": {
    anyOf: [
      { requiresAnyCharacter: ["el-juez"] },
      { requiresAnyFlag: ["unlock_monastery_secret"] },
    ],
  },
  "03-06": {
    anyOf: [
      { requiresAnyCharacter: ["la-doncella"] },
      { requiresAnyItem: ["auremont-relic-fragment"] },
    ],
  },
  "03-05-1": {
    requiresAllFlags: ["unlock_monastery_secret"],
    requiresAnyItem: ["cracked-forest-seal"],
  },
  "03-05-2": {
    requiresAllFlags: ["unlock_sewers"],
    requiresAllItems: ["mill-floodgate-key"],
  },
  "03-05-3": {
    requiresAllFlags: ["unlock_depths"],
    requiresAnyCharacter: ["el-viejo-manto-blanco", "ruth"],
  },
};

const EDGE_UNLOCK_RULES_BY_KEY: Partial<Record<string, UnlockRule>> = {
  [EDGE_KEY("03-02-1", "03-03")]: {
    anyOf: [
      { requiresAnyItem: ["wolfsbane-ledger"] },
      { requiresAnyCharacter: ["el-hechicero"] },
    ],
  },
  [EDGE_KEY("03-04", "03-06")]: {
    anyOf: [
      { requiresAnyCharacter: ["la-doncella"] },
      { requiresAnyItem: ["auremont-relic-fragment"] },
    ],
  },
  [EDGE_KEY("03-05-1", "03-06")]: {
    requiresAllItems: ["auremont-relic-fragment", "cracked-forest-seal"],
  },
};

const SECRET_EDGE_KEYS = new Set(["03-05->03-05-1"]);
const NODE_SOURCE_SLUG_BY_ID: Record<string, string | undefined> = {
  "03-00": "la-santa-sede",
  "03-01": "el-gran-puente",
  "03-02": "la-pradera",
  "03-02-1": "molino-abandonado",
  "03-03": "bosque-embrujado",
  "03-04": "villa-infestada",
  "03-05": "ruinas-del-monasterio",
  "03-06": "mansion-auremont",
  "03-05-1": "mazmorras-de-la-mansion",
  "03-05-2": "alcantarillas",
  "03-05-3": "las-profundidades",
};

const NODE_FALLBACK_DESCRIPTION_BY_ID: Record<string, string> = {
  "03-00": "Antiguo centro de fe donde aún se escuchan ecos de juramentos rotos.",
  "03-01": "Puente de tránsito obligado, vigilado por sombras y patrullas errantes.",
  "03-02": "Llanuras abiertas con ruinas dispersas y caminos ocultos entre la hierba.",
  "03-02-1": "Molino abandonado entre la pradera y el bosque, marcado por los primeros brotes de wolfsbane.",
  "03-03": "Bosque denso con senderos cambiantes y presencias hostiles al anochecer.",
  "03-04": "Asentamiento corrompido donde cada callejón guarda una emboscada.",
  "03-05": "Ruinas sagradas tomadas por cultos y criaturas del crepúsculo.",
  "03-06": "Residencia noble en decadencia, convertida en fortaleza hostil.",
};

const NODE_SECRET_SLOT_COUNT_BY_ID: Record<string, number> = {
  "03-00": 4,
  "03-01": 3,
  "03-02": 4,
  "03-02-1": 4,
  "03-03": 5,
  "03-04": 4,
  "03-05": 5,
  "03-06": 5,
};

const MAP_PLACEHOLDER_SRC = "/images/maps/elden-ring-placeholder.png";
const REST_PIN_ICON_SRC = "/images/maps/rest-site-pin.svg";
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1400;
const DEFAULT_SCALE = 1;
const MAP_TILT_X_DEG = 40;
const MAP_TILT_Z_DEG = -1.8;
const HOVER_REEL_DELAY_MS = 900;
const HOVER_REEL_INTERVAL_MS = 1800;
const TRAVEL_MOVE_DURATION_MS = 1200;
const TRAVELER_NODE_STORAGE_KEY = "steel_sirens_traveler_node_id";
const FORCED_TRAVEL_EVENTS_STORAGE_KEY = "steel_sirens_forced_travel_events_seen";
const POPUP_UNIQUE_EVENTS_STORAGE_KEY = "steel_sirens_popup_unique_events_seen";
const VISITED_MAP_NODES_STORAGE_KEY = "steel_sirens_visited_map_node_ids";
const COMPLETED_MAP_HOTSPOTS_STORAGE_KEY = "steel_sirens_completed_map_hotspots_by_node_id";
const INITIAL_TRAVELER_NODE_ID = "03-00";
const TRAVEL_ANOMALY_CHANCE = 0.15;

const getNodePositionById = (nodeId: string) => {
  const node = MAIN_LOCATION_NODES.find((value) => value.id === nodeId);
  if (!node) {
    return null;
  }
  return { x: node.x, y: node.y };
};

const isUnlockRuleMet = (
  rule: UnlockRule | undefined,
  context: {
    discoveredItemSlugs: Set<string>;
    discoveredCharacterSlugs: Set<string>;
    gameFlags: Record<string, boolean>;
    locationSecretProgress: Record<string, number>;
  }
): boolean => {
  if (!rule) {
    return true;
  }

  if (rule.anyOf && rule.anyOf.length > 0) {
    return rule.anyOf.some((candidateRule) => isUnlockRuleMet(candidateRule, context));
  }

  if (rule.requiresAllItems && !rule.requiresAllItems.every((itemSlug) => context.discoveredItemSlugs.has(itemSlug))) {
    return false;
  }

  if (rule.requiresAnyItem && !rule.requiresAnyItem.some((itemSlug) => context.discoveredItemSlugs.has(itemSlug))) {
    return false;
  }

  if (
    rule.requiresAllCharacters &&
    !rule.requiresAllCharacters.every((characterSlug) => context.discoveredCharacterSlugs.has(characterSlug))
  ) {
    return false;
  }

  if (
    rule.requiresAnyCharacter &&
    !rule.requiresAnyCharacter.some((characterSlug) => context.discoveredCharacterSlugs.has(characterSlug))
  ) {
    return false;
  }

  if (rule.requiresAllFlags && !rule.requiresAllFlags.every((flag) => Boolean(context.gameFlags[flag]))) {
    return false;
  }

  if (rule.requiresAnyFlag && !rule.requiresAnyFlag.some((flag) => Boolean(context.gameFlags[flag]))) {
    return false;
  }

  if (
    rule.requiresSecrets &&
    !Object.entries(rule.requiresSecrets).every(
      ([locationKey, requiredCount]) => (context.locationSecretProgress[locationKey] ?? 0) >= requiredCount
    )
  ) {
    return false;
  }

  return true;
};

export default function LocationsExplorer({ locations, lang = "en" }: Props) {
  const [activeTipo, setActiveTipo] = useState("all");
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1, height: 1 });
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [isReelActive, setIsReelActive] = useState(false);
  const [locationSecretProgress, setLocationSecretProgress] = useState<Record<string, number>>({});
  const [gameFlags, setGameFlags] = useState<Record<string, boolean>>({});
  const [travelerNodeId, setTravelerNodeId] = useState(INITIAL_TRAVELER_NODE_ID);
  const [travelerPosition, setTravelerPosition] = useState(() => getNodePositionById(INITIAL_TRAVELER_NODE_ID) ?? { x: 45, y: 80 });
  const [travelAnomaly, setTravelAnomaly] = useState<string | null>(null);
  const [isTravelerMoving, setIsTravelerMoving] = useState(false);
  const [activeNodePopupId, setActiveNodePopupId] = useState<string | null>(null);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [hoveredPopupHotspotId, setHoveredPopupHotspotId] = useState<string | null>(null);
  const [popupUnlockFeedback, setPopupUnlockFeedback] = useState<string | null>(null);
  const [seenPopupUniqueEvents, setSeenPopupUniqueEvents] = useState<string[]>([]);
  const [discoveredPopupItemSlugs, setDiscoveredPopupItemSlugs] = useState<string[]>([]);
  const [discoveredCharacterSlugs, setDiscoveredCharacterSlugs] = useState<string[]>([]);
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>([]);
  const [completedPopupHotspotsByNodeId, setCompletedPopupHotspotsByNodeId] = useState<Record<string, string[]>>({});
  const [isMapProgressHydrated, setIsMapProgressHydrated] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<{
    hotspotId: string;
    currentLineId: string;
    script: PopupDialogueScript;
  } | null>(null);
  const [popupSceneStack, setPopupSceneStack] = useState<string[]>([]);
  const [activeTravelBanner, setActiveTravelBanner] = useState<{ title: string; detail: string } | null>(null);
  const [pendingTravelNodeId, setPendingTravelNodeId] = useState<string | null>(null);
  const [seenForcedTravelEvents, setSeenForcedTravelEvents] = useState<string[]>([]);
  const travelTimersRef = useRef<number[]>([]);
  const travelAnimationFrameRef = useRef<number | null>(null);

  const discoveredItemSlugSet = useMemo(() => new Set(discoveredPopupItemSlugs), [discoveredPopupItemSlugs]);
  const discoveredCharacterSlugSet = useMemo(() => new Set(discoveredCharacterSlugs), [discoveredCharacterSlugs]);
  const visitedNodeIdSet = useMemo(() => new Set(visitedNodeIds), [visitedNodeIds]);

  const unlockContext = useMemo(
    () => ({
      discoveredItemSlugs: discoveredItemSlugSet,
      discoveredCharacterSlugs: discoveredCharacterSlugSet,
      gameFlags,
      locationSecretProgress,
    }),
    [discoveredItemSlugSet, discoveredCharacterSlugSet, gameFlags, locationSecretProgress]
  );

  const unlockedNodeIds = useMemo(() => {
    const ruleUnlockedNodeIds = new Set(
      MAIN_LOCATION_NODES.filter((node) => isUnlockRuleMet(NODE_UNLOCK_RULES_BY_ID[node.id], unlockContext)).map((node) => node.id)
    );

    const isNodeExplorationComplete = (nodeId: string) => {
      if (!visitedNodeIdSet.has(nodeId)) {
        return false;
      }

      const nodeHotspots = POPUP_HOTSPOTS_BY_NODE_ID[nodeId] ?? [];
      if (nodeHotspots.length === 0) {
        return true;
      }

      const completedHotspotIds = new Set(completedPopupHotspotsByNodeId[nodeId] ?? []);
      return nodeHotspots.every((hotspot) => completedHotspotIds.has(hotspot.id));
    };

    const sequentialUnlockedNodeIds = new Set<string>();
    const firstNodeId = MAIN_LOCATION_NODES[0]?.id;
    if (firstNodeId) {
      sequentialUnlockedNodeIds.add(firstNodeId);
    }

    for (let index = 1; index < MAIN_LOCATION_NODES.length; index += 1) {
      const previousNodeId = MAIN_LOCATION_NODES[index - 1]?.id;
      const currentNodeId = MAIN_LOCATION_NODES[index]?.id;

      if (!previousNodeId || !currentNodeId) {
        continue;
      }

      if (sequentialUnlockedNodeIds.has(previousNodeId) && isNodeExplorationComplete(previousNodeId)) {
        sequentialUnlockedNodeIds.add(currentNodeId);
      }
    }

    return new Set(Array.from(sequentialUnlockedNodeIds).filter((nodeId) => ruleUnlockedNodeIds.has(nodeId)));
  }, [unlockContext, visitedNodeIdSet, completedPopupHotspotsByNodeId]);

  const isEdgeUnlocked = (fromNodeId: string, toNodeId: string) => {
    return isUnlockRuleMet(EDGE_UNLOCK_RULES_BY_KEY[EDGE_KEY(fromNodeId, toNodeId)], unlockContext);
  };

  const filtered = useMemo(
    () =>
      MAIN_LOCATION_NODES.filter(
        (node) => activeTipo === "all" || node.tipo === activeTipo
      ),
    [activeTipo]
  );

  const nodePositions = useMemo(
    () =>
      filtered.filter((node) => unlockedNodeIds.has(node.id)),
    [filtered, unlockedNodeIds]
  );

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(nodePositions.map((node) => node.id));
    return MAIN_LOCATION_EDGES.filter(
      ([from, to]) => visibleNodeIds.has(from) && visibleNodeIds.has(to) && isEdgeUnlocked(from, to)
    );
  }, [nodePositions, unlockContext]);

  const edgeCurves = useMemo(() => {
    const visibleNodesById = nodePositions.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    return visibleEdges.reduce<EdgeCurve[]>((acc, [from, to], index) => {
      const fromNode = visibleNodesById[from];
      const toNode = visibleNodesById[to];
      if (!fromNode || !toNode) {
        return acc;
      }

      const isSecretEdge = SECRET_EDGE_KEYS.has(`${from}->${to}`) || SECRET_EDGE_KEYS.has(`${to}->${from}`);
      const controlOffset = index % 2 === 0 ? -8 : 8;
      const c1x = fromNode.x + (toNode.x - fromNode.x) * 0.8;
      const c1y = fromNode.y + controlOffset;
      const c2x = fromNode.x + (toNode.x - fromNode.x) * 0.75;
      const c2y = toNode.y - controlOffset;
      const pathD = `M ${fromNode.x} ${fromNode.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toNode.x} ${toNode.y}`;

      acc.push({
        from,
        to,
        start: { x: fromNode.x, y: fromNode.y },
        control1: { x: c1x, y: c1y },
        control2: { x: c2x, y: c2y },
        end: { x: toNode.x, y: toNode.y },
        pathD,
        isSecretEdge,
      });

      return acc;
    }, []);
  }, [visibleEdges, nodePositions]);

  const edgeCurveByKey = useMemo(() => {
    return edgeCurves.reduce<Record<string, EdgeCurve>>((acc, curve) => {
      acc[`${curve.from}::${curve.to}`] = curve;
      return acc;
    }, {});
  }, [edgeCurves]);

  const nodesById = useMemo(() => {
    return nodePositions.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, [nodePositions]);

  const allNodesById = useMemo(() => {
    return MAIN_LOCATION_NODES.reduce<Record<string, MainNode>>((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  }, []);

  const travelAccessibleNodeIds = useMemo(() => {
    return MAIN_LOCATION_NODES.filter((node) => unlockedNodeIds.has(node.id)).map((node) => node.id);
  }, [unlockedNodeIds]);

  const travelAccessibleNodeIdSet = useMemo(() => new Set(travelAccessibleNodeIds), [travelAccessibleNodeIds]);

  const travelAccessibleEdges = useMemo(
    () =>
      MAIN_LOCATION_EDGES.filter(
        ([from, to]) => travelAccessibleNodeIdSet.has(from) && travelAccessibleNodeIdSet.has(to) && isEdgeUnlocked(from, to)
      ),
    [travelAccessibleNodeIdSet, unlockContext]
  );

  const travelerNode = allNodesById[travelerNodeId] ?? allNodesById[travelAccessibleNodeIds[0] ?? "03-00"];
  const activePopupNode = activeNodePopupId ? allNodesById[activeNodePopupId] : null;
  const popupHotspots = activeNodePopupId ? POPUP_HOTSPOTS_BY_NODE_ID[activeNodePopupId] ?? [] : [];
  const activeDialogueScript = activeDialogue?.script;
  const activeDialogueLine =
    activeDialogue && activeDialogueScript
      ? activeDialogueScript.linesById[activeDialogue.currentLineId]
      : undefined;
  const activeDialogueParticipants = activeDialogueScript?.participantSlugs ?? [];
  const leftDialogueParticipants = activeDialogueParticipants.filter((_, index) => index % 2 === 0);
  const rightDialogueParticipants = activeDialogueParticipants.filter((_, index) => index % 2 === 1);

  const nodeMetaById = useMemo(() => {
    return MAIN_LOCATION_NODES.reduce<Record<string, { description: string; previewImages: string[] }>>((acc, node) => {
      const sourceSlug = NODE_SOURCE_SLUG_BY_ID[node.id];
      const source = sourceSlug ? locations.find((location) => location.slug === sourceSlug) : undefined;

      const previewImages = Array.from(
        new Set(
          [
            source?.imagen_url,
            source?.mapImageUrl,
            source?.imageUrl,
            MAP_PLACEHOLDER_SRC,
          ].filter((value): value is string => Boolean(value))
        )
      );

      acc[node.id] = {
        description:
          source?.descripcion_corta ||
          source?.shortDescription ||
          NODE_FALLBACK_DESCRIPTION_BY_ID[node.id] ||
          "Zona en conflicto con actividad hostil registrada.",
        previewImages,
      };

      return acc;
    }, {});
  }, [locations]);

  const hoveredNodeImages = hoveredNodeId ? (nodeMetaById[hoveredNodeId]?.previewImages ?? []) : [];

  const getLocationProgressKey = (nodeId: string) => NODE_SOURCE_SLUG_BY_ID[nodeId] ?? nodeId;

  const getUnlockedPreviewImages = (nodeId: string): string[] => {
    const meta = nodeMetaById[nodeId];
    if (!meta) {
      return [MAP_PLACEHOLDER_SRC];
    }

    const slotCount = Math.max(1, NODE_SECRET_SLOT_COUNT_BY_ID[nodeId] ?? meta.previewImages.length ?? 1);
    const foundSecrets = locationSecretProgress[getLocationProgressKey(nodeId)] ?? 0;
    const unlockedCount = Math.min(
      Math.max(1, 1 + foundSecrets),
      Math.max(1, meta.previewImages.length, slotCount)
    );

    const source = meta.previewImages.length > 0 ? meta.previewImages : [MAP_PLACEHOLDER_SRC];
    const expanded = Array.from({ length: Math.max(unlockedCount, source.length) }, (_, index) => source[index % source.length]);

    return expanded.slice(0, unlockedCount);
  };

  const getSecretSlots = (nodeId: string) => {
    const slotCount = Math.max(1, NODE_SECRET_SLOT_COUNT_BY_ID[nodeId] ?? 3);
    const foundSecrets = Math.min(slotCount, locationSecretProgress[getLocationProgressKey(nodeId)] ?? 0);
    return { slotCount, foundSecrets };
  };

  const activePopupImageSrc =
    (popupSceneStack.length > 0
      ? popupSceneStack[popupSceneStack.length - 1]
      : activePopupNode
      ? getUnlockedPreviewImages(activePopupNode.id)[0] ?? MAP_PLACEHOLDER_SRC
      : MAP_PLACEHOLDER_SRC);

  const isPopupInExplorationScene = popupSceneStack.length > 0;
  const visiblePopupHotspots = isPopupInExplorationScene ? [] : popupHotspots;

  const hoveredUnlockedImages = hoveredNodeId ? getUnlockedPreviewImages(hoveredNodeId) : hoveredNodeImages;
  const hasSeedLocations = locations.length > 0;

  const labels =
    lang === "es"
      ? {
          mapTitle: "Mapa de nodos (ejemplo)",
          mapHint: "Ruta principal con Monasterio y Mansión visibles. Niveles subterráneos ocultos.",
          blocked: "bloqueada",
          empty: "No hay nodos para este filtro.",
          resetView: "Reiniciar vista",
          routeState: "Ubicación actual",
          anomalyNone: "El camino está en calma. No hay anomalías detectadas.",
          close: "Cerrar",
          itemUnlocked: "Objeto encontrado",
          relicFound: "Reliquia encontrada",
          areaExplored: "Zona explorada",
          uniqueEventSeen: "Evento único descubierto",
          uniqueEventAlreadySeen: "Ya habías presenciado este evento",
          backToPreviousScene: "Volver a la escena anterior",
          routeEventTitle: "Anomalía en ruta",
          forcedEventTitle: "Evento clave",
          continueExploration: "Haz click para continuar",
          continueDialogue: "Continuar",
          responsePrompt: "Responde:",
          settings: "Ajustes",
          resetStory: "Reiniciar historia",
          resetStoryConfirm:
            "¿Seguro que quieres reiniciar la historia del mapa? Se borrará progreso de nodos, eventos, objetos y personajes descubiertos.",
        }
      : lang === "ja"
      ? {
          mapTitle: "ノードマップ（サンプル）",
          mapHint: "修道院とオーレモント邸は表示し、地下階層は非表示にしています。",
          blocked: "封印中",
          empty: "このフィルターではノードがありません。",
          resetView: "表示をリセット",
          routeState: "現在位置",
          anomalyNone: "経路は静穏。異常は検出されません。",
          close: "閉じる",
          itemUnlocked: "アイテムを発見",
          relicFound: "遺物を発見",
          areaExplored: "探索を完了",
          uniqueEventSeen: "ユニークイベントを発見",
          uniqueEventAlreadySeen: "このイベントは既に目撃済み",
          backToPreviousScene: "前のシーンへ戻る",
          routeEventTitle: "経路異常",
          forcedEventTitle: "重要イベント",
          continueExploration: "クリックして続行",
          continueDialogue: "続ける",
          responsePrompt: "返答:",
          settings: "設定",
          resetStory: "物語をリセット",
          resetStoryConfirm:
            "マップの物語進行をリセットしますか？ノード・イベント・発見済みアイテムとキャラクターの進行が削除されます。",
        }
      : {
          mapTitle: "Node Map (Example)",
          mapHint: "Main route includes Monastery and Auremont Mansion; subterranean levels remain hidden.",
          blocked: "blocked",
          empty: "No nodes for this filter.",
          resetView: "Reset view",
          routeState: "Current route",
          anomalyNone: "Path is calm. No anomalies detected.",
          close: "Close",
          itemUnlocked: "Item discovered",
          relicFound: "Relic discovered",
          areaExplored: "Area explored",
          uniqueEventSeen: "Unique event discovered",
          uniqueEventAlreadySeen: "This event was already witnessed",
          backToPreviousScene: "Return to previous scene",
          routeEventTitle: "Route anomaly",
          forcedEventTitle: "Key event",
          continueExploration: "Click to continue",
          continueDialogue: "Continue",
          responsePrompt: "Choose a response:",
          settings: "Settings",
          resetStory: "Reset story",
          resetStoryConfirm:
            "Reset map story progression? This will clear node/event progress and discovered items/characters.",
        };

  const getPopupHotspotLabel = (hotspot: PopupHotspot) => {
    if (lang === "es") return hotspot.actionEs;
    if (lang === "ja") return hotspot.actionJa;
    return hotspot.actionEn;
  };

  const getPopupEventText = (hotspot: PopupHotspot) => {
    if (lang === "es") return hotspot.eventTextEs;
    if (lang === "ja") return hotspot.eventTextJa;
    return hotspot.eventTextEn;
  };

  const getPopupCharacterPortrait = (hotspot: PopupHotspot) => {
    if (!hotspot.characterSlug) {
      return MAP_PLACEHOLDER_SRC;
    }
    return CHARACTER_PORTRAIT_BY_SLUG[hotspot.characterSlug] ?? MAP_PLACEHOLDER_SRC;
  };

  const getDialogueOptionLabel = (option: PopupDialogueOption) => {
    if (lang === "es") return option.labelEs;
    if (lang === "ja") return option.labelJa;
    return option.labelEn;
  };

  const getDialogueSpeakerName = (line: PopupDialogueLine) => {
    if (!line.speakerNameEs && !line.speakerNameEn && !line.speakerNameJa) {
      if (lang === "es") return "Acción";
      if (lang === "ja") return "行動";
      return "Action";
    }

    if (lang === "es") return line.speakerNameEs;
    if (lang === "ja") return line.speakerNameJa;
    return line.speakerNameEn;
  };

  const getDialogueLineText = (line: PopupDialogueLine) => {
    if (lang === "es") return line.textEs;
    if (lang === "ja") return line.textJa;
    return line.textEn;
  };

  const markPopupHotspotCompleted = (nodeId: string, hotspotId: string) => {
    setCompletedPopupHotspotsByNodeId((current) => {
      const completedInNode = new Set(current[nodeId] ?? []);
      completedInNode.add(hotspotId);

      return {
        ...current,
        [nodeId]: Array.from(completedInNode),
      };
    });
  };

  const handlePopupHotspotClick = (hotspot: PopupHotspot) => {
    const nodeId = activeNodePopupId;

    if (hotspot.type === "explore") {
      if (nodeId) {
        markPopupHotspotCompleted(nodeId, hotspot.id);
      }

      const sceneSrc = hotspot.sceneImageSrc;
      if (sceneSrc) {
        setPopupSceneStack((current) => {
          const currentScene = current[current.length - 1];
          if (currentScene === sceneSrc) {
            return current;
          }
          return [...current, sceneSrc];
        });
      }
      setPopupUnlockFeedback(`${labels.areaExplored}: ${getPopupHotspotLabel(hotspot)}`);
      return;
    }

    if ((hotspot.type === "item" || hotspot.type === "relic") && hotspot.unlockItemSlug) {
      if (nodeId) {
        markPopupHotspotCompleted(nodeId, hotspot.id);
      }

      const alreadyDiscovered = discoveredPopupItemSlugs.includes(hotspot.unlockItemSlug);
      if (!alreadyDiscovered) {
        markItemDiscovered(hotspot.unlockItemSlug);
        setDiscoveredPopupItemSlugs((current) => Array.from(new Set([...current, hotspot.unlockItemSlug as string])));
      }

      setPopupUnlockFeedback(
        `${hotspot.type === "relic" ? labels.relicFound : labels.itemUnlocked}: ${getPopupHotspotLabel(hotspot)}`
      );
      window.dispatchEvent(new Event("storage"));
      return;
    }

    if ((hotspot.type === "event" || hotspot.type === "character") && hotspot.uniqueEventId) {
      const dialogueDefinition = POPUP_DIALOGUE_BY_HOTSPOT_ID[hotspot.id];
      if (dialogueDefinition) {
        const alreadySeen = seenPopupUniqueEvents.includes(hotspot.uniqueEventId);
        const selectedScript = alreadySeen && dialogueDefinition.repeat ? dialogueDefinition.repeat : dialogueDefinition.initial;

        setActiveDialogue({
          hotspotId: hotspot.id,
          currentLineId: selectedScript.startLineId,
          script: selectedScript,
        });
        return;
      }

      if (nodeId) {
        markPopupHotspotCompleted(nodeId, hotspot.id);
      }

      const alreadySeen = seenPopupUniqueEvents.includes(hotspot.uniqueEventId);
      if (!alreadySeen) {
        setSeenPopupUniqueEvents((current) => Array.from(new Set([...current, hotspot.uniqueEventId as string])));

        if (hotspot.uniqueEventId === "event_holy_see_judge_appointment") {
          const updatedDiscoveredCharacters = markCharacterDiscovered("el-juez");
          setDiscoveredCharacterSlugs(updatedDiscoveredCharacters);
        }
      }

      const eventText = getPopupEventText(hotspot);
      if (eventText) {
        setPopupUnlockFeedback(
          alreadySeen
            ? `${labels.uniqueEventAlreadySeen}: ${eventText}`
            : `${labels.uniqueEventSeen}: ${eventText}`
        );
      }
    }
  };

  const completeDialogueForHotspot = (hotspotId: string) => {
    const nodeId = activeNodePopupId;
    const hotspot = popupHotspots.find((value) => value.id === hotspotId);
    if (!hotspot || (hotspot.type !== "event" && hotspot.type !== "character")) {
      setActiveDialogue(null);
      return;
    }

    if (nodeId) {
      markPopupHotspotCompleted(nodeId, hotspot.id);
    }

    const alreadySeen = hotspot.uniqueEventId ? seenPopupUniqueEvents.includes(hotspot.uniqueEventId) : false;
    if (hotspot.uniqueEventId && !alreadySeen) {
      setSeenPopupUniqueEvents((current) => Array.from(new Set([...current, hotspot.uniqueEventId as string])));
    }

    if (hotspot.uniqueEventId === "event_holy_see_judge_appointment" && !alreadySeen) {
      const updatedDiscoveredCharacters = markCharacterDiscovered("el-juez");
      setDiscoveredCharacterSlugs(updatedDiscoveredCharacters);
    }

    const eventText = getPopupEventText(hotspot);
    if (eventText) {
      setPopupUnlockFeedback(
        alreadySeen
          ? `${labels.uniqueEventAlreadySeen}: ${eventText}`
          : `${labels.uniqueEventSeen}: ${eventText}`
      );
    }

    setActiveDialogue(null);
  };

  const advanceDialogueToLine = (nextLineId?: string) => {
    if (!activeDialogue) {
      return;
    }

    if (!nextLineId) {
      completeDialogueForHotspot(activeDialogue.hotspotId);
      return;
    }

    setActiveDialogue((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        currentLineId: nextLineId,
      };
    });
  };

  const handleReturnToPreviousPopupScene = () => {
    setPopupSceneStack((current) => current.slice(0, -1));
  };

  const anomalyPool =
    lang === "es"
      ? [
          "Una campana lejana suena bajo tierra, pero no hay templo cercano.",
          "La niebla se abre y deja marcas de arrastre en el camino.",
          "Sombras cruzan la ruta en dirección contraria al viento.",
          "El suelo vibra y luego queda en silencio absoluto.",
        ]
      : lang === "ja"
      ? [
          "地下から鐘の残響が届くが、近くに聖堂はない。",
          "霧が割れ、地面に引きずった痕だけが残る。",
          "風向きと逆に影が道を横切る。",
          "地面が震えた直後、完全な静寂が訪れる。",
        ]
      : [
          "A distant bell tolls underground, though no temple is nearby.",
          "Mist parts and reveals drag marks along the road.",
          "Shadows cross the path against the wind direction.",
          "The ground trembles, then drops into complete silence.",
        ];

  const forcedAnomalyByEdgeKey =
    lang === "es"
      ? {
          "03-02-1::03-03": "Un coro sin cuerpo te obliga a detenerte antes del Bosque Embrujado.",
          "03-05::03-05-1": "Bajo los escombros del monasterio cede un sello y aparece un descenso oculto.",
        }
      : lang === "ja"
      ? {
          "03-02-1::03-03": "呪われた森の手前で、姿なき聖歌が進路を止める。",
          "03-05::03-05-1": "修道院の瓦礫の下で封印が崩れ、隠された降路が現れる。",
        }
      : {
          "03-02-1::03-03": "A bodiless chorus halts your march before the Haunted Forest.",
          "03-05::03-05-1": "A buried seal breaks under the monastery, revealing a hidden descent.",
        };

  const getEdgeEventKey = (fromNodeId: string, toNodeId: string) => {
    return [fromNodeId, toNodeId].sort().join("::");
  };

  const triggerTravelEvent = (fromNodeId: string, toNodeId: string) => {
    const edgeEventKey = getEdgeEventKey(fromNodeId, toNodeId);
    const fromNodeName = allNodesById[fromNodeId]?.name ?? fromNodeId;
    const toNodeName = allNodesById[toNodeId]?.name ?? toNodeId;

    const forcedEventText = forcedAnomalyByEdgeKey[edgeEventKey as keyof typeof forcedAnomalyByEdgeKey];
    const shouldTriggerForced = Boolean(forcedEventText) && !seenForcedTravelEvents.includes(edgeEventKey);

    if (shouldTriggerForced) {
      const detail = `${fromNodeName} → ${toNodeName}: ${forcedEventText}`;
      setTravelAnomaly(detail);
      setSeenForcedTravelEvents((current) => Array.from(new Set([...current, edgeEventKey])));
      return { title: labels.forcedEventTitle, detail };
    }

    if (Math.random() < TRAVEL_ANOMALY_CHANCE) {
      const anomalyText = anomalyPool[Math.floor(Math.random() * anomalyPool.length)];
      const detail = `${fromNodeName} → ${toNodeName}: ${anomalyText}`;
      setTravelAnomaly(detail);
      return { title: labels.routeEventTitle, detail };
    }

    setTravelAnomaly(null);
    return null;
  };

  const clearTravelTimers = () => {
    if (travelTimersRef.current.length === 0) {
      return;
    }

    travelTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    travelTimersRef.current = [];

    if (travelAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(travelAnimationFrameRef.current);
      travelAnimationFrameRef.current = null;
    }
  };

  const queueTravelTimer = (callback: () => void, delay: number) => {
    const timerId = window.setTimeout(callback, delay);
    travelTimersRef.current.push(timerId);
    return timerId;
  };

  const playAnomalySound = () => {
    if (typeof window === "undefined") {
      return;
    }

    const audioWindow = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const Context = window.AudioContext ?? audioWindow.webkitAudioContext;

    if (!Context) {
      return;
    }

    try {
      const context = new Context();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(196, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(132, context.currentTime + 0.42);

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.46);

      const closeTimer = window.setTimeout(() => {
        context.close().catch(() => undefined);
      }, 550);
      travelTimersRef.current.push(closeTimer);
    } catch {
      // ignore audio errors
    }
  };

  const getBezierPointAt = (curve: EdgeCurve, t: number) => {
    const oneMinusT = 1 - t;
    const x =
      oneMinusT * oneMinusT * oneMinusT * curve.start.x +
      3 * oneMinusT * oneMinusT * t * curve.control1.x +
      3 * oneMinusT * t * t * curve.control2.x +
      t * t * t * curve.end.x;
    const y =
      oneMinusT * oneMinusT * oneMinusT * curve.start.y +
      3 * oneMinusT * oneMinusT * t * curve.control1.y +
      3 * oneMinusT * t * t * curve.control2.y +
      t * t * t * curve.end.y;
    return { x, y };
  };

  const getTravelCurve = (fromNodeId: string, toNodeId: string): EdgeCurve | null => {
    const direct = edgeCurveByKey[`${fromNodeId}::${toNodeId}`];
    if (direct) {
      return direct;
    }

    const reverse = edgeCurveByKey[`${toNodeId}::${fromNodeId}`];
    if (reverse) {
      return {
        from: fromNodeId,
        to: toNodeId,
        start: reverse.end,
        control1: reverse.control2,
        control2: reverse.control1,
        end: reverse.start,
        pathD: reverse.pathD,
        isSecretEdge: reverse.isSecretEdge,
      };
    }

    const fromNode = allNodesById[fromNodeId];
    const toNode = allNodesById[toNodeId];
    if (!fromNode || !toNode) {
      return null;
    }

    return {
      from: fromNodeId,
      to: toNodeId,
      start: { x: fromNode.x, y: fromNode.y },
      control1: { x: fromNode.x + (toNode.x - fromNode.x) * 0.33, y: fromNode.y + (toNode.y - fromNode.y) * 0.33 },
      control2: { x: fromNode.x + (toNode.x - fromNode.x) * 0.66, y: fromNode.y + (toNode.y - fromNode.y) * 0.66 },
      end: { x: toNode.x, y: toNode.y },
      pathD: "",
      isSecretEdge: false,
    };
  };

  const animateTravelerOnCurve = (
    curve: EdgeCurve,
    fromT: number,
    toT: number,
    duration: number,
    onComplete: () => void
  ) => {
    if (typeof window === "undefined") {
      setTravelerPosition(getBezierPointAt(curve, toT));
      onComplete();
      return;
    }

    if (travelAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(travelAnimationFrameRef.current);
      travelAnimationFrameRef.current = null;
    }

    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / Math.max(1, duration));
      const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      const t = fromT + (toT - fromT) * easedProgress;
      setTravelerPosition(getBezierPointAt(curve, t));

      if (progress >= 1) {
        travelAnimationFrameRef.current = null;
        onComplete();
        return;
      }

      travelAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    travelAnimationFrameRef.current = window.requestAnimationFrame(tick);
  };

  const continuePendingTravel = () => {
    if (!pendingTravelNodeId) {
      return;
    }

    const targetNode = allNodesById[pendingTravelNodeId];
    if (!targetNode) {
      setPendingTravelNodeId(null);
      setActiveTravelBanner(null);
      setIsTravelerMoving(false);
      return;
    }

    const curve = getTravelCurve(travelerNodeId, pendingTravelNodeId);
    if (!curve) {
      setActiveTravelBanner(null);
      setTravelerPosition({ x: targetNode.x, y: targetNode.y });

      queueTravelTimer(() => {
        setTravelerNodeId(pendingTravelNodeId);
        setPendingTravelNodeId(null);
        setIsTravelerMoving(false);
        setActiveNodePopupId(targetNode.id);
      }, TRAVEL_MOVE_DURATION_MS);
      return;
    }

    setActiveTravelBanner(null);
    animateTravelerOnCurve(curve, 0.5, 1, TRAVEL_MOVE_DURATION_MS, () => {
      setTravelerNodeId(pendingTravelNodeId);
      setPendingTravelNodeId(null);
      setIsTravelerMoving(false);
      setActiveNodePopupId(targetNode.id);
    });
  };

  const isAdjacentTravelNode = (targetNodeId: string) => {
    if (!travelAccessibleNodeIdSet.has(travelerNodeId) || !travelAccessibleNodeIdSet.has(targetNodeId)) {
      return false;
    }

    return travelAccessibleEdges.some(
      ([from, to]) =>
        (from === travelerNodeId && to === targetNodeId) ||
        (from === targetNodeId && to === travelerNodeId)
    );
  };

  const clampOffset = (nextOffset: { x: number; y: number }, nextScale: number) => {
    const scaledWidth = WORLD_WIDTH * nextScale;
    const scaledHeight = WORLD_HEIGHT * nextScale;
    const { width: viewportWidth, height: viewportHeight } = viewportSize;

    const minX = Math.min(0, viewportWidth - scaledWidth);
    const minY = Math.min(0, viewportHeight - scaledHeight);
    const maxX = scaledWidth <= viewportWidth ? (viewportWidth - scaledWidth) / 2 : 0;
    const maxY = scaledHeight <= viewportHeight ? (viewportHeight - scaledHeight) / 2 : 0;

    return {
      x: Math.min(maxX, Math.max(minX, nextOffset.x)),
      y: Math.min(maxY, Math.max(minY, nextOffset.y)),
    };
  };

  useEffect(() => {
    const updateViewport = () => {
      if (!viewportRef.current) {
        return;
      }

      const rect = viewportRef.current.getBoundingClientRect();
      const nextViewport = {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };

      setViewportSize(nextViewport);
      setOffset((current) => clampOffset(current, scale));
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [scale]);

  useEffect(() => {
    setOffset((current) => clampOffset(current, scale));
  }, [viewportSize, scale]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((current) => {
      const nextScale = Math.max(0.8, Math.min(2.6, current + delta));
      setOffset((currentOffset) => clampOffset(currentOffset, nextScale));
      return nextScale;
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const nextOffset = { x: event.clientX - dragStart.x, y: event.clientY - dragStart.y };
    setOffset(clampOffset(nextOffset, scale));
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    const travelerWorldX = (travelerPosition.x / 100) * WORLD_WIDTH;
    const travelerWorldY = (travelerPosition.y / 100) * WORLD_HEIGHT;

    const centeredOffset = {
      x: viewportSize.width / 2 - travelerWorldX * DEFAULT_SCALE,
      y: viewportSize.height / 2 - travelerWorldY * DEFAULT_SCALE,
    };

    setScale(DEFAULT_SCALE);
    setOffset(clampOffset(centeredOffset, DEFAULT_SCALE));
  };

  const resetStoryProgress = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.confirm(labels.resetStoryConfirm)) {
      return;
    }

    const keysToClear = [
      VISITED_MAP_NODES_STORAGE_KEY,
      COMPLETED_MAP_HOTSPOTS_STORAGE_KEY,
      TRAVELER_NODE_STORAGE_KEY,
      FORCED_TRAVEL_EVENTS_STORAGE_KEY,
      POPUP_UNIQUE_EVENTS_STORAGE_KEY,
      DISCOVERED_CHARACTER_SLUGS_STORAGE_KEY,
      DISCOVERED_ITEM_SLUGS_STORAGE_KEY,
      LOCATION_SECRET_PROGRESS_STORAGE_KEY,
      GAME_FLAGS_STORAGE_KEY,
    ];

    keysToClear.forEach((storageKey) => window.localStorage.removeItem(storageKey));

    setVisitedNodeIds([]);
    setCompletedPopupHotspotsByNodeId({});
    setDiscoveredPopupItemSlugs([]);
    setDiscoveredCharacterSlugs([]);
    setLocationSecretProgress({});
    setGameFlags({});
    setSeenPopupUniqueEvents([]);
    setSeenForcedTravelEvents([]);
    setTravelAnomaly(null);
    setPendingTravelNodeId(null);
    setActiveTravelBanner(null);
    setActiveNodePopupId(null);
    setActiveDialogue(null);
    setPopupSceneStack([]);
    setPopupUnlockFeedback(null);
    setHoveredPopupHotspotId(null);
    setTravelerNodeId(INITIAL_TRAVELER_NODE_ID);
    setTravelerPosition(getNodePositionById(INITIAL_TRAVELER_NODE_ID) ?? { x: 45, y: 80 });
    setIsSettingsMenuOpen(false);

    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    setPreviewFrame(0);
    setIsReelActive(false);
  }, [hoveredNodeId]);

  useEffect(() => {
    if (!hoveredNodeId) {
      return;
    }

    const delayTimer = window.setTimeout(() => {
      setIsReelActive(true);
    }, HOVER_REEL_DELAY_MS);

    return () => window.clearTimeout(delayTimer);
  }, [hoveredNodeId]);

  useEffect(() => {
    if (!hoveredNodeId || !isReelActive || hoveredUnlockedImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPreviewFrame((current) => (current + 1) % hoveredUnlockedImages.length);
    }, HOVER_REEL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [hoveredNodeId, isReelActive, hoveredUnlockedImages]);

  useEffect(() => {
    const syncProgress = () => {
      setLocationSecretProgress(getLocationSecretProgress());
      setGameFlags(getGameFlags());
    };

    syncProgress();
    window.addEventListener("storage", syncProgress);
    return () => window.removeEventListener("storage", syncProgress);
  }, []);

  useEffect(() => {
    if (!travelAccessibleNodeIdSet.has(travelerNodeId)) {
      setTravelerNodeId(travelAccessibleNodeIds[0] ?? "03-00");
    }
  }, [travelAccessibleNodeIds, travelAccessibleNodeIdSet, travelerNodeId]);

  useEffect(() => {
    const position = getNodePositionById(travelerNodeId);
    if (!position || isTravelerMoving) {
      return;
    }

    setTravelerPosition(position);
  }, [travelerNodeId, isTravelerMoving]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedNodeId = window.localStorage.getItem(TRAVELER_NODE_STORAGE_KEY);
      if (savedNodeId && MAIN_LOCATION_NODES.some((node) => node.id === savedNodeId)) {
        setTravelerNodeId(savedNodeId);
        const savedPosition = getNodePositionById(savedNodeId);
        if (savedPosition) {
          setTravelerPosition(savedPosition);
        }
      }
    } catch {
      // ignore storage read errors
    } finally {
      setIsMapProgressHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(TRAVELER_NODE_STORAGE_KEY, travelerNodeId);
    } catch {
      // ignore storage write errors
    }
  }, [travelerNodeId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(FORCED_TRAVEL_EVENTS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) {
        const safeValues = parsed.filter((value): value is string => typeof value === "string");
        setSeenForcedTravelEvents(safeValues);
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(FORCED_TRAVEL_EVENTS_STORAGE_KEY, JSON.stringify(seenForcedTravelEvents));
    } catch {
      // ignore storage write errors
    }
  }, [seenForcedTravelEvents]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(POPUP_UNIQUE_EVENTS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) {
        const safeValues = parsed.filter((value): value is string => typeof value === "string");
        setSeenPopupUniqueEvents(safeValues);
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(POPUP_UNIQUE_EVENTS_STORAGE_KEY, JSON.stringify(seenPopupUniqueEvents));
    } catch {
      // ignore storage write errors
    }
  }, [seenPopupUniqueEvents]);

  useEffect(() => {
    if (!activeNodePopupId) {
      return;
    }

    setVisitedNodeIds((current) => {
      if (current.includes(activeNodePopupId)) {
        return current;
      }
      return [...current, activeNodePopupId];
    });
  }, [activeNodePopupId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawVisitedNodes = window.localStorage.getItem(VISITED_MAP_NODES_STORAGE_KEY);
      const parsedVisitedNodes = rawVisitedNodes ? (JSON.parse(rawVisitedNodes) as unknown) : [];
      if (Array.isArray(parsedVisitedNodes)) {
        setVisitedNodeIds(parsedVisitedNodes.filter((value): value is string => typeof value === "string"));
      }

      const rawCompletedHotspots = window.localStorage.getItem(COMPLETED_MAP_HOTSPOTS_STORAGE_KEY);
      const parsedCompletedHotspots = rawCompletedHotspots ? (JSON.parse(rawCompletedHotspots) as unknown) : {};

      if (parsedCompletedHotspots && typeof parsedCompletedHotspots === "object" && !Array.isArray(parsedCompletedHotspots)) {
        const nextState = Object.entries(parsedCompletedHotspots as Record<string, unknown>).reduce<Record<string, string[]>>(
          (acc, [nodeId, hotspotIds]) => {
            if (!Array.isArray(hotspotIds)) {
              return acc;
            }

            acc[nodeId] = hotspotIds.filter((value): value is string => typeof value === "string");
            return acc;
          },
          {}
        );

        setCompletedPopupHotspotsByNodeId(nextState);
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isMapProgressHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(VISITED_MAP_NODES_STORAGE_KEY, JSON.stringify(visitedNodeIds));
    } catch {
      // ignore storage write errors
    }
  }, [visitedNodeIds, isMapProgressHydrated]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isMapProgressHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(COMPLETED_MAP_HOTSPOTS_STORAGE_KEY, JSON.stringify(completedPopupHotspotsByNodeId));
    } catch {
      // ignore storage write errors
    }
  }, [completedPopupHotspotsByNodeId, isMapProgressHydrated]);

  useEffect(() => {
    const syncDiscoveries = () => {
      setDiscoveredPopupItemSlugs(getDiscoveredItemSlugs());
      setDiscoveredCharacterSlugs(getDiscoveredCharacterSlugs());

      try {
        const rawVisitedNodes = window.localStorage.getItem(VISITED_MAP_NODES_STORAGE_KEY);
        const parsedVisitedNodes = rawVisitedNodes ? (JSON.parse(rawVisitedNodes) as unknown) : [];
        if (Array.isArray(parsedVisitedNodes)) {
          setVisitedNodeIds(parsedVisitedNodes.filter((value): value is string => typeof value === "string"));
        }

        const rawCompletedHotspots = window.localStorage.getItem(COMPLETED_MAP_HOTSPOTS_STORAGE_KEY);
        const parsedCompletedHotspots = rawCompletedHotspots ? (JSON.parse(rawCompletedHotspots) as unknown) : {};

        if (parsedCompletedHotspots && typeof parsedCompletedHotspots === "object" && !Array.isArray(parsedCompletedHotspots)) {
          const nextState = Object.entries(parsedCompletedHotspots as Record<string, unknown>).reduce<Record<string, string[]>>(
            (acc, [nodeId, hotspotIds]) => {
              if (!Array.isArray(hotspotIds)) {
                return acc;
              }

              acc[nodeId] = hotspotIds.filter((value): value is string => typeof value === "string");
              return acc;
            },
            {}
          );

          setCompletedPopupHotspotsByNodeId(nextState);
        }
      } catch {
        // ignore storage read errors
      }
    };

    syncDiscoveries();
    window.addEventListener("storage", syncDiscoveries);
    return () => window.removeEventListener("storage", syncDiscoveries);
  }, []);

  useEffect(() => {
    setPopupSceneStack([]);
    setPopupUnlockFeedback(null);
    setHoveredPopupHotspotId(null);
    setActiveDialogue(null);
    setIsSettingsMenuOpen(false);
  }, [activeNodePopupId]);

  useEffect(() => {
    return () => {
      clearTravelTimers();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {tipos.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setActiveTipo(tipo.id)}
            className={cn(
              "px-4 py-2 text-xs souls-title tracking-widest border transition-all duration-200",
              activeTipo === tipo.id
                ? "border-[oklch(0.72_0.08_75)] text-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/10%)]"
                : "border-[oklch(0.72_0.08_75/20%)] text-[oklch(0.55_0.01_60)] hover:border-[oklch(0.72_0.08_75/50%)] hover:text-[oklch(0.72_0.08_75)]"
            )}
          >
            {tipo.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTipo}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="border border-[oklch(0.72_0.08_75/18%)] bg-[oklch(0.1_0.005_260/75%)] overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="souls-title text-sm tracking-widest text-[oklch(0.45_0.01_60)]">{labels.empty}</p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 border-b border-[oklch(0.72_0.08_75/15%)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs souls-title tracking-[0.28em] text-[oklch(0.72_0.08_75)]">{labels.mapTitle}</p>
                  <p className="text-xs souls-text text-[oklch(0.55_0.01_60)] mt-1">{labels.mapHint}</p>
                  <p className="text-[10px] souls-text text-[oklch(0.62_0.01_60)] mt-3">
                    {labels.routeState}: {travelerNode?.name ?? "-"}
                  </p>
                  <p className="text-[10px] souls-text text-[oklch(0.55_0.01_60)] mt-2">
                    {travelAnomaly ?? labels.anomalyNone}
                  </p>
                </div>
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetView}
                    className="px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/40%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/8%)] transition-colors"
                  >
                    {labels.resetView}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSettingsMenuOpen((current) => !current)}
                    aria-label={labels.settings}
                    className="h-7 w-7 flex items-center justify-center text-[13px] border border-[oklch(0.72_0.08_75/40%)] text-[oklch(0.72_0.08_75)] hover:bg-[oklch(0.72_0.08_75/8%)] transition-colors"
                  >
                    ⚙
                  </button>

                  {isSettingsMenuOpen && (
                    <div className="absolute right-0 top-9 z-20 min-w-44 border border-[oklch(0.72_0.08_75/30%)] bg-[oklch(0.08_0.005_260/95%)] p-1.5">
                      <button
                        type="button"
                        onClick={resetStoryProgress}
                        className="w-full text-left px-2 py-1.5 text-[10px] souls-title tracking-widest border border-transparent text-[oklch(0.72_0.08_75)] hover:border-[oklch(0.72_0.08_75/30%)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                      >
                        {labels.resetStory}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!hasSeedLocations && (
                <p className="text-[10px] souls-text text-[oklch(0.45_0.01_60)] mt-1">No source locations found in dataset.</p>
              )}
            </div>

            <div
              ref={viewportRef}
              className={cn(
                "relative h-[80vh] overflow-hidden overscroll-contain select-none",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onWheelCapture={handleWheel}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
            >
              <div
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "top left",
                  transition: isDragging ? "none" : "transform 120ms ease-out",
                  width: `${WORLD_WIDTH}px`,
                  height: `${WORLD_HEIGHT}px`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `perspective(1800px) rotateX(${MAP_TILT_X_DEG}deg) rotateZ(${MAP_TILT_Z_DEG}deg)`,
                    transformOrigin: "50% 62%",
                    willChange: "transform",
                  }}
                >
                  <img
                    src={MAP_PLACEHOLDER_SRC}
                    alt="Elden Ring map placeholder"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    draggable={false}
                    style={{
                      filter: "brightness(0.8) saturate(0.75) contrast(1.0)",
                      opacity: 0.78,
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-[oklch(0.08_0.005_260/48%)]" />
                </div>

                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {edgeCurves.map((curve) => {
                    return (
                      <path
                        key={`${curve.from}-${curve.to}`}
                        d={curve.pathD}
                        stroke={curve.isSecretEdge ? "oklch(0.72 0.08 75 / 0.18)" : "oklch(0.72 0.08 75 / 0.35)"}
                        fill="none"
                        strokeWidth={curve.isSecretEdge ? "0.11" : "0.15"}
                        strokeDasharray={curve.isSecretEdge ? "0.22 0.35" : "0.5 0.3"}
                      />
                    );
                  })}
                </svg>

                {travelerNode && (
                  <div
                    className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${travelerPosition.x}%`, top: `${travelerPosition.y}%` }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0_0_0/35%)] blur-[1.5px]" />
                    <span className="block h-3.5 w-3.5 rotate-45 border border-[oklch(0.82_0.14_80/90%)] bg-[oklch(0.82_0.14_80)] shadow-[0_0_10px_oklch(0.82_0.14_80/95%)]" />
                  </div>
                )}

                <div className="absolute inset-0">
                  {nodePositions.map((node, index) => {
                    const slots = getSecretSlots(node.id);
                    const isNodeClickable = true;

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className={cn(
                          "group absolute -translate-x-1/2 -translate-y-[35%]",
                          isNodeClickable && !isTravelerMoving ? "cursor-pointer" : "cursor-not-allowed"
                        )}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseDown={(event) => event.stopPropagation()}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? null : current))}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (isTravelerMoving) {
                            return;
                          }

                          if (node.id === travelerNodeId) {
                            setActiveNodePopupId(node.id);
                            return;
                          }

                          if (!isAdjacentTravelNode(node.id)) {
                            setTravelAnomaly(
                              lang === "es"
                                ? "Solo puedes viajar al nodo anterior o siguiente."
                                : lang === "ja"
                                ? "移動できるのは前後のノードのみです。"
                                : "You can only travel to the previous or next node."
                            );
                            return;
                          }

                          setIsTravelerMoving(true);
                          setActiveNodePopupId(null);
                          setActiveTravelBanner(null);
                          clearTravelTimers();

                          const previousNodeId = travelerNodeId;
                          const previousNode = allNodesById[previousNodeId];
                          const targetNode = allNodesById[node.id];
                          const travelCurve = getTravelCurve(previousNodeId, node.id);

                          if (!previousNode || !targetNode || !travelCurve) {
                            setTravelerNodeId(node.id);
                            setIsTravelerMoving(false);
                            setActiveNodePopupId(node.id);
                            return;
                          }

                          const eventPayload = triggerTravelEvent(previousNodeId, node.id);

                          if (!eventPayload) {
                            animateTravelerOnCurve(travelCurve, 0, 1, TRAVEL_MOVE_DURATION_MS, () => {
                              setTravelerNodeId(node.id);
                              setPendingTravelNodeId(null);
                              setIsTravelerMoving(false);
                              setActiveNodePopupId(node.id);
                            });
                            return;
                          }
                          setPendingTravelNodeId(node.id);

                          animateTravelerOnCurve(travelCurve, 0, 0.5, TRAVEL_MOVE_DURATION_MS, () => {
                            setActiveTravelBanner(eventPayload);
                            playAnomalySound();
                          });
                        }}
                      >
                        <div className="relative flex items-center justify-center w-10 h-10">
                          <span className="absolute h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.08_75)]" />
                          <img
                            src={REST_PIN_ICON_SRC}
                            alt="Rest site pin"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_oklch(0.72_0.08_75/80%)]"
                            draggable={false}
                          />
                        </div>

                        <p
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)] [filter:drop-shadow(0_1px_0_oklch(0_0_0/1))_drop-shadow(0_0_8px_oklch(0_0_0/1))_drop-shadow(0_0_16px_oklch(0_0_0/0.95))] transition-opacity duration-150",
                            hoveredNodeId === node.id ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {node.name}
                        </p>

                        <div
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full z-10 mt-7 w-56 -translate-x-1/2 transition-opacity duration-200",
                            hoveredNodeId === node.id ? "opacity-100" : "opacity-0"
                          )}
                        >
                          <div className="overflow-hidden border border-[oklch(0.55_0.01_60/45%)] bg-[oklch(0.08_0.005_260/92%)]">
                            <div className="relative h-24 bg-[oklch(0.1_0.01_260)]">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={`${node.id}-${hoveredNodeId === node.id ? previewFrame : 0}`}
                                  src={getUnlockedPreviewImages(node.id)[(hoveredNodeId === node.id ? previewFrame : 0)] ?? MAP_PLACEHOLDER_SRC}
                                  alt={node.name}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                              </AnimatePresence>
                              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260/78%)] via-transparent to-transparent" />
                            </div>

                            <div className="px-3 py-2">
                              <p className="souls-text text-[11px] leading-relaxed text-[oklch(0.62_0.01_60)] line-clamp-3">
                                {nodeMetaById[node.id]?.description}
                              </p>
                              <p className="mt-2 souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)]">
                                {lang === "es"
                                  ? `Secretos desbloqueados ${slots.foundSecrets}/${slots.slotCount}`
                                  : lang === "ja"
                                  ? `解放済みの秘密 ${slots.foundSecrets}/${slots.slotCount}`
                                  : `Secrets unlocked ${slots.foundSecrets}/${slots.slotCount}`}
                              </p>
                              <div className="mt-2 flex items-center gap-1.5">
                                {Array.from({ length: slots.slotCount }).map((_, slotIndex) => {
                                  const isFound = slotIndex < slots.foundSecrets;
                                  return (
                                    <span
                                      key={`${node.id}-slot-${slotIndex}`}
                                      className={cn(
                                        "inline-block h-2.5 w-2.5 rounded-full border",
                                        isFound
                                          ? "border-[oklch(0.72_0.08_75)] bg-[oklch(0.72_0.08_75/85%)]"
                                          : "border-[oklch(0.45_0.01_60/60%)] bg-[oklch(0.45_0.01_60/20%)]"
                                      )}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {activePopupNode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.02_0.003_260/70%)] p-2">
                <div className="relative inline-block border border-[oklch(0.55_0.01_60/45%)] bg-[oklch(0.05_0.005_260)]">
                  <div
                    className="relative"
                    onMouseEnter={() => setIsPopupHovered(true)}
                    onMouseLeave={() => {
                      setIsPopupHovered(false);
                      setHoveredPopupHotspotId(null);
                    }}
                  >
                    <img
                      src={activePopupImageSrc}
                      alt={activePopupNode.name}
                      className="block max-h-[90vh] max-w-[94vw] h-auto w-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.005_260/82%)] via-transparent to-transparent" />
                    {visiblePopupHotspots.map((hotspot) => {
                      const isHovered = hoveredPopupHotspotId === hotspot.id;
                      return (
                        <button
                          key={hotspot.id}
                          type="button"
                          className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2",
                            hotspot.type === "character" ? "h-14 w-14" : "h-14 w-14"
                          )}
                          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                          onMouseEnter={() => setHoveredPopupHotspotId(hotspot.id)}
                          onMouseLeave={() => setHoveredPopupHotspotId((current) => (current === hotspot.id ? null : current))}
                          onClick={() => {
                            if (activeDialogue) {
                              return;
                            }
                            handlePopupHotspotClick(hotspot);
                          }}
                          aria-label={getPopupHotspotLabel(hotspot)}
                        >
                          {hotspot.type === "character" ? (
                            <img
                              src={getPopupCharacterPortrait(hotspot)}
                              alt={getPopupHotspotLabel(hotspot)}
                              className={cn(
                                "absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_8px_oklch(0_0_0/75%)] transition-transform duration-150",
                                isHovered ? "scale-105" : "scale-100"
                              )}
                            />
                          ) : (
                            <>
                              <span
                                className={cn(
                                  "absolute left-1/2 top-1/2 block h-1 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 border bg-[oklch(0.9_0.03_95)] shadow-[0_0_6px_oklch(0.9_0.03_95/70%)] transition-all duration-150",
                                  isHovered
                                    ? "border-[oklch(0.9_0.03_95)] opacity-100 scale-100"
                                    : "border-[oklch(0.9_0.03_95/75%)] opacity-0 scale-95"
                                )}
                              />
                              <span
                                className={cn(
                                  "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(0.9_0.02_95/55%)] transition-opacity duration-150",
                                  isHovered ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </>
                          )}
                          <span
                            className={cn(
                              "pointer-events-none absolute left-1/2 top-[125%] -translate-x-1/2 whitespace-nowrap souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)] [filter:drop-shadow(0_1px_0_oklch(0_0_0/1))_drop-shadow(0_0_8px_oklch(0_0_0/1))] transition-opacity duration-150",
                              isHovered ? "opacity-100" : "opacity-0"
                            )}
                          >
                            {getPopupHotspotLabel(hotspot)}
                          </span>
                        </button>
                      );
                    })}
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 p-4 transition-opacity duration-150",
                        isPopupHovered ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {!isPopupInExplorationScene && !activeDialogue && (
                        <>
                          <p className="souls-title text-sm tracking-widest text-[oklch(0.82_0.01_60)]">{activePopupNode.name}</p>
                          <p className="mt-2 souls-text text-sm leading-relaxed text-[oklch(0.62_0.01_60)]">
                            {nodeMetaById[activePopupNode.id]?.description}
                          </p>
                        </>
                      )}
                    </div>

                    {activeDialogue && activeDialogueScript && activeDialogueLine && (
                      <>
                        <div className="pointer-events-none absolute inset-x-3 bottom-[8.75rem] z-20 flex items-end justify-between">
                          <div className="flex items-end gap-2">
                            {leftDialogueParticipants.map((participantSlug) => {
                              const isActiveSpeaker = participantSlug === activeDialogueLine.speakerSlug;
                              return (
                                <div
                                  key={`${activeDialogue?.hotspotId}-${participantSlug}-left`}
                                  className={cn(
                                    "relative w-[22vw] min-w-[130px] max-w-[280px] transition-all duration-200",
                                    isActiveSpeaker
                                      ? "opacity-100 scale-100"
                                      : "opacity-100 brightness-[40%] contrast-90 saturate-[65%] blur-[1.5px] scale-[0.98]"
                                  )}
                                >
                                  <img
                                    src={CHARACTER_PORTRAIT_BY_SLUG[participantSlug] ?? MAP_PLACEHOLDER_SRC}
                                    alt={participantSlug}
                                    className={cn(
                                      "w-full max-h-[62vh] object-contain object-bottom",
                                      isActiveSpeaker
                                        ? "drop-shadow-[0_0_20px_oklch(0.82_0.12_80/70%)]"
                                        : "drop-shadow-[0_0_8px_oklch(0_0_0/40%)]"
                                    )}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-row-reverse items-end gap-2">
                            {rightDialogueParticipants.map((participantSlug) => {
                              const isActiveSpeaker = participantSlug === activeDialogueLine.speakerSlug;
                              return (
                                <div
                                  key={`${activeDialogue?.hotspotId}-${participantSlug}-right`}
                                  className={cn(
                                    "relative w-[22vw] min-w-[130px] max-w-[280px] transition-all duration-200",
                                    isActiveSpeaker
                                      ? "opacity-100 scale-100"
                                      : "opacity-100 brightness-[20%] contrast-90 saturate-[1%] blur-[1.25px] scale-[0.98]"
                                  )}
                                >
                                  <img
                                    src={CHARACTER_PORTRAIT_BY_SLUG[participantSlug] ?? MAP_PLACEHOLDER_SRC}
                                    alt={participantSlug}
                                    className={cn(
                                      "w-full max-h-[62vh] object-contain object-bottom",
                                      isActiveSpeaker
                                        ? "drop-shadow-[0_0_20px_oklch(0.82_0.12_80/70%)]"
                                        : "drop-shadow-[0_0_8px_oklch(0_0_0/40%)]"
                                    )}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="absolute inset-x-3 bottom-14 z-30 border border-[oklch(0.72_0.08_75/45%)] bg-[oklch(0.06_0.005_260/96%)] px-4 py-3">
                          <p className="souls-title text-[10px] tracking-[0.2em] text-[oklch(0.82_0.12_80)]">
                            {getDialogueSpeakerName(activeDialogueLine)}
                          </p>
                          <p className="mt-2 souls-text text-sm leading-relaxed text-[oklch(0.86_0.01_60)]">
                            {getDialogueLineText(activeDialogueLine)}
                          </p>

                          {activeDialogueLine.options && activeDialogueLine.options.length > 0 ? (
                            <div className="mt-3 border-t border-[oklch(0.52_0.01_60/35%)] pt-2">
                              <p className="souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)]">
                                {labels.responsePrompt}
                              </p>
                              <div className="mt-2 flex flex-col gap-2">
                                {activeDialogueLine.options.map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => advanceDialogueToLine(option.nextLineId)}
                                    className="text-left px-3 py-2 text-[11px] souls-text border border-[oklch(0.72_0.08_75/30%)] text-[oklch(0.84_0.02_80)] bg-[oklch(0.08_0.005_260/80%)] hover:bg-[oklch(0.72_0.08_75/12%)] transition-colors"
                                  >
                                    {getDialogueOptionLabel(option)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => advanceDialogueToLine(activeDialogueLine.nextLineId)}
                                className="px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] bg-[oklch(0.08_0.005_260/80%)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                              >
                                {labels.continueDialogue}
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveNodePopupId(null)}
                    className="absolute bottom-3 right-3 z-10 px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.72_0.08_75/45%)] text-[oklch(0.72_0.08_75)] bg-[oklch(0.08_0.005_260/80%)] hover:bg-[oklch(0.72_0.08_75/10%)] transition-colors"
                  >
                    {labels.close}
                  </button>
                  {isPopupInExplorationScene && (
                    <button
                      type="button"
                      onClick={handleReturnToPreviousPopupScene}
                      className="absolute bottom-3 left-3 z-10 px-3 py-1 text-[10px] souls-title tracking-widest border border-[oklch(0.62_0.03_75/45%)] text-[oklch(0.62_0.03_75)] bg-[oklch(0.08_0.005_260/80%)] hover:bg-[oklch(0.62_0.03_75/10%)] transition-colors"
                    >
                      {labels.backToPreviousScene}
                    </button>
                  )}
                  {popupUnlockFeedback && (
                    <p className="pointer-events-none absolute left-3 top-3 z-10 bg-[oklch(0.08_0.005_260/78%)] px-2 py-1 souls-text text-[11px] text-[oklch(0.72_0.08_75)]">
                      {popupUnlockFeedback}
                    </p>
                  )}
                </div>
              </div>
            )}

            <AnimatePresence>
              {activeTravelBanner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed inset-0 z-[60] flex items-center justify-center px-4"
                  onClick={continuePendingTravel}
                >
                  <div className="w-full max-w-3xl border border-[oklch(0.72_0.08_75/35%)] bg-[oklch(0.08_0.005_260/94%)] px-5 py-3 text-center">
                    <p className="souls-title text-[10px] tracking-[0.3em] text-[oklch(0.72_0.08_75)]">{activeTravelBanner.title}</p>
                    <p className="mt-2 souls-text text-sm leading-relaxed text-[oklch(0.62_0.01_60)]">{activeTravelBanner.detail}</p>
                    <p className="mt-3 souls-title text-[10px] tracking-widest text-[oklch(0.72_0.08_75)]">
                      {labels.continueExploration}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
