"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ItemPopulatedWithTranslations,
  LanguageFeatures,
  SupportedLanguage,
} from "@/types";
import { MoreReviewsMode } from "./MoreReviews";
import ItemPresentation from "./ItemPresentation";
import TopBar from "./TopBar";
import ItemPrompt from "./ItemPrompt";
import HelperKeys from "./HelperKeys";
import { MobileMenuContextProvider } from "../Menus/MobileMenu/MobileMenuContext";
import GenderCaseReview from "./GenderCaseReview";
import SolutionInput from "./SolutionInput";
import LearnReviewElementContainer from "./LearnReviewElementContainer";

export type ReviewStatus = "neutral" | "correct" | "incorrect";

interface TranslationModeProps {
  items: ItemPopulatedWithTranslations[];
  listName: string;
  targetLanguageFeatures: LanguageFeatures;
  userNative: SupportedLanguage;
}

export default function TranslationMode({
  listName,
  items,
  targetLanguageFeatures,
  userNative,
}: TranslationModeProps) {
  const router = useRouter();

  const [reviewedItems, setReviewedItems] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<ItemPopulatedWithTranslations>(
    items[reviewedItems]
  );
  const [solution, setSolution] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [moreReviews, setMoreReviews] = useState<MoreReviewsMode | null>(null);
  const [sessionEnd, setSessionEnd] = useState<boolean | undefined>(false);
  const [itemPresentation, setItemPresentation] = useState<boolean | undefined>(
    false
  );
  const [hideHelperKeys, setHideHelperKeys] = useState<Boolean>(false);

  const solutionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    moreReviews || itemPresentation
      ? setHideHelperKeys(true)
      : setHideHelperKeys(false);
  }, [moreReviews, itemPresentation]);

  function finalizeReview(answerCorrect: Boolean) {
    // This is where we can update the backend for this item,
    // i.e. learningHistory and most of all new level and next review time

    setTimeout(() => {
      if (answerCorrect) {
        setSolution("");
        setReviewedItems(reviewedItems + 1);
        setActiveItem(items[reviewedItems + 1]);
      }

      if (!answerCorrect) setItemPresentation(true);

      if (answerCorrect && !items[reviewedItems + 1]) {
        setSessionEnd(true);
        router.push(`/dashboard?lang=${targetLanguageFeatures.langCode}`);
        // Navigate back to the dashboard and load fresh data from backend
      }
      setReviewStatus("neutral");
    }, 1500);
  }

  function handleGotItClickInPresentation() {
    setItemPresentation(false);
    setSolution("");
  }

  return (
    <div className="grid place-items-center">
      <TopBar
        listName={listName}
        itemsInProgress={reviewedItems}
        totalItems={items.length}
        mode="review"
      />
      <LearnReviewElementContainer>
        <ItemPrompt item={activeItem} userNative={userNative} />

        <MobileMenuContextProvider>
          <HelperKeys
            targetLanguageFeatures={targetLanguageFeatures}
            hide={hideHelperKeys}
            solution={solution}
            setSolution={setSolution}
            inputRef={solutionInputRef}
          />
        </MobileMenuContextProvider>

        {!moreReviews && !itemPresentation && (
          <SolutionInput
            targetLanguageFeatures={targetLanguageFeatures}
            solution={solution}
            setSolution={setSolution}
            inputRef={solutionInputRef}
            reviewStatus={reviewStatus}
            setReviewStatus={setReviewStatus}
            disable={sessionEnd}
            item={activeItem}
            setMoreReviews={setMoreReviews}
            finalizeReview={finalizeReview}
          />
        )}

        {moreReviews && (
          <GenderCaseReview
            mode={moreReviews}
            targetLanguageFeatures={targetLanguageFeatures}
            item={activeItem}
            solution={solution}
            setSolution={setSolution}
            setReviewStatus={setReviewStatus}
            setMoreReviews={setMoreReviews}
            finalizeReview={finalizeReview}
          />
        )}

        {itemPresentation && (
          <ItemPresentation
            firstPresentation={false}
            item={activeItem}
            userSolution={solution}
            endPresentation={handleGotItClickInPresentation}
          />
        )}
      </LearnReviewElementContainer>
    </div>
  );
}
