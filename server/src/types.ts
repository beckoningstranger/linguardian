import { Types } from "mongoose";

type PartOfSpeech =
  | "noun"
  | "pronoun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "determiner"
  | "interjection"
  | "particle"
  | "phrase";

interface LearnedItem {
  id: Types.ObjectId;
  level: number;
  nextReview: Date;
}

type Gender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "common"
  | "animate"
  | "inanimate";

type Case =
  | "nominative"
  | "genitive"
  | "dative"
  | "accusative"
  | "instrumental"
  | "locative"
  | "vocative"
  | "accusative & dative";

type Tags = "intransitive" | "archaic" | "literary" | "slang" | "humorous";

type Frequency =
  | "extremely rare"
  | "rare"
  | "medium"
  | "high"
  | "extremely high";

interface Item {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemmas?: Types.ObjectId[];
  definition?: string;
  translations?: Partial<Record<SupportedLanguage, Types.ObjectId[]>>;
  gender?: Gender;
  pluralForm?: string;
  case?: Case;
  audio?: Types.Array<string>;
  pics?: Types.Array<string>;
  vids?: Types.Array<string>;
  IPA?: Types.Array<string>;
  tags?: Types.Array<Tags>;
  frequency?: Frequency;
  collocations?: Types.ObjectId[];
}

type ItemPopulatedWithTranslations = Omit<Item, "translations"> & {
  translations: Record<SupportedLanguage, ItemPopulatedWithTranslations[]>;
};

interface Lemma {
  language: SupportedLanguage;
  name: string;
  items?: Types.ObjectId[];
}

type ReviewMode =
  | "Translation"
  | "Context"
  | "SpellingBee"
  | "Dictionary"
  | "Visual";

type Difficulty =
  | "Novice"
  | "Advanced Beginner"
  | "Intermediate"
  | "Advanced"
  | "Afficionado";

interface List {
  name: string;
  listNumber: number;
  description?: string;
  image?: string;
  language: SupportedLanguage;
  difficulty?: Difficulty;
  // authors: Types.ObjectId[];
  authors: string[];
  private: Boolean;
  units?: { unitName: string; item: Types.ObjectId }[];
  unitOrder?: string[];
  unlockedReviewModes?: Record<SupportedLanguage, Types.Array<ReviewMode>>;
  learners?: Types.ObjectId[];
}

interface ListStats {
  unlearned: number;
  readyToReview: number;
  learned: number;
  learning: number;
  ignored: number;
}

type ListWithStats = List & {
  stats: ListStats;
};

type FullyPopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: ItemPopulatedWithTranslations }[];
};

type PopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: Item }[];
};

type SupportedLanguage = "DE" | "EN" | "FR" | "CN";

interface SRSettings {
  reviewTimes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
  itemsPerSession: { learning: number; reviewing: number };
}

interface LanguageFeatures {
  langName: string;
  langCode: SupportedLanguage;
  flagCode: string;
  requiresHelperKeys?: string[];
  hasGender?: Gender[];
  hasCases?: Case[];
}

interface GlobalSettings {
  id: number;
  supportedLanguages: SupportedLanguage[];
  languageFeatures: LanguageFeatures[];
  defaultSRSettings: SRSettings;
}

interface LearnedLanguage {
  code: SupportedLanguage;
  name: string;
  flag: string;
  learnedItems: LearnedItem[];
  learnedLists: Types.ObjectId[];
  customSRSettings?: SRSettings;
}

type LearnedLanguageWithPopulatedLists = Omit<
  LearnedLanguage,
  "learnedLists"
> & {
  learnedLists: List[];
};

interface User {
  id: number;
  alias: string;
  native: SupportedLanguage;
  languages: LearnedLanguage[];
}

export type {
  User,
  GlobalSettings,
  LearnedLanguage,
  LearnedLanguageWithPopulatedLists,
  Lemma,
  SRSettings,
  Item,
  ItemPopulatedWithTranslations,
  ReviewMode,
  List,
  ListStats,
  ListWithStats,
  PopulatedList,
  FullyPopulatedList,
  LanguageFeatures,
  Gender,
  PartOfSpeech,
  LearnedItem,
  Case,
  SupportedLanguage,
  Frequency,
  Tags,
};
