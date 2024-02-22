"use client";
import { Item } from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import { useParams } from "next/navigation";

const items: Item[] = [
  {
    name: "Auge",
    language: "DE",
    pluralForm: "Augen",
    gender: "neuter",
    partOfSpeech: "noun",
    translation: {
      FR: "oeil",
      EN: "eye",
    },
  },
  {
    name: "Kopf",
    language: "DE",
    pluralForm: "Köpfe",
    gender: "masculine",
    partOfSpeech: "noun",
    translation: {
      FR: "tête",
      EN: "head",
    },
  },
  {
    name: "Liebe",
    language: "DE",
    pluralForm: "Lieben",
    gender: "feminine",
    partOfSpeech: "noun",
    translation: {
      FR: "amour",
      EN: "love",
    },
  },
  {
    name: "dick",
    language: "DE",
    partOfSpeech: "adjective",
    translation: {
      FR: "gros, épais",
      EN: "thick, fat",
    },
  },
];

export default function ReviewPage() {
  type ReviewParams = {
    pair: string;
    mode: string;
    listIdString: string;
  };
  const { mode, listIdString } = useParams<ReviewParams>();
  const courseId = Number(listIdString);

  // This is where we look up the list's name based on the passed listIdString
  const listName = "Example list";

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  switch (mode) {
    case "translation":
      return <TranslationMode items={items} listName={listName} />;
    case "learn":
      return <LearnNewWordsMode items={items} listName={listName} />;
    default:
      throw new Error("Unknown Learning Mode");
  }
}
