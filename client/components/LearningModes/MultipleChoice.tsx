"use client";
import { ItemToLearn } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { ReviewStatus } from "./LearnAndReview";
import Button from "../ui/Button";

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
        <Button
          key={option + index}
          className={calculateStyling(option === selectedOption, reviewStatus)}
          onClick={() => {
            handleClick(option);
          }}
        >
          <span className="mx-4">{index + 1}:</span>
          <span>{option}</span>
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
}

function calculateStyling(selected: boolean, reviewStatus: ReviewStatus) {
  let styling = "w-full rounded-full p-4 flex items-center text-slate-800";
  if (!selected) styling += " bg-slate-200";
  if (selected && reviewStatus === "incorrect") styling += " bg-red-600";
  if (selected && reviewStatus === "correct") {
    styling += " bg-green-300";
  }
  return styling;
}
