"use client";

import { useCallback, useState } from "react";

import ItemPresentation from "@/components/LearningModes/ItemPresentation";
import ItemPrompt from "@/components/LearningModes/ItemPrompt";
import LearningHeader from "@/components/LearningModes/LearningHeader";
import MultipleChoice from "@/components/LearningModes/MultipleChoice";
import PuzzleMode from "@/components/LearningModes/PuzzleMode";
import TypeSolution from "@/components/LearningModes/TypeSolution";
import { useUser } from "@/context/UserContext";
import {
  ItemToLearn,
  LanguageFeatures,
  LearningMode,
} from "@linguardian/shared/contracts";
import { useLearningSessionSync } from "@/lib/hooks/useLearningSessionSync";

interface LearnAndReviewProps {
  listName: string;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
  allItemStringsInList: string[];
  mode: LearningMode;
  from: "dashboard" | number;
  overstudy: boolean;
}

export type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function LearnAndReview({
  listName,
  items,
  targetLanguageFeatures,
  allItemStringsInList,
  mode,
  from,
  overstudy,
}: LearnAndReviewProps) {
  const [itemsToLearn, setItemsToLearn] = useState<ItemToLearn[]>(items);
  const [activeItem, setActiveItem] = useState<ItemToLearn>(items[0]);
  const [learnedItems, setLearnedItems] = useState<ItemToLearn[]>([]);
  const [itemPresentation, setItemPresentation] = useState<boolean>(
    mode === "learn" ? true : false
  );
  const [wrongAnswer, setWrongAnswer] = useState<string>("");
  const { user } = useUser();
  if (!user) throw new Error("Could not get user from context");

  const { sendSessionData } = useLearningSessionSync();

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
          const finalLearnedItems: ItemToLearn[] = [
            ...learnedItems,
            activeItem,
          ];
          (async () => {
            await sendSessionData(
              finalLearnedItems,
              activeItem.language,
              overstudy ? "overstudy" : mode
            );
          })();
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
    [activeItem, mode, learnedItems, itemsToLearn, sendSessionData, overstudy]
  );

  return (
    <>
      <LearningHeader
        listLanguage={targetLanguageFeatures.langCode}
        listName={listName}
        itemsInProgress={learnedItems.length}
        totalItems={items.length}
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
