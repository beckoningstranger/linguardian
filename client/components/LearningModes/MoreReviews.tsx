import {
  Case,
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  SupportedLanguage,
} from "@/lib/types";
import { Input } from "@headlessui/react";
import { RefObject } from "react";
import Button from "../ui/Button";

export type MoreReviewsMode = "gender" | "case";

interface MoreReviewsProps {
  mode: MoreReviewsMode;
  moreReviewsInputRef: RefObject<HTMLInputElement>;
  item: ItemWithPopulatedTranslations;
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
  return (
    <div className="items-around my-2 flex flex-col justify-center gap-2 rounded-md bg-slate-200 py-2">
      <label htmlFor="caseGenderInput" className="sr-only">
        Enter the case or gender of the item with a single keystroke
      </label>
      <Input
        // This is so users can enter the gender/case with a single keystroke when using the keyboard
        type="text"
        id="caseGenderInput"
        onKeyDown={(e) =>
          handleKeyDown(
            e,
            mode,
            targetLanguageFeatures,
            handleSubmit,
            moreReviewsInputRef
          )
        }
        autoFocus
        className="h-0"
        ref={moreReviewsInputRef}
      />
      <div className="text-center text-xl">
        <p>Very good!</p>
        {mode === "gender" && <p>What is {item.name}&apos;s gender?</p>}
        {mode === "case" && <p>And {item.name} is followed by which case?</p>}
      </div>
      <div className="my-2 flex justify-around">
        {mode === "case" &&
          targetLanguageFeatures.hasCases?.map((itemcase) => {
            const caseString = renderCaseString(itemcase);
            return (
              <Button
                key={itemcase}
                onClick={() => handleSubmit("case", itemcase)}
                className="rounded-md border border-black p-2 focus:border-red-400"
              >
                {caseString}
              </Button>
            );
          })}
        {mode === "gender" &&
          targetLanguageFeatures.hasGender?.map((gender) => {
            const genderString = (
              <span className="text-slate-500">
                <strong className="font-medium text-slate-900">
                  {gender[0]}
                </strong>
                {gender.substring(1)}
              </span>
            );
            return (
              <Button
                key={gender}
                onClick={() => handleSubmit("gender", gender)}
                className="rounded-md border border-black p-2 focus:border-red-400"
              >
                {genderString}
              </Button>
            );
          })}
      </div>
    </div>
  );
}

function handleKeyDown(
  e: React.KeyboardEvent,
  mode: MoreReviewsMode,
  targetLanguageFeatures: LanguageFeatures,
  handleSubmit: Function,
  moreReviewsInputRef: RefObject<HTMLInputElement>
) {
  if (mode === "gender")
    switch (e.key) {
      case "m":
        if (targetLanguageFeatures.hasGender?.includes("masculine"))
          handleSubmit("gender", "masculine");
        break;
      case "f":
        if (targetLanguageFeatures.hasGender?.includes("feminine"))
          handleSubmit("gender", "feminine");
        break;
      case "n":
        if (targetLanguageFeatures.hasGender?.includes("neuter"))
          handleSubmit("gender", "neuter");
        break;
      case "c":
        if (targetLanguageFeatures.hasGender?.includes("common"))
          handleSubmit("gender", "common");
        break;
      case "i":
        if (targetLanguageFeatures.hasGender?.includes("inanimate"))
          handleSubmit("gender", "inanimate");
        break;
      case "a":
        if (targetLanguageFeatures.hasGender?.includes("animate"))
          handleSubmit("gender", "animate");
        break;
      default:
        moreReviewsInputRef.current?.focus();
        break;
    }
  if (mode === "case")
    switch (e.key) {
      case "n":
        if (targetLanguageFeatures.hasCases?.includes("nominative"))
          handleSubmit("case", "nominative");
        break;
      case "g":
        if (targetLanguageFeatures.hasCases?.includes("genitive"))
          handleSubmit("case", "genitive");
        break;
      case "d":
        if (targetLanguageFeatures.hasCases?.includes("dative"))
          handleSubmit("case", "dative");
        break;
      case "a":
        if (targetLanguageFeatures.hasCases?.includes("accusative"))
          handleSubmit("case", "accusative");
        break;
      case "v":
        if (targetLanguageFeatures.hasCases?.includes("vocative"))
          handleSubmit("case", "vocative");
        break;
      case "&":
        if (targetLanguageFeatures.hasCases?.includes("accusative & dative"))
          handleSubmit("case", "accusative & dative");
        break;
      case "l":
        if (targetLanguageFeatures.hasCases?.includes("locative"))
          handleSubmit("case", "locative");
        break;
      default:
        moreReviewsInputRef.current?.focus();
    }
}

const renderCaseString = (itemCase: Case) => {
  let beginning;
  let key;
  let end;
  switch (itemCase) {
    case "nominative":
      beginning = null;
      key = "n";
      end = "ominative";
      break;
    case "accusative":
      beginning = null;
      key = "a";
      end = "ccusative";
      break;
    case "dative":
      beginning = null;
      key = "d";
      end = "ative";
      break;
    case "genitive":
      beginning = null;
      key = "g";
      end = "enitive";
      break;
    case "accusative & dative":
      beginning = "accusative ";
      key = "&";
      end = " dative";
      break;
    case "instrumental":
      beginning = null;
      key = "i";
      end = "nstrumental";
      break;
    case "locative":
      beginning = null;
      key = "l";
      end = "ocative";
      break;
    case "vocative":
      beginning = null;
      key = "v";
      end = "ocative";
      break;
  }

  return (
    <span className="text-slate-600">
      <span>{beginning}</span>
      <strong className="text-slate-900">{key}</strong>
      <span>{end}</span>
    </span>
  );
};
