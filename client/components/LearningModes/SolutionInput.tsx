import { RefObject, useEffect, useState } from "react";
import { MoreReviewsMode } from "./MoreReviews";
import { ItemPopulatedWithTranslations, LanguageFeatures } from "@/types";
import { ReviewStatus } from "./TranslationMode";

interface SolutionInputProps {
  moreReviews: MoreReviewsMode | null;
  itemPresentation: boolean | undefined;
  targetLanguageFeatures: LanguageFeatures;
  solution: string;
  setSolution: Function;
  inputRef: RefObject<HTMLInputElement>;
  reviewStatus: ReviewStatus;
  setReviewStatus: Function;
  sessionEnd: boolean | undefined;
  activeItem: ItemPopulatedWithTranslations;
  setMoreReviews: Function;
  finalizeReview: Function;
}

export default function SolutionInput({
  moreReviews,
  itemPresentation,
  targetLanguageFeatures,
  solution,
  setSolution,
  inputRef,
  reviewStatus,
  setReviewStatus,
  sessionEnd,
  activeItem,
  setMoreReviews,
  finalizeReview,
}: SolutionInputProps) {
  const [inputStyling, setInputStyling] = useState({
    input:
      "focus:border-b-2 bg-slate-200 m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
    form: "mt-0 flex justify-stretch transition-all rounded-md bg-slate-200",
  });

  // Styling for input field depending on reviewStatus
  useEffect(() => {
    let inputFieldStyling;
    let formElementStyling;
    switch (reviewStatus) {
      case "correct":
        inputFieldStyling = "focus:border-b-inherit bg-green-300 scale-105";
        formElementStyling = "bg-green-300 scale-110";
        break;
      case "incorrect":
        inputFieldStyling = "focus:border-b-inherit bg-red-400 scale-90";
        formElementStyling = "bg-red-400";
        break;
      default:
        inputFieldStyling = "focus:border-b-2 bg-slate-200";
        formElementStyling = "bg-slate-200";
    }
    setInputStyling({
      input:
        inputFieldStyling +
        " m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
      form:
        formElementStyling +
        " mt-0 flex justify-stretch transition-all rounded-md",
    });
  }, [reviewStatus]);

  function handleWordSubmit(e: React.FormEvent) {
    e.preventDefault();
    let answerCorrect;

    if (activeItem.name === solution.trim()) {
      setReviewStatus("correct");
      answerCorrect = true;
    } else {
      setReviewStatus("incorrect");
      answerCorrect = false;
    }

    // This is where we can trigger additional reviews for this item, i.e. gender...
    if (
      answerCorrect &&
      activeItem.partOfSpeech === "noun" &&
      targetLanguageFeatures.hasGender &&
      activeItem.name === solution
    ) {
      setMoreReviews("gender");
      return;
    }

    // ...or case
    if (
      answerCorrect &&
      activeItem.partOfSpeech === "preposition" &&
      targetLanguageFeatures.hasCases &&
      activeItem.name === solution
    ) {
      setMoreReviews("case");
      return;
    }
    finalizeReview(answerCorrect);
  }

  return (
    <>
      {!moreReviews && !itemPresentation && (
        <form onSubmit={handleWordSubmit} className={inputStyling.form}>
          <input
            type="text"
            placeholder={`Translate to ${targetLanguageFeatures.langName}`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className={inputStyling.input}
            autoFocus
            ref={inputRef}
            readOnly={reviewStatus !== "neutral"}
            disabled={sessionEnd}
          />
        </form>
      )}
    </>
  );
}
