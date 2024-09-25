import { useRef, useState } from "react";
import { MobileMenuContextProvider } from "../../context/MobileMenuContext";
import HelperKeys from "./HelperKeys";
import SolutionInput from "./SolutionInput";
import { ReviewStatus } from "./LearnAndReview";
import { ItemToLearn, LanguageFeatures } from "@/lib/types";
import GenderCaseReview from "./GenderCaseReview";
import { MoreReviewsMode } from "./MoreReviews";

interface BetterSolutionInputProps {
  targetLanguageFeatures: LanguageFeatures;
  item: ItemToLearn;
  evaluate: Function;
}

export default function BetterSolutionInput({
  targetLanguageFeatures,
  item,
  evaluate,
}: BetterSolutionInputProps) {
  const [solution, setSolution] = useState("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [moreReviews, setMoreReviews] = useState<MoreReviewsMode | null>(null);

  const solutionInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
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
          disable={false}
          item={item}
          setMoreReviews={setMoreReviews}
          finalizeReview={evaluate}
        />
      )}
    </>
  );
}
