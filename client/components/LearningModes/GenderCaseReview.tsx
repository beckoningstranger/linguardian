import { useRef } from "react";

import {
  Case,
  Gender,
  ItemWithPopulatedTranslationsFE,
  LanguageFeatures,
  MoreReviewsMode,
} from "@/lib/types";
import MoreReviews from "./MoreReviews";

interface GenderCaseReviewProps {
  mode: MoreReviewsMode;
  targetLanguageFeatures: LanguageFeatures;
  item: ItemWithPopulatedTranslationsFE;
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
