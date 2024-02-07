"use client";
import { GlobalContext, Item } from "@/app/context/GlobalContext";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import { useParams } from "next/navigation";
import { useContext } from "react";

const items: Item[] = [
  {
    partOfSpeech: "noun",
    gender: {
      DE: "n",
      FR: "f",
    },
    meaning: {
      DE: ["Auto", "Wagen"],
      EN: ["car"],
      FR: ["voiture"],
    },
  },
  {
    partOfSpeech: "noun",
    gender: {
      DE: "m",
      FR: "f",
    },
    meaning: {
      DE: ["Kopf"],
      EN: ["head"],
      FR: ["tête"],
    },
  },
  {
    partOfSpeech: "noun",
    gender: { DE: "f", FR: "m" },
    meaning: { DE: ["Liebe"], EN: ["love"], FR: ["amour"] },
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

  // This is where we look up targetLanguage (currentlyActiveLanguage) and source language (user's native language)
  const {
    user: { native },
    currentlyActiveLanguage: target,
  } = useContext(GlobalContext);

  // This is where we look up the list's name based on the passed listIdString
  const listName = "Example course";

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  if (target && native) {
    switch (mode) {
      case "translation":
        return (
          <TranslationMode
            items={items}
            listName={listName}
            target={target}
            native={native}
          />
        );
      case "learn":
        return <LearnNewWordsMode items={items} listName={listName} />;
      default:
        throw new Error("Unknown Learning Mode");
    }
  } else throw new Error("Target or Native language is not defined");
}
