"use client";
import { useEffect, useRef, useState } from "react";

import { ItemToLearn, LanguageFeatures, MoreReviewsMode } from "@/lib/types";
import { MobileMenuContextProvider } from "../../context/MobileMenuContext";
import GenderCaseReview from "./GenderCaseReview";
import HelperKeys from "./HelperKeys";
import { ReviewStatus } from "./LearnAndReview";
import SolutionInput from "./SolutionInput";

interface TypeSolutionProps {
  targetLanguageFeatures: LanguageFeatures;
  item: ItemToLearn;
  evaluate: Function;
}

export default function TypeSolution({
  targetLanguageFeatures,
  item,
  evaluate,
}: TypeSolutionProps) {
  const [solution, setSolution] = useState("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [moreReviews, setMoreReviews] = useState<MoreReviewsMode | null>(null);
  const solutionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    solutionInputRef.current?.focus();
  });

  return (
    <>
      {moreReviews && (
        <GenderCaseReview
          mode={moreReviews}
          targetLanguageFeatures={targetLanguageFeatures}
          item={item}
          solution={solution}
          setSolution={setSolution}
          setReviewStatus={setReviewStatus}
          setMoreReviews={setMoreReviews}
          finalizeReview={evaluate}
        />
      )}
      {!moreReviews && (
        <SolutionInput
          inputRef={solutionInputRef}
          targetLanguageFeatures={targetLanguageFeatures}
          solution={solution}
          setSolution={setSolution}
          reviewStatus={reviewStatus}
          setReviewStatus={setReviewStatus}
          disable={reviewStatus !== "neutral"}
          item={item}
          setMoreReviews={setMoreReviews}
          finalizeReview={evaluate}
        />
      )}
      {!moreReviews && (
        <MobileMenuContextProvider>
          <HelperKeys
            targetLanguageFeatures={targetLanguageFeatures}
            solution={solution}
            setSolution={setSolution}
            inputRef={solutionInputRef}
          />
        </MobileMenuContextProvider>
      )}
    </>
  );
}
