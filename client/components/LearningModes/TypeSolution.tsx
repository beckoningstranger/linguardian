"use client";

import { useEffect, useRef, useState } from "react";

import {
  GenderCaseReview,
  HelperKeys,
  ReviewStatus,
  SolutionInput,
} from "@/components";

import {
  ItemToLearn,
  LanguageFeatures,
  SecondaryReviewMode,
} from "@/lib/contracts";

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
  const [moreReviews, setMoreReviews] = useState<SecondaryReviewMode | null>(
    null
  );
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
      {!moreReviews && targetLanguageFeatures.requiresHelperKeys && (
        <HelperKeys
          targetLanguageFeatures={targetLanguageFeatures}
          solution={solution}
          setSolution={setSolution}
          inputRef={solutionInputRef}
        />
      )}
    </>
  );
}
