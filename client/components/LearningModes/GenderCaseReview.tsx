"use client";

import { Dispatch, SetStateAction, useRef } from "react";

import { ReviewStatus } from "@/components/LearningModes/LearnAndReview";
import MoreReviews from "@/components/LearningModes/MoreReviews";
import {
  Gender,
  GrammaticalCase,
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  SecondaryReviewMode,
} from "@linguardian/shared/contracts";
interface GenderCaseReviewProps {
  mode: SecondaryReviewMode;
  targetLanguageFeatures: LanguageFeatures;
  item: ItemWithPopulatedTranslations;
  solution: string;
  setSolution: Dispatch<SetStateAction<string>>;
  setReviewStatus: Dispatch<SetStateAction<ReviewStatus>>;
  setMoreReviews: Dispatch<SetStateAction<SecondaryReviewMode | null>>;
  finalizeReview: Function;
}

export default function GenderCaseReview({
  mode,
  targetLanguageFeatures,
  item,
  solution,
  setSolution,
  setReviewStatus,
  setMoreReviews,
  finalizeReview,
}: GenderCaseReviewProps) {
  const moreReviewsInputRef = useRef<HTMLInputElement>(null);

  function handleMoreReviewsSubmit(
    mode: SecondaryReviewMode,
    moreReviewsSolution: Gender | GrammaticalCase
  ) {
    let correct = true;
    setSolution(`${solution} (${moreReviewsSolution})`);

    if (item[mode] && !item[mode]?.includes(moreReviewsSolution)) {
      setReviewStatus("incorrect");
      correct = false;
    }

    setMoreReviews(null);
    finalizeReview(correct);
  }

  return (
    <MoreReviews
      mode={mode}
      moreReviewsInputRef={moreReviewsInputRef}
      item={item}
      target={targetLanguageFeatures.langCode}
      targetLanguageFeatures={targetLanguageFeatures}
      handleSubmit={handleMoreReviewsSubmit}
    />
  );
}
