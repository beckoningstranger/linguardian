"use client";
import DictionaryMode from "@/components/LearningModes/DictionaryMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import { useParams } from "next/navigation";

const items = [
  {
    partOfSpeech: "noun",
    gender: {
      German: "n",
      French: "f",
    },
    meaning: {
      German: ["das Auto", "der Wagen"],
      English: ["the car"],
      French: ["la voiture"],
    },
  },
  {
    partOfSpeech: "noun",
    gender: {
      German: "m",
      French: "f",
    },
    meaning: {
      German: ["der Kopf"],
      English: ["head"],
      French: ["la tete"],
    },
  },
  {
    partOfSpeech: "noun",
    gender: { German: "f", French: "m" },
    meaning: { German: ["die Liebe"], English: ["love"], French: ["l'amour"] },
  },
];

export default function ReviewPage() {
  const { mode, courseId } = useParams();

  switch (mode) {
    case "translation":
      return <TranslationMode />;
    case "learn":
      return <DictionaryMode />;
    default:
      throw new Error("Unknown Learning Mode");
  }
}
