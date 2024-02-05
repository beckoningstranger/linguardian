"use client";
import DictionaryMode from "@/components/LearningModes/DictionaryMode";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import { useParams } from "next/navigation";

interface item {
  partOfSpeech: string;
  gender: {
    German?: string;
    French?: string;
    English?: string;
    Chinese?: string;
    Swedish?: string;
  };
  meaning: {
    German?: string[];
    English?: string[];
    French?: string[];
  };
}

const items: item[] = [
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
  type ReviewParams = {
    pair: string;
    mode: string;
    courseId: string;
  };
  const { pair, mode, courseId } = useParams<ReviewParams>();

  const [native, target] = pair.split("-");

  switch (mode) {
    case "translation":
      return (
        <TranslationMode
          source={native}
          target={target}
          id={Number(courseId)}
        />
      );
    case "learn":
      return (
        <LearnNewWordsMode
          source={native}
          target={target}
          id={Number(courseId)}
        />
      );
    case "dictionary":
      return (
        <DictionaryMode source={native} target={target} id={Number(courseId)} />
      );
    default:
      throw new Error("Unknown Learning Mode");
  }
}
