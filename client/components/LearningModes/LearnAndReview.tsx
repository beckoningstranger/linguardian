"use client";

import { updateLearnedItems } from "@/lib/actions";
import { arrayShuffle } from "@/lib/helperFunctionsClient";
import {
  ItemForServer,
  ItemToLearn,
  LanguageFeatures,
  LearningMode,
  SupportedLanguage,
  User,
} from "@/lib/types";
import { useEffect, useState } from "react";
import ItemPresentation from "./ItemPresentation";
import ItemPrompt from "./ItemPrompt";
import MultipleChoice from "./MultipleChoice";
import PuzzleMode from "./PuzzleMode";
import TopBar from "./TopBar";
import BetterSolutionInput from "./TypeSolution";
import { useSession } from "next-auth/react";

interface LearnAndReviewProps {
  listName: string;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
  allItemStringsInList: string[];
  mode: LearningMode;
}

export type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function LearnAndReview({
  listName,
  items,
  targetLanguageFeatures,
  allItemStringsInList,
  mode,
}: LearnAndReviewProps) {
  const { data } = useSession();
  const user = data?.user as User;
  const [itemsToLearn, setItemsToLearn] = useState<ItemToLearn[]>(items);
  const [activeItem, setActiveItem] = useState<ItemToLearn>(items[0]);
  const [learnedItems, setLearnedItems] = useState<ItemToLearn[]>([]);
  const [itemPresentation, setItemPresentation] = useState<boolean>(
    mode === "learn" ? true : false
  );
  const [sessionEnd, setSessionEnd] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<string>("");

  function evaluateUserAnswer(
    status: Omit<ReviewStatus, "neutral">,
    answer: string
  ) {
    if (status === "incorrect") {
      activeItem.learningStep--;
      if (mode !== "learn") activeItem.increaseLevel = false;
      setItemsToLearn(itemsToLearn);
      setWrongAnswer(answer);
      return setItemPresentation(true);
    }
    if (status === "correct") {
      setWrongAnswer("");
      if (activeItem.learningStep === 0) activeItem.firstPresentation === false;

      activeItem.learningStep = activeItem.learningStep + 1;
      const removedItem = itemsToLearn.shift();
      let newItemOrder: ItemToLearn[] = [];

      const newLearnedItems = [...learnedItems];
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
          newLearnedItems.push(activeItem);
          setLearnedItems(newLearnedItems);
          newItemOrder = itemsToLearn;
          break;
      }

      if (newItemOrder[0] && newItemOrder[0].learningStep === 0) {
        setItemPresentation(true);
      } else setItemPresentation(false);

      setItemsToLearn([...newItemOrder]);

      if (newItemOrder.length === 0) {
        setSessionEnd(true);
        return;
      }
      setActiveItem([...newItemOrder][0]);
    }
  }

  useEffect(() => {
    if (sessionEnd) {
      passDataToServer(learnedItems, user.id, activeItem.language, mode);
    }
  }, [sessionEnd, activeItem, mode, user.id, learnedItems]);

  if (!sessionEnd)
    return (
      <div className="grid place-items-center">
        <TopBar
          listName={listName}
          itemsInProgress={learnedItems.length}
          totalItems={itemsToLearn.length + learnedItems.length}
          mode={mode}
        />
        <div className="mt-3 flex w-[95%] flex-col gap-3">
          {!itemPresentation && (
            <ItemPrompt item={activeItem} userNative={user.native.code} />
          )}
          {itemPresentation && (
            <ItemPresentation
              item={activeItem}
              wrongSolution={wrongAnswer}
              endPresentation={evaluateUserAnswer}
              userNative={user.native.code}
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
  return "Updating data on server...";
}

function passDataToServer(
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

  (async () => {
    await updateLearnedItems(itemsForServer, language, userId, mode);
  })();
}

function createMultipleChoiceOptions(
  moreItems: string[],
  correctItem: ItemToLearn
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
      if (option !== correctItem.name) wrongOptions.push(option);
    });

  let stringLengthDifference = 0;
  while (wrongOptions.length < numberOfOptions && stringLengthDifference < 10) {
    const newOptions: string[] = [];
    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItem.name.length + stringLengthDifference &&
          itemx !== correctItem.name
      )
      .forEach((option) => newOptions.push(option));

    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItem.name.length - stringLengthDifference &&
          itemx !== correctItem.name
      )
      .forEach((option) => newOptions.push(option));
    newOptions.forEach((option) => {
      if (!wrongOptions.includes(option)) wrongOptions.push(option);
    });
    stringLengthDifference += 1;
  }
  const options = wrongOptions.slice(0, numberOfOptions);
  options.push(correctItem.name);

  const shuffledOptions = arrayShuffle(options);

  return shuffledOptions;
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
