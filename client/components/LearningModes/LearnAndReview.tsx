"use client";

import {
  ItemToLearn,
  LanguageFeatures,
  LearningMode,
  SupportedLanguage,
} from "@/types";
import TopBar from "./TopBar";
import ItemPrompt from "./ItemPrompt";
import { useState } from "react";
import ItemPresentation from "./ItemPresentation";
import MultipleChoice from "./MultipleChoice";
import PuzzleMode from "./PuzzleMode";
import BetterSolutionInput from "./TypeSolution";
import { useRouter } from "next/navigation";

interface LearnAndReviewProps {
  listName: string;
  userNative: SupportedLanguage;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
  allItemStringsInList: string[];
  mode: LearningMode;
}

export type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function LearnAndReview({
  listName,
  userNative,
  items,
  targetLanguageFeatures,
  allItemStringsInList,
  mode,
}: LearnAndReviewProps) {
  const [itemsToLearn, setItemsToLearn] = useState<ItemToLearn[]>(items);
  const [activeItem, setActiveItem] = useState<ItemToLearn>(items[0]);
  const [numberOfLearnedItems, setNumberOfLearnedItems] = useState<number>(0);
  const [itemPresentation, setItemPresentation] = useState<Boolean>(true);
  const [sessionEnd, setSessionEnd] = useState<Boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<string>("");

  const router = useRouter();

  function evaluateUserAnswer(
    status: Omit<ReviewStatus, "neutral">,
    answer: string
  ) {
    if (status === "incorrect") {
      activeItem.learningStep--;
      setItemsToLearn(itemsToLearn);
      setWrongAnswer(answer);
      return setItemPresentation(true);
    }
    if (status === "correct") {
      if (activeItem.learningStep === 0) activeItem.firstPresentation === false;

      activeItem.learningStep = activeItem.learningStep + 1;
      const removedItem = itemsToLearn.shift();
      let newItemOrder: ItemToLearn[] = [];

      switch (removedItem?.learningStep) {
        case 1:
          newItemOrder = [
            ...itemsToLearn.slice(0, 2),
            removedItem!,
            ...itemsToLearn.slice(2),
          ];
          break;
        case 2:
        case 3:
          itemsToLearn.push(removedItem);
          newItemOrder = itemsToLearn;
          break;
        case 4:
          setNumberOfLearnedItems(numberOfLearnedItems + 1);
          newItemOrder = itemsToLearn;
          break;
        default:
          console.log(
            "Something went wrong in switch statement, received",
            removedItem?.learningStep
          );
      }

      if (newItemOrder[0] && newItemOrder[0].learningStep === 0) {
        setItemPresentation(true);
      } else setItemPresentation(false);

      if (newItemOrder.length === 0) {
        setSessionEnd(true);
        return;
      }
      setItemsToLearn([...newItemOrder]);
      setActiveItem([...newItemOrder][0]);
    }
  }

  if (sessionEnd) {
    console.log("Session ends");
    setTimeout(() => {
      return router.push("/dashboard");
    }, 5000);
  }

  return (
    <div className="grid place-items-center">
      <TopBar
        listName={listName}
        itemsInProgress={numberOfLearnedItems}
        totalItems={itemsToLearn.length + numberOfLearnedItems}
        mode={mode}
      />
      <div className="mt-3 flex w-[95%] flex-col gap-3">
        {!itemPresentation && (
          <ItemPrompt item={activeItem} userNative={userNative} />
        )}
        {itemPresentation && (
          <ItemPresentation
            item={activeItem}
            wrongSolution={wrongAnswer}
            endPresentation={evaluateUserAnswer}
            userNative={userNative}
          />
        )}
        {!itemPresentation && activeItem.learningStep === 1 && (
          <MultipleChoice
            options={createMultipleChoiceOptions(
              allItemStringsInList,
              activeItem
            )}
            correctItem={activeItem}
            evaluate={evaluateUserAnswer}
          />
        )}
        {!itemPresentation && activeItem.learningStep === 2 && (
          <PuzzleMode
            item={activeItem}
            evaluate={evaluateUserAnswer}
            initialPuzzlePieces={createPuzzlePieces(activeItem)}
          />
        )}
        {!itemPresentation && activeItem.learningStep === 3 && (
          <BetterSolutionInput
            targetLanguageFeatures={targetLanguageFeatures}
            item={activeItem}
            evaluate={evaluateUserAnswer}
          />
        )}
      </div>
    </div>
  );
}

function createMultipleChoiceOptions(
  moreItems: string[],
  correctItem: ItemToLearn
) {
  const wrongOptions: string[] = [];
  let numberOfOptions = 0;
  if (moreItems.length >= 7) {
    numberOfOptions = 7;
  } else numberOfOptions = moreItems.length;
  moreItems
    .filter((item) => item.split(" ").length === 2)
    .forEach((option) => {
      if (option !== correctItem.name) wrongOptions.push(option);
    });

  let stringLengthDifference = 0;
  while (wrongOptions.length < numberOfOptions && stringLengthDifference < 10) {
    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItem.name.length + stringLengthDifference &&
          itemx !== correctItem.name
      )
      .forEach((option) => wrongOptions.push(option));
    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItem.name.length - stringLengthDifference &&
          itemx !== correctItem.name
      )
      .forEach((option) => wrongOptions.push(option));
    stringLengthDifference += 1;
  }
  const options = wrongOptions.slice(0, numberOfOptions);
  options.push(correctItem.name);

  const shuffledOptions = arrayShuffle(options);

  return shuffledOptions;
}

export function arrayShuffle(array: string[]) {
  // Durstenfeld Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createPuzzlePieces(item: ItemToLearn) {
  const amountOfPieces = 6;
  const pieceLength = Math.ceil(item.name.length / amountOfPieces);
  const itemString = item.name;
  let puzzlePieces: string[] = [];
  for (let x = 0; x < amountOfPieces; x++) {
    puzzlePieces.push(itemString.slice(x * pieceLength, pieceLength * (x + 1)));
  }
  const puzzlePiecesWithoutEmptyOnes = puzzlePieces.filter(
    (piece) => piece.length > 0 && piece !== " "
  );
  const shuffledPieces = arrayShuffle(puzzlePiecesWithoutEmptyOnes);
  return shuffledPieces;
}
