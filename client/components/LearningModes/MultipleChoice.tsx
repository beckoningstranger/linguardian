"use client";
import { Button } from "@headlessui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ReviewStatus } from "@/components/LearningModes/LearnAndReview";
import { ItemToLearn } from "@/lib/contracts";
import { cn, shuffleArray } from "@/lib/utils";

interface MultipleChoiceProps {
  correctItem: ItemToLearn;
  evaluate: Function;
  allItemStringsInList: string[];
}

export default function MultipleChoice({
  correctItem,
  evaluate,
  allItemStringsInList,
}: MultipleChoiceProps) {
  const options = useMemo(() => {
    return createMultipleChoiceOptions(allItemStringsInList, correctItem.name);
  }, [correctItem, allItemStringsInList]);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hiddenInput = useRef<HTMLInputElement | null>(null);

  const userIsOnMobileDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    if (hiddenInput.current && userIsOnMobileDevice) {
      hiddenInput.current.setAttribute("readonly", "readonly");
    }
  }, [userIsOnMobileDevice]);

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
      className="grid h-full grid-cols-1 gap-2 p-2 hover:border-none desktop:grow desktop:grid-cols-2 desktop:grid-rows-4 desktop:gap-x-4 desktop:gap-y-6 desktop:py-6"
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
          {!userIsOnMobileDevice && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cxlb tablet:text-c2xlb desktop:left-8">
              {index + 1}
            </span>
          )}
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
      "relative w-full rounded-lg py-4 shadow-xl flex justify-center transition-all duration-400 items-center text-grey-800 h-16 tablet:h-[88px] desktop:h-full desktop:px-4 desktop:hover:ring-2 ring-grey-800",
      userHasAnswered && "desktop:hover:ring-0",
      !userHasAnswered && "bg-white/95 hover:bg-white hover:-translate-y-1",
      userHasAnswered &&
        !thisIsSelectedOption &&
        !thisIsCorrectOption &&
        "bg-white/95",
      userHasAnswered && thisIsCorrectOption && "bg-green-300 animate-bounce",
      userHasAnswered &&
        !userHasAnsweredCorrectly &&
        thisIsSelectedOption &&
        "bg-red-600"
    );
  }
}

function createMultipleChoiceOptions(
  moreItems: string[],
  correctItemName: string
) {
  const wrongOptions: string[] = [];
  let numberOfOptions = 0;
  const maxNumberOfOptions = 7;
  if (moreItems.length >= maxNumberOfOptions) {
    numberOfOptions = maxNumberOfOptions;
  } else numberOfOptions = moreItems.length;

  moreItems
    .filter((item) => item.split(" ").length === 2)
    .forEach((option) => {
      if (option !== correctItemName) wrongOptions.push(option);
    });

  let stringLengthDifference = 0;
  while (wrongOptions.length < numberOfOptions && stringLengthDifference < 10) {
    const newOptions: string[] = [];
    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItemName.length + stringLengthDifference &&
          itemx !== correctItemName
      )
      .forEach((option) => newOptions.push(option));

    moreItems
      .filter(
        (itemx) =>
          itemx.length === correctItemName.length - stringLengthDifference &&
          itemx !== correctItemName
      )
      .forEach((option) => newOptions.push(option));
    newOptions.forEach((option) => {
      if (!wrongOptions.includes(option)) wrongOptions.push(option);
    });
    stringLengthDifference += 1;
  }
  const options = wrongOptions.slice(0, numberOfOptions);
  options.push(correctItemName);

  return shuffleArray(options);
}
