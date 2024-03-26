import {
  Case,
  Gender,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
} from "@/types";
import MoreReviews, { MoreReviewsMode } from "./MoreReviews";
import { useRef } from "react";

interface GenderCaseReviewProps {
  mode: MoreReviewsMode;
  targetLanguageFeatures: LanguageFeatures;
  item: ItemPopulatedWithTranslations;
  solution: string;
  setSolution: Function;
  setReviewStatus: Function;
  setMoreReviews: Function;
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
    mode: MoreReviewsMode,
    moreReviewsSolution: Gender | Case
  ) {
    let correct = true;
    if (mode === "gender") {
      setSolution(`${solution} (${moreReviewsSolution})`);
      if (item.gender && !item.gender.includes(moreReviewsSolution)) {
        setReviewStatus("incorrect");
        correct = false;
      }
    }

    if (mode === "case") {
      setSolution(`${solution} (${moreReviewsSolution})`);
      if (item.case && !item.case.includes(moreReviewsSolution)) {
        setReviewStatus("incorrect");
        correct = false;
      }
    }

    setMoreReviews(null);
    finalizeReview(correct);
  }

  if (mode)
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

  return null;
}
