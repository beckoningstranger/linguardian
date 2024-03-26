"use client";

import { ItemToLearn, LanguageFeatures, SupportedLanguage } from "@/types";
import TopBar from "./TopBar";
import SolutionInput from "./SolutionInput";
import LearnReviewElementContainer from "./LearnReviewElementContainer";
import ItemPrompt from "./ItemPrompt";
import HelperKeys from "./HelperKeys";
import { useEffect, useRef, useState } from "react";
import { MobileMenuContextProvider } from "../Menus/MobileMenu/MobileMenuContext";
import { ReviewStatus } from "./TranslationMode";
import ItemPresentation from "./ItemPresentation";
import MultipleChoice from "./MultipleChoice";

interface LearnNewWordsModeProps {
  listName: string;
  userNative: SupportedLanguage;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
  allItemsInList: string[];
}

export default function LearnNewWordsMode({
  listName,
  userNative,
  items,
  targetLanguageFeatures,
  allItemsInList,
}: LearnNewWordsModeProps) {
  const [solution, setSolution] = useState("");
  const solutionInputRef = useRef<HTMLInputElement>(null);
  const [itemsToLearn, setItemsToLearn] = useState<ItemToLearn[]>(items);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [itemPresentation, setItemPresentation] = useState<Boolean>(false);

  useEffect(() => {
    if (itemsToLearn[0].learningStep === 0) {
      setItemPresentation(true);
    } else setItemPresentation(false);
  }, [itemsToLearn]);

  function evaluateUserAnswer(status: Omit<ReviewStatus, "neutral">) {
    const newItemsToLearn = [...itemsToLearn];
    if (status === "incorrect") {
      newItemsToLearn[0].learningStep === 1;
    } else {
      newItemsToLearn[0].learningStep += 1;
    }
    const removedItem = newItemsToLearn.shift();
    setItemsToLearn([
      ...newItemsToLearn.slice(0, 2),
      removedItem!,
      ...newItemsToLearn.slice(2),
    ]);
    setSolution("");
  }

  return (
    <div className="grid place-items-center">
      <TopBar
        listName={listName}
        itemsInProgress={0}
        totalItems={items.length}
        mode="learn"
      />
      <LearnReviewElementContainer>
        {!itemPresentation && (
          <>
            <ItemPrompt item={itemsToLearn[0]} userNative={userNative} />
            {itemsToLearn[0].learningStep === 3 && (
              <MobileMenuContextProvider>
                <HelperKeys
                  targetLanguageFeatures={targetLanguageFeatures}
                  solution={solution}
                  setSolution={setSolution}
                  hide={false}
                  inputRef={solutionInputRef}
                />
              </MobileMenuContextProvider>
            )}
          </>
        )}
        {itemPresentation && (
          <ItemPresentation
            firstPresentation={
              itemsToLearn[0].learningStep === 0 ? true : false
            }
            item={itemsToLearn[0]}
            userSolution={solution}
            endPresentation={evaluateUserAnswer}
          />
        )}
        {itemsToLearn[0].learningStep === 1 && (
          <MultipleChoice
            options={generateOptions(allItemsInList, itemsToLearn[0])}
            correctItem={itemsToLearn[0]}
            evaluate={evaluateUserAnswer}
          />
        )}
        {itemsToLearn[0].learningStep === 2 && "2nd learning step"}
        {itemsToLearn[0].learningStep === 3 && (
          <SolutionInput
            inputRef={solutionInputRef}
            targetLanguageFeatures={targetLanguageFeatures}
            solution={solution}
            setSolution={setSolution}
            reviewStatus={reviewStatus}
            setReviewStatus={setReviewStatus}
            disable={false}
            item={itemsToLearn[0]}
            setMoreReviews={() => {}}
            finalizeReview={() => {}}
          />
        )}
      </LearnReviewElementContainer>
    </div>
  );
}

function generateOptions(moreItems: string[], correctItem: ItemToLearn) {
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

  // Durstenfeld Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}
