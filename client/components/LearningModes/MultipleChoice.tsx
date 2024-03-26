import { ItemToLearn } from "@/types";
import { useEffect, useRef, useState } from "react";
import { ReviewStatus } from "./TranslationMode";

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

  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setSelectedOption(null);
        setReviewStatus("neutral");
        evaluate(reviewStatus);
      }, 1000);
    }
  });

  const handleClick = (option: string) => {
    setSelectedOption(option);
    if (option === correctItem.name) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }
  };

  return (
    <div className="grid grid-cols-2 place-items-center items-stretch gap-3">
      {options.map((option, index) => (
        <button
          key={index}
          className={calculateStyling(
            option,
            selectedOption,
            reviewStatus,
            correctItem.name
          )}
          onClick={() => {
            handleClick(option);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function calculateStyling(
  option: string,
  selectedOption: string | null,
  reviewStatus: ReviewStatus,
  correctOption: string
) {
  let styling = "w-full rounded-full p-4";
  if (option !== selectedOption) styling += " bg-slate-200";
  if (option === selectedOption && reviewStatus === "incorrect")
    styling += " bg-red-600";
  if (
    (option === selectedOption && reviewStatus === "correct") ||
    (option === correctOption && reviewStatus === "incorrect")
  ) {
    styling = "w-full rounded-full p-4 bg-green-300";
  }
  return styling;
}
