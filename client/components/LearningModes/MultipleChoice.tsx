import { ItemToLearn } from "@/lib/types";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setSelectedOption(null);
        setReviewStatus("neutral");
        evaluate(reviewStatus, selectedOption);
      }, 1000);
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
    const legalKeys = Array.from({ length: options.length }, (_, i) => i + 1);
    if (!legalKeys.includes(+e.key)) return;
    setSelectedOption(options[+e.key - 1]);
    if (correctItem.name === options[+e.key - 1]) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }
  };

  return (
    <div className="grid grid-cols-1 place-items-center items-stretch gap-3">
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
          <span className="mx-4">{index + 1}:</span>
          <span>{option}</span>
        </button>
      ))}
      <input
        type="text"
        autoFocus
        className="h-0"
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </div>
  );
}

function calculateStyling(
  option: string,
  selectedOption: string | null,
  reviewStatus: ReviewStatus,
  correctOption: string
) {
  let styling = "w-full rounded-full p-4 flex items-center";
  if (option !== selectedOption) styling += " bg-slate-200";
  if (option === selectedOption && reviewStatus === "incorrect")
    styling += " bg-red-600";
  if (
    (option === selectedOption && reviewStatus === "correct") ||
    (option === correctOption && reviewStatus === "incorrect")
  ) {
    styling = "w-full rounded-full p-4 bg-green-300 flex";
  }
  return styling;
}
