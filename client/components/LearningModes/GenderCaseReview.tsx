import {
  Case,
  Gender,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
} from "@/types";
import MoreReviews, { MoreReviewsMode } from "./MoreReviews";
import { useRef } from "react";

interface GenderCaseReviewProps {
  moreReviews: MoreReviewsMode | null;
  targetLanguageFeatures: LanguageFeatures;
  activeItem: ItemPopulatedWithTranslations;
  solution: string;
  setSolution: Function;
  setReviewStatus: Function;
  setMoreReviews: Function;
  finalizeReview: Function;
}

export default function GenderCaseReview({
  moreReviews,
  targetLanguageFeatures,
  activeItem,
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
      if (
        activeItem.gender &&
        !activeItem.gender.includes(moreReviewsSolution)
      ) {
        setReviewStatus("incorrect");
        correct = false;
      }
    }

    if (mode === "case") {
      setSolution(`${solution} (${moreReviewsSolution})`);
      if (activeItem.case && !activeItem.case.includes(moreReviewsSolution)) {
        setReviewStatus("incorrect");
        correct = false;
      }
    }

    setMoreReviews(null);
    finalizeReview(correct);
  }

  return (
    <>
      {moreReviews === "gender" && (
        <MoreReviews
          mode={moreReviews}
          moreReviewsInputRef={moreReviewsInputRef}
          activeItem={activeItem}
          target={targetLanguageFeatures.langCode}
          targetLanguageFeatures={targetLanguageFeatures}
          handleSubmit={handleMoreReviewsSubmit}
        />
      )}
      {moreReviews === "case" && (
        <MoreReviews
          mode={moreReviews}
          moreReviewsInputRef={moreReviewsInputRef}
          activeItem={activeItem}
          target={targetLanguageFeatures.langCode}
          targetLanguageFeatures={targetLanguageFeatures}
          handleSubmit={handleMoreReviewsSubmit}
        />
      )}
    </>
  );
}
