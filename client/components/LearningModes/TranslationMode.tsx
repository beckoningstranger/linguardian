"use client";

import { useContext, useEffect, useRef, useState } from "react";

import {
  Gender,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
  SupportedLanguage,
} from "@/types";
import { GlobalContext } from "@/app/context/GlobalContext";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import HelperKeysSelector from "../Menus/HelperKeysSelector";
import GenderReview from "./GenderReview";

interface TranslationModeProps {
  items: ItemPopulatedWithTranslations[];
  listName: string;
  targetLanguageFeatures: LanguageFeatures;
  userNative: SupportedLanguage;
}

type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function TranslationMode({
  listName,
  items,
  targetLanguageFeatures,
  userNative,
}: TranslationModeProps) {
  const { toggleMobileMenu } = useContext(GlobalContext);

  const [reviewedItems, setReviewedItems] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<ItemPopulatedWithTranslations>(
    items[reviewedItems]
  );
  const [solution, setSolution] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [inputStyling, setInputStyling] = useState({
    input:
      "focus:border-b-2 bg-slate-200 m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
    form: "mt-0 flex justify-stretch transition-all rounded-md bg-slate-200",
  });
  const [showHelperKeys, setShowHelperKeys] = useState<boolean>(false);
  const [genderReview, setGenderReview] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const genderInputRef = useRef<HTMLInputElement>(null);

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItem.name === solution) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }

    // This is where we can trigger additional reviews for this item, i.e. gender
    if (
      activeItem.partOfSpeech === "noun" &&
      targetLanguageFeatures.hasGender &&
      activeItem.name === solution
    ) {
      setGenderReview(true);
      return;
    }
    finalizeReview();
  };

  function finalizeReview() {
    // This is where we can update the backend for this item, i.e. learningHistory and most of all new level and next review time

    setTimeout(() => {
      setSolution("");
      setReviewStatus("neutral");
      if (items[reviewedItems + 1]) {
        setReviewedItems(reviewedItems + 1);
        setActiveItem(items[reviewedItems + 1]);
      } else {
        console.log("Session complete");
        // This is where we navigate back to the dashboard and load fresh data from backend
      }
    }, 1500);
  }

  const handleGenderSubmit = (gender: Gender) => {
    setSolution(solution + ` (${gender})`);
    if (activeItem.gender && !activeItem.gender.includes(gender))
      setReviewStatus("incorrect");
    setGenderReview(false);
    finalizeReview();
  };

  const handleHelperKeyClick = (e: React.MouseEvent) => {
    setSolution(solution + (e.target as HTMLButtonElement).innerText);
    setShowHelperKeys(false);
    if (inputRef.current) inputRef.current.focus();
  };

  // Styling for input field depending on reviewStatus
  useEffect(() => {
    let inputFieldStyling;
    let formElementStyling;
    switch (reviewStatus) {
      case "correct":
        inputFieldStyling = "focus:border-b-inherit bg-green-300 scale-105";
        formElementStyling = "bg-green-300 scale-110";
        break;
      case "incorrect":
        inputFieldStyling = "focus:border-b-inherit bg-red-400 scale-90";
        formElementStyling = "bg-red-400";
        break;
      default:
        inputFieldStyling = "focus:border-b-2 bg-slate-200";
        formElementStyling = "bg-slate-200";
    }
    setInputStyling({
      input:
        inputFieldStyling +
        " m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
      form:
        formElementStyling +
        " mt-0 flex justify-stretch transition-all rounded-md",
    });
  }, [reviewStatus]);

  const promptString = activeItem.translations[userNative]
    .reduce((a, curr) => {
      a.push(curr.name);
      return a;
    }, [] as string[])
    .join(", ");

  return (
    <div className="flex flex-col justify-center transition-all">
      <div id="TopBar" className="w-full bg-slate-200 text-center text-xl">
        <h1 className="font-semibold">Reviewing {listName}</h1>
        <h2>
          {reviewedItems + 1} / {items.length} items
        </h2>
      </div>
      <div className="w-95 mx-6 mt-3 flex flex-col gap-3">
        <div
          id="Prompt"
          className={`w-95 rounded-md bg-slate-200 py-2 text-center`}
        >
          <h3 className="my-3 text-2xl">{promptString}</h3>
          <p className="text-sm">{activeItem.partOfSpeech}</p>
        </div>
        {targetLanguageFeatures.requiresHelperKeys &&
          !showHelperKeys &&
          !genderReview && (
            <>
              <div
                className="hidden rounded-md bg-slate-200 p-2 text-center md:block"
                onClick={() => setShowHelperKeys(true)}
              >
                Need help entering special characters?
              </div>
              <div
                className="rounded-md bg-slate-200 p-2 text-center md:hidden"
                onClick={() => toggleMobileMenu!()}
              >
                Need help entering special characters?
              </div>
            </>
          )}

        <MobileMenu>
          <HelperKeysSelector
            target={targetLanguageFeatures.langCode}
            handleHelperKeyClick={handleHelperKeyClick}
            toggleMobileMenu={toggleMobileMenu!}
            targetLanguageFeatures={targetLanguageFeatures}
            mobile={true}
          />
        </MobileMenu>
        {targetLanguageFeatures.requiresHelperKeys && showHelperKeys && (
          <HelperKeysSelector
            target={targetLanguageFeatures.langCode}
            handleHelperKeyClick={handleHelperKeyClick}
            targetLanguageFeatures={targetLanguageFeatures}
            mobile={false}
          />
        )}

        {!genderReview && (
          <form onSubmit={handleWordSubmit} className={inputStyling.form}>
            <input
              type="text"
              placeholder={`Translate to ${targetLanguageFeatures.langName}`}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className={inputStyling.input}
              autoFocus
              ref={inputRef}
              readOnly={reviewStatus !== "neutral"}
            />
          </form>
        )}
        {genderReview && (
          <GenderReview
            genderInputRef={genderInputRef}
            activeItem={activeItem}
            target={targetLanguageFeatures.langCode}
            targetLanguageFeatures={targetLanguageFeatures}
            handleGenderSubmit={handleGenderSubmit}
          />
        )}
      </div>
    </div>
  );
}
