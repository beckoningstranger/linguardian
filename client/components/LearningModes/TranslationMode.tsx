"use client";

import { useRef, useState } from "react";
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

  const solutionInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex flex-col justify-center transition-all">
      <TopBar
        listName={listName}
        reviewedItems={reviewedItems}
        totalItems={items.length}
      />
      <div className="w-95 mx-6 mt-3 flex flex-col gap-3">
        <ItemPrompt activeItem={activeItem} userNative={userNative} />

        <MobileMenuContextProvider>
          <HelperKeys
            targetLanguageFeatures={targetLanguageFeatures}
            moreReviews={moreReviews}
            itemPresentation={itemPresentation}
            solution={solution}
            setSolution={setSolution}
            inputRef={solutionInputRef}
          />
        </MobileMenuContextProvider>

        <SolutionInput
          moreReviews={moreReviews}
          itemPresentation={itemPresentation}
          targetLanguageFeatures={targetLanguageFeatures}
          solution={solution}
          setSolution={setSolution}
          inputRef={solutionInputRef}
          reviewStatus={reviewStatus}
          setReviewStatus={setReviewStatus}
          sessionEnd={sessionEnd}
          activeItem={activeItem}
          setMoreReviews={setMoreReviews}
          finalizeReview={finalizeReview}
        />

        <GenderCaseReview
          moreReviews={moreReviews}
          targetLanguageFeatures={targetLanguageFeatures}
          activeItem={activeItem}
          solution={solution}
          setSolution={setSolution}
          setReviewStatus={setReviewStatus}
          setMoreReviews={setMoreReviews}
          finalizeReview={finalizeReview}
        />

        <ItemPresentation
          item={activeItem}
          itemPresentation={itemPresentation}
          userSolution={solution}
          endPresentation={() => setItemPresentation(false)}
          setSolution={setSolution}
        />
      </div>
    </div>
  );
}
