export interface WordEntry {
  id: string;
  word: string;
  pronunciation: string;
  grammatical_category: string;
  language: "it" | "en";
  etymology: string;
  definition: string;
  example: string;
  date?: string;
}

// ── Aggiungi le tue parole qui ──────────────────────────────────────────────
const words: WordEntry[] = [
  {
    id: "1",
    word: "vellichor",
    pronunciation: "vel·li·kòr",
    grammatical_category: "s.m.",
    language: "it",
    etymology: "Dal lat. vellus, «velo sottile», e gr. χορός, «danza circolare». Come un sipario che si apre su un'altra epoca.",
    definition: "La strana malinconia che si prova in una libreria antiquaria: la consapevolezza che ogni volume custodisce una vita intera di pensieri scritti da qualcuno che non sapeva che avresti letto quelle pagine.",
    example: "Entrò nella bottega cercando un testo di botanica e rimase paralizzato dal vellichor, incapace di andarsene.",
    date: "2024-11",
  },
  {
    id: "2",
    word: "sondrift",
    pronunciation: "sɒn·drɪft",
    grammatical_category: "n.",
    language: "en",
    etymology: "From Old Norse sonr, «sound», and drift, «to wander». The mind that follows a melody wherever it leads.",
    definition: "The involuntary mental journey triggered by a familiar song: a sequence of memories, moods, and half-forgotten scenes that surface without effort, carried by the music.",
    example: "He sat motionless through the whole record, lost in a deep sondrift that took him back twenty years.",
    date: "2024-12",
  },
  {
    id: "3",
    word: "lumèndra",
    pronunciation: "lu·mèn·dra",
    grammatical_category: "s.f.",
    language: "it",
    etymology: "Dal lat. lumen, «luce», con suffisso aggettivale -andra sul modello di salamandra. La luce che si muove come un animale vivo.",
    definition: "Il riflesso tremolante della luce sull'acqua o su un soffitto bianco, in particolare quando sembra avere un moto autonomo, quasi respirasse.",
    example: "Le lumèndre del lago danzavano sul soffitto della stanza e lei non riusciva a smettere di guardarle.",
    date: "2025-01",
  },
];
// ────────────────────────────────────────────────────────────────────────────

export default words;
