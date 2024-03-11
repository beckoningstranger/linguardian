import {
  Gender,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
  SupportedLanguage,
} from "@/types";
import { RefObject } from "react";

interface GenderReviewProps {
  genderInputRef: RefObject<HTMLInputElement>;
  activeItem: ItemPopulatedWithTranslations;
  target: SupportedLanguage;
  targetLanguageFeatures: LanguageFeatures;
  handleGenderSubmit: Function;
}

export default function GenderReview({
  genderInputRef,
  activeItem,
  targetLanguageFeatures,
  handleGenderSubmit,
}: GenderReviewProps) {
  return (
    <div className="items-around my-2 flex flex-col justify-center gap-2 rounded-md bg-slate-200 py-2">
      <input
        // This is so users can enter the gender with a single keystroke when using the keyboard
        type="text"
        onKeyDown={(e) =>
          handleKeyDown(
            e,
            targetLanguageFeatures,
            handleGenderSubmit,
            genderInputRef
          )
        }
        autoFocus
        className="h-0"
        ref={genderInputRef}
      />
      <div className="text-center text-xl">
        <p>Very good!</p>
        <p>What is {activeItem.name}&apos;s gender?</p>
      </div>
      <div className="my-2 flex justify-around">
        {targetLanguageFeatures.hasGender?.map((gender) => {
          let buttonTag = (
            <span className="text-slate-600">
              <strong className="text-slate-900">{gender[0]}</strong>
              {gender.substring(1)}
            </span>
          );
          return (
            <button
              key={gender}
              onClick={() => handleGenderSubmit(gender)}
              className="rounded-md border border-black p-2 focus:border-red-400"
            >
              {buttonTag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function handleKeyDown(
  e: React.KeyboardEvent,
  targetLanguageFeatures: LanguageFeatures,
  handleGenderSubmit: Function,
  genderInputRef: RefObject<HTMLInputElement>
) {
  switch (e.key) {
    case "m":
      if (targetLanguageFeatures.hasGender?.includes("masculine"))
        handleGenderSubmit("masculine");
      break;
    case "f":
      if (targetLanguageFeatures.hasGender?.includes("feminine"))
        handleGenderSubmit("feminine");
      break;
    case "n":
      if (targetLanguageFeatures.hasGender?.includes("neuter"))
        handleGenderSubmit("neuter");
      break;
    case "c":
      if (targetLanguageFeatures.hasGender?.includes("common"))
        handleGenderSubmit("common");
      break;
    case "i":
      if (targetLanguageFeatures.hasGender?.includes("inanimate"))
        handleGenderSubmit("inanimate");
      break;
    case "a":
      if (targetLanguageFeatures.hasGender?.includes("animate"))
        handleGenderSubmit("animate");
      break;
    default:
      genderInputRef.current?.focus();
      break;
  }
}
