import { RefObject, useEffect, useState } from "react";
import { ItemPopulatedWithTranslations, LanguageFeatures } from "@/types";
import { ReviewStatus } from "./LearnAndReview";

interface SolutionInputProps {
  targetLanguageFeatures: LanguageFeatures;
  solution: string;
  setSolution: Function;
  inputRef: RefObject<HTMLInputElement>;
  reviewStatus: ReviewStatus;
  setReviewStatus: Function;
  disable: boolean | undefined;
  item: ItemPopulatedWithTranslations;
  setMoreReviews: Function;
  finalizeReview: Function;
}

export default function SolutionInput({
  targetLanguageFeatures,
  solution,
  setSolution,
  inputRef,
  reviewStatus,
  setReviewStatus,
  disable,
  item,
  setMoreReviews,
  finalizeReview,
}: SolutionInputProps) {
  const [inputStyling, setInputStyling] = useState({
    input:
      "focus:border-b-2 bg-slate-200 m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
    form: "mt-0 flex justify-stretch transition-all rounded-md bg-slate-200",
  });

  useEffect(() => {
    let inputFieldStyling: string = "";
    let formElementStyling: string = "";

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

    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setSolution("");
        setReviewStatus("neutral");
        setInputStyling({
          input:
            "focus:border-b-2 bg-slate-200 m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
          form: "mt-0 flex justify-stretch transition-all rounded-md bg-slate-200",
        });
        finalizeReview(reviewStatus, solution);
      }, 1000);
    }
  }, [reviewStatus, finalizeReview, setReviewStatus, setSolution, solution]);

  function handleWordSubmit(e: React.FormEvent) {
    e.preventDefault();
    let reviewStatus: ReviewStatus;

    if (item.name === solution.trim()) {
      setReviewStatus("correct");
      reviewStatus = "correct";
    } else {
      setReviewStatus("incorrect");
      reviewStatus = "incorrect";
    }

    // This is where we can trigger additional reviews for this item, i.e. gender...
    if (
      reviewStatus === "correct" &&
      item.partOfSpeech === "noun" &&
      targetLanguageFeatures.hasGender &&
      item.name === solution
    ) {
      setMoreReviews("gender");
      return;
    }

    // ...or case
    if (
      reviewStatus === "correct" &&
      item.partOfSpeech === "preposition" &&
      targetLanguageFeatures.hasCases &&
      item.name === solution
    ) {
      setMoreReviews("case");
      return;
    }
  }

  return (
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
        disabled={disable}
      />
    </form>
  );
}
