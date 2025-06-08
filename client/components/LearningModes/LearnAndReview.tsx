"use client";

import { updateLearnedItems } from "@/lib/actions";
import { arrayShuffle } from "@/lib/helperFunctionsClient";
import {
  ItemForServer,
  ItemToLearn,
  LanguageFeatures,
  LearningMode,
  PuzzlePieceObject,
  SupportedLanguage,
  User,
} from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  }, [sessionEnd, activeItem, mode, user.id, learnedItems]);

  const multipleChoiceOptions = useMemo(
    () => createMultipleChoiceOptions(allItemStringsInList, activeItem.name),
    [allItemStringsInList, activeItem]
  );

  const puzzlePieces = useMemo(
    () => createPuzzlePieces(activeItem.name),
    [activeItem]
  );

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
      <div className="absolute inset-0 top-[116px] h-[calc(100vh-116px)]">
        {!itemPresentation && (
          <ItemPrompt item={activeItem} userNative={user.native.code} />
        )}
        <div>
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
              options={multipleChoiceOptions}
              correctItem={activeItem}
              evaluate={evaluateUserAnswer}
            />
          )}
          {!itemPresentation && activeItem.learningStep === 2 && (
            <PuzzleMode
              itemName={activeItem.name}
              evaluate={evaluateUserAnswer}
              initialPuzzlePieces={puzzlePieces}
            />
          )}
          {!itemPresentation && activeItem.learningStep === 3 && (
            <TypeSolution
              targetLanguageFeatures={targetLanguageFeatures}
              item={activeItem}
              evaluate={evaluateUserAnswer}
            />
          )}
        </div>
      </div>
    </>
  );
}

async function passDataToServer(
  learnedItems: ItemToLearn[],
  userId: string,
  language: SupportedLanguage,
  mode: LearningMode
) {
  const itemsForServer: ItemForServer[] = learnedItems.map((item) => {
    return {
      id: item._id.toString(),
      increaseLevel: item.increaseLevel,
    };
  });

  toast.promise(updateLearnedItems(itemsForServer, language, userId, mode), {
    loading: "Updating your learning data...",
    success: "Learning data updated! 🎉",
    error: (err) => err.toString(),
  });
}

function createMultipleChoiceOptions(
  moreItems: string[],
  correctItemName: string
) {
  const wrongOptions: string[] = [];
  let numberOfOptions = 0;
  const maxNumberOfOptions = 7;
  if (moreItems.length >= maxNumberOfOptions) {
    numberOfOptions = maxNumberOfOptions;
  } else numberOfOptions = moreItems.length;

  moreItems
    .filter((item) => item.split(" ").length === 2)
    .forEach((option) => {
      if (option !== correctItemName) wrongOptions.push(option);
    });

  let stringLengthDifference = 0;
  while (wrongOptions.length < numberOfOptions && stringLengthDifference < 10) {
    const newOptions: string[] = [];
    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItemName.length + stringLengthDifference &&
          itemx !== correctItemName
      )
      .forEach((option) => newOptions.push(option));

    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItemName.length - stringLengthDifference &&
          itemx !== correctItemName
      )
      .forEach((option) => newOptions.push(option));
    newOptions.forEach((option) => {
      if (!wrongOptions.includes(option)) wrongOptions.push(option);
    });
    stringLengthDifference += 1;
  }
  const options = wrongOptions.slice(0, numberOfOptions);
  options.push(correctItemName);

  return arrayShuffle(options);
}

function createPuzzlePieces(itemName: string) {
  const amountOfPieces = 6;
  const pieceLength = Math.ceil(itemName.length / amountOfPieces);
  const itemString = itemName;
  let puzzlePieces: string[] = [];
  for (let x = 0; x < amountOfPieces; x++) {
    puzzlePieces.push(itemString.slice(x * pieceLength, pieceLength * (x + 1)));
  }
  const puzzlePiecesWithoutEmptyOnes = puzzlePieces.filter(
    (piece) => piece.length > 0 && piece !== " "
  );

  const puzzlePieceObjects = puzzlePiecesWithoutEmptyOnes.map(
    (piece, index) => ({
      position: index + 1,
      content: piece,
      first: index === 0,
      last: index === puzzlePiecesWithoutEmptyOnes.length - 1,
    })
  );

  return arrayShuffle<PuzzlePieceObject>(puzzlePieceObjects);
}
