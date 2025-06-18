"use client";
import { Input } from "@headlessui/react";
import { RefObject, useCallback } from "react";

import {
  Case,
  Gender,
  ItemWithPopulatedTranslationsFE,
  LanguageFeatures,
  MoreReviewsMode,
  SupportedLanguage,
} from "@/lib/types";
import CaseGenderButton from "./GenderCaseButton";

interface MoreReviewsProps {
  mode: MoreReviewsMode;
  moreReviewsInputRef: RefObject<HTMLInputElement>;
  item: ItemWithPopulatedTranslationsFE;
  target: SupportedLanguage;
  targetLanguageFeatures: LanguageFeatures;
  handleSubmit: Function;
}

export default function MoreReviews({
  mode,
  moreReviewsInputRef,
  item,
  targetLanguageFeatures,
  handleSubmit,
}: MoreReviewsProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const genderMap: Record<string, Gender> = {
        m: "masculine",
        f: "feminine",
        n: "neuter",
        c: "common",
        i: "inanimate",
        a: "animate",
      };

      const caseMap: Record<string, Case> = {
        n: "nominative",
        g: "genitive",
        d: "dative",
        a: "accusative",
        v: "vocative",
        "&": "accusative & dative",
        l: "locative",
      };

      const isValid = (option: string) =>
        mode === "gender"
          ? targetLanguageFeatures.hasGender?.includes(option as Gender)
          : targetLanguageFeatures.hasCases?.includes(option as Case);

      const value = mode === "gender" ? genderMap[key] : caseMap[key];

      if (value && isValid(value)) {
        handleSubmit(mode, value);
      } else {
        moreReviewsInputRef.current?.focus();
      }
    },
    [mode, handleSubmit, moreReviewsInputRef, targetLanguageFeatures]
  );

  return (
    <div className="mt-1 flex flex-col justify-center gap-2 rounded-md bg-white/95 py-2">
      <label htmlFor="CaseGenderInput" className="sr-only">
        Enter the case or gender of the item with a single keystroke
      </label>
      <Input
        // This is so users can enter the gender/case with a single keystroke when using the keyboard
        type="text"
        id="CaseGenderInput"
        onKeyDown={handleKeyDown}
        autoFocus
        className="h-0"
        ref={moreReviewsInputRef}
      />
      <div className="grid gap-2 text-center font-serif text-hmd">
        <p>Well done!</p>
        {mode === "gender" && <p>What is {item.name}&apos;s gender?</p>}
        {mode === "case" && <p>And {item.name} is followed by which case?</p>}
      </div>
      <div className="grid gap-2 px-2">
        {mode === "case" &&
          targetLanguageFeatures.hasCases?.map((itemCase) => (
            <CaseGenderButton
              key={itemCase}
              mode={itemCase}
              onClick={() => handleSubmit("case", itemCase)}
            />
          ))}
        {mode === "gender" &&
          targetLanguageFeatures.hasGender?.map((gender) => (
            <CaseGenderButton
              key={gender}
              mode={gender}
              onClick={() => handleSubmit("gender", gender)}
            />
          ))}
      </div>
    </div>
  );
}
