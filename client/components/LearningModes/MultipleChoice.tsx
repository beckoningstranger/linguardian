"use client";
import { cn } from "@/lib/helperFunctionsClient";
import { ItemToLearn } from "@/lib/types";
import { Button } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { ReviewStatus } from "./LearnAndReview";

interface MultipleChoiceProps {
  options: string[];
  correctItem: ItemToLearn;
  evaluate: Function;
}

export default function MultipleChoice({
  correctItem,
  evaluate,
  options,
}: MultipleChoiceProps) {
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hiddenInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      hiddenInput.current &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    ) {
      hiddenInput.current.setAttribute("readonly", "readonly");
    }
  }, []);

  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setSelectedOption(null);
        setReviewStatus("neutral");
        evaluate(reviewStatus, selectedOption);
      }, 1500);
    }
  }, [reviewStatus, evaluate, selectedOption]);

  const handleClick = (option: string) => {
    setSelectedOption(option);
    if (option === correctItem.name) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const legalKeys: number[] = options.map((_, index) => index + 1);
    if (!legalKeys.includes(+e.key)) return;
    const selectedOption = options[+e.key - 1];
    setSelectedOption(selectedOption);
    if (selectedOption === correctItem.name) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }
  };

  return (
    <div
      className="grid h-full grid-cols-1 gap-2 p-2 hover:border-none desktop:h-[calc(100vh-112px-142px)] desktop:grid-cols-2 desktop:grid-rows-4 desktop:gap-x-4 desktop:gap-y-6 desktop:py-6"
      id="MultipleChoiceAnswers"
    >
      {options.map((option, index) => (
        <Button
          key={option + index}
          className={calculateStyling(
            selectedOption,
            option,
            correctItem.name,
            reviewStatus
          )}
          onClick={() => {
            handleClick(option);
          }}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cxlb tablet:text-c2xlb desktop:static desktop:translate-y-0">
            {index + 1}:
          </span>
          <span className="font-serif text-hmd tablet:text-hlg desktop:w-full">
            {option}
          </span>
        </Button>
      ))}
      <input
        type="text"
        autoFocus
        className="h-0"
        onKeyDown={(e) => handleKeyDown(e)}
        ref={hiddenInput}
      />
    </div>
  );

  function calculateStyling(
    selectedOption: string | null,
    option: string,
    correctOption: string,
    reviewStatus: ReviewStatus
  ) {
    const thisIsSelectedOption = option === selectedOption;
    const thisIsCorrectOption = option === correctOption;
    const userHasAnswered = reviewStatus !== "neutral";
    const userHasAnsweredCorrectly = reviewStatus === "correct";
    return cn(
      "relative w-full rounded-lg py-4 shadow-xl flex justify-center items-center text-grey-800 h-16 tablet:h-[88px] desktop:h-full desktop:px-4 hover:ring-4 ring-grey-800",
      userHasAnswered && "hover:ring-0",
      !userHasAnswered && "bg-white/95",
      userHasAnswered &&
        !thisIsSelectedOption &&
        !thisIsCorrectOption &&
        "bg-white/95",
      userHasAnswered && thisIsCorrectOption && "bg-green-300",
      userHasAnswered &&
        !userHasAnsweredCorrectly &&
        thisIsSelectedOption &&
        "bg-red-600"
    );
  }
}
