"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { updateLearnedItems } from "@/lib/actions";
import {
  ItemForServer,
  ItemToLearn,
  LanguageFeatures,
  LearningMode,
  SupportedLanguage,
  User,
} from "@/lib/types";
import ItemPresentation from "./ItemPresentation";
import ItemPrompt from "./ItemPrompt";
import LearningHeader from "./LearningHeader";
import MultipleChoice from "./MultipleChoice";
import PuzzleMode from "./PuzzleMode";
import TypeSolution from "./TypeSolution";

interface LearnAndReviewProps {
  listName: string;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
  allItemStringsInList: string[];
  mode: LearningMode;
  user: User;
  from: "dashboard" | number;
}

export type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function LearnAndReview({
  listName,
  items,
  targetLanguageFeatures,
  allItemStringsInList,
  mode,
  user,
  from,
}: LearnAndReviewProps) {
  const [itemsToLearn, setItemsToLearn] = useState<ItemToLearn[]>(items);
  const [activeItem, setActiveItem] = useState<ItemToLearn>(items[0]);
  const [learnedItems, setLearnedItems] = useState<ItemToLearn[]>([]);
  const [itemPresentation, setItemPresentation] = useState<boolean>(
    mode === "learn" ? true : false
  );
  const [sessionEnd, setSessionEnd] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<string>("");

  const evaluateUserAnswer = useCallback(
    (status: Omit<ReviewStatus, "neutral">, answer: string) => {
      setWrongAnswer(status === "incorrect" ? answer : "");

      if (status === "incorrect") {
        activeItem.learningStep--;
        if (mode !== "learn") activeItem.increaseLevel = false;
        setItemPresentation(true);
      }

      if (status === "correct") {
        activeItem.learningStep++;
        if (activeItem.learningStep === 4)
          setLearnedItems([...learnedItems, activeItem]);

        const remainingItemsToLearn = itemsToLearn.slice(1);
        if (
          remainingItemsToLearn.length === 0 &&
          activeItem.learningStep === 4
        ) {
          setSessionEnd(true);
          return;
        }

        switch (activeItem.learningStep) {
          case 1:
            setItemsToLearn([
              ...remainingItemsToLearn.slice(0, 2),
              activeItem,
              ...remainingItemsToLearn.slice(2),
            ]);
            break;
          case 2:
          case 3:
            setItemsToLearn([...remainingItemsToLearn, activeItem]);
            break;
          case 4:
            setItemsToLearn(remainingItemsToLearn);
            break;
        }

        setItemPresentation(
          remainingItemsToLearn.length > 0
            ? remainingItemsToLearn[0]?.learningStep === 0
            : activeItem.learningStep === 0
        );
        setActiveItem(
          remainingItemsToLearn.length > 0
            ? remainingItemsToLearn[0]
            : activeItem
        );
      }
    },
    [activeItem, mode, learnedItems, itemsToLearn]
  );

  useEffect(() => {
    if (sessionEnd) {
      passDataToServer(learnedItems, user.id, activeItem.language, mode);
    }
  }, [sessionEnd, learnedItems, user.id, activeItem, mode]);

  return sessionEnd ? null : (
    <>
      <LearningHeader
        listLanguage={targetLanguageFeatures.langCode}
        listName={listName}
        itemsInProgress={learnedItems.length}
        totalItems={itemsToLearn.length + learnedItems.length}
        mode={mode}
        from={from}
      />
      {!itemPresentation && (
        <ItemPrompt item={activeItem} userNative={user.native.code} />
      )}
      {itemPresentation && (
        <ItemPresentation
          item={activeItem}
          wrongSolution={wrongAnswer}
          endPresentationFunction={evaluateUserAnswer}
          user={user}
        />
      )}
      {!itemPresentation && activeItem.learningStep === 1 && (
        <MultipleChoice
          correctItem={activeItem}
          evaluate={evaluateUserAnswer}
          allItemStringsInList={allItemStringsInList}
        />
      )}
      {!itemPresentation && activeItem.learningStep === 2 && (
        <PuzzleMode itemName={activeItem.name} evaluate={evaluateUserAnswer} />
      )}
      {!itemPresentation && activeItem.learningStep === 3 && (
        <TypeSolution
          targetLanguageFeatures={targetLanguageFeatures}
          item={activeItem}
          evaluate={evaluateUserAnswer}
        />
      )}
    </>
  );
}

async function passDataToServer(
  learnedItems: ItemToLearn[],
  userId: string,
  language: SupportedLanguage,
  mode: LearningMode
) {
  const itemsForServer: ItemForServer[] = learnedItems.map((item) => ({
    id: item._id.toString(),
    increaseLevel: item.increaseLevel,
  }));

  toast.promise(updateLearnedItems(itemsForServer, language, userId, mode), {
    loading: "Updating your learning data...",
    success: "Learning data updated! 🎉",
    error: (err) => err.toString(),
  });
}
