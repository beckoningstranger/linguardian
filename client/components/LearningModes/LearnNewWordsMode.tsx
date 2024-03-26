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

interface LearnNewWordsModeProps {
  listName: string;
  userNative: SupportedLanguage;
  items: ItemToLearn[];
  targetLanguageFeatures: LanguageFeatures;
}

export default function LearnNewWordsMode({
  listName,
  userNative,
  targetLanguageFeatures,
  items,
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

  function handleGotItClickInPresentation() {
    const newItemsToLearn = [...itemsToLearn];
    newItemsToLearn[0].learningStep += 1;
    const removedItem = newItemsToLearn.shift();
    setItemsToLearn([
      ...newItemsToLearn.slice(0, 1),
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
            <MobileMenuContextProvider>
              <HelperKeys
                targetLanguageFeatures={targetLanguageFeatures}
                solution={solution}
                setSolution={setSolution}
                hide={false}
                inputRef={solutionInputRef}
              />
            </MobileMenuContextProvider>
          </>
        )}
        {itemPresentation && (
          <ItemPresentation
            firstPresentation={
              itemsToLearn[0].learningStep === 0 ? true : false
            }
            item={itemsToLearn[0]}
            userSolution={solution}
            endPresentation={handleGotItClickInPresentation}
          />
        )}
        {itemsToLearn[0].learningStep === 1 && "Multiple Choice"}
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
