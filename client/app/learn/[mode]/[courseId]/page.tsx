"use client";
import { Item } from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import { useParams } from "next/navigation";

const items: Item[] = [
  {
    id: 1,
    partOfSpeech: "noun",
    gender: {
      DE: "neuter",
      FR: "masculine",
    },
    meaning: {
      DE: "Auge",
      EN: "eye",
      FR: "oeil",
    },
    plural: {
      DE: "Augen",
      EN: "eyes",
      FR: "yeux",
    },
  },
  {
    id: 2,
    partOfSpeech: "noun",
    gender: {
      DE: "masculine",
      FR: "feminine",
    },
    meaning: {
      DE: "Kopf",
      EN: "head",
      FR: "tête",
    },
    plural: {
      DE: "Köpfe",
      EN: "heads",
      FR: "têtes",
    },
  },
  {
    id: 3,
    partOfSpeech: "noun",
    gender: { DE: "feminine", FR: "masculine" },
    meaning: { DE: "Liebe", EN: "love", FR: "amour" },
    plural: { DE: "Lieben", EN: "loves", FR: "amours" },
  },
  {
    id: 4,
    partOfSpeech: "adjective",
    meaning: { DE: "dick", EN: "fat", FR: "gros" },
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
