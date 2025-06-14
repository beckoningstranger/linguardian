import { RefObject, useEffect, useState } from "react";
import { ItemWithPopulatedTranslations, LanguageFeatures } from "@/lib/types";
import { ReviewStatus } from "./LearnAndReview";
import { Input } from "@headlessui/react";
import { cn } from "@/lib/helperFunctionsClient";

interface SolutionInputProps {
  targetLanguageFeatures: LanguageFeatures;
  solution: string;
  setSolution: Function;
  inputRef: RefObject<HTMLInputElement>;
  reviewStatus: ReviewStatus;
  setReviewStatus: Function;
  disable: boolean | undefined;
  item: ItemWithPopulatedTranslations;
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
  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setSolution("");
        setReviewStatus("neutral");
        finalizeReview(reviewStatus, solution.trim());
      }, 1500);
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
      targetLanguageFeatures.hasGender
    ) {
      setMoreReviews("gender");
      return;
    }

    // ...or case
    if (
      reviewStatus === "correct" &&
      item.partOfSpeech === "preposition" &&
      targetLanguageFeatures.hasCases
    ) {
      setMoreReviews("case");
      return;
    }
  }

  return (
    <form
      onSubmit={handleWordSubmit}
      className={cn(
        "mt-1 flex w-full justify-center bg-white/95 py-8",
        reviewStatus === "correct" && "bg-green-300",
        reviewStatus === "incorrect" && "bg-red-500"
      )}
    >
      <Input
        type="text"
        placeholder={`Translate to ${targetLanguageFeatures.langName}`}
        className={cn(
          "w-[80%] border-black text-center font-serif text-hsm tablet:text-hlg focus:border-b-2 focus:outline-none bg-transparent",
          reviewStatus !== "neutral" && "focus:border-none"
        )}
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        autoFocus
        ref={inputRef}
        readOnly={reviewStatus !== "neutral"}
        disabled={disable}
        spellCheck={false}
      />
    </form>
  );
}
