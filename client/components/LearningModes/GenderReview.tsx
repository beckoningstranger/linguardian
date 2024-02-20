import { Item, LanguageFeatures, SupportedLanguage } from "@/types";
import { RefObject } from "react";

interface GenderReviewProps {
  genderInputRef: RefObject<HTMLInputElement>;
  activeItem: Item;
  target: SupportedLanguage;
  languageFeatures: Record<SupportedLanguage, LanguageFeatures>;
  handleGenderSubmit: Function;
}

export default function GenderReview({
  genderInputRef,
  activeItem,
  target,
  languageFeatures,
  handleGenderSubmit,
}: GenderReviewProps) {
  return (
    <div className="flex justify-center bg-slate-200 flex-col gap-2 items-around my-2 py-2 rounded-md">
      <input
        // This is so users can enter the gender with a single keystroke when using the keyboard
        type="text"
        onKeyDown={(e) =>
          handleKeyDown(
            e,
            languageFeatures,
            target,
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
        <p>What is {activeItem.meaning[target]}&apos;s gender?</p>
      </div>
      <div className="flex justify-around my-2">
        {languageFeatures[target].hasGender?.map((gender) => {
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
              className="p-2 border border-black rounded-md focus:border-red-400"
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
  languageFeatures: Record<SupportedLanguage, LanguageFeatures>,
  target: SupportedLanguage,
  handleGenderSubmit: Function,
  genderInputRef: RefObject<HTMLInputElement>
) {
  switch (e.key) {
    case "m":
      if (languageFeatures[target].hasGender?.includes("masculine"))
        handleGenderSubmit("masculine");
      break;
    case "f":
      if (languageFeatures[target].hasGender?.includes("feminine"))
        handleGenderSubmit("feminine");
      break;
    case "n":
      if (languageFeatures[target].hasGender?.includes("neuter"))
        handleGenderSubmit("neuter");
      break;
    case "c":
      if (languageFeatures[target].hasGender?.includes("common"))
        handleGenderSubmit("common");
      break;
    case "i":
      if (languageFeatures[target].hasGender?.includes("inanimate"))
        handleGenderSubmit("inanimate");
      break;
    case "a":
      if (languageFeatures[target].hasGender?.includes("animate"))
        handleGenderSubmit("animate");
      break;
    default:
      genderInputRef.current?.focus();
      break;
  }
}