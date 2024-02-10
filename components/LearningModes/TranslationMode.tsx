"use client";

import {
  GlobalContext,
  Item,
  languageFeatures,
} from "@/app/context/GlobalContext";
import { useContext, useEffect, useRef, useState } from "react";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import HelperKeysSelector from "../Menus/HelperKeysSelector";

interface TranslationModeProps {
  items: Item[];
  listName?: string;
}

type ReviewStatus = "neutral" | "correct" | "incorrect";

export default function TranslationMode({
  listName,
  items,
}: TranslationModeProps) {
  // Look up targetLanguage and user's native language
  const {
    user: { native },
    currentlyActiveLanguage: target,
    toggleMobileMenu,
  } = useContext(GlobalContext);

  const [reviewedItems, setReviewedItems] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<Item>(items[reviewedItems]);
  const [solution, setSolution] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [inputStyling, setInputStyling] = useState({
    input:
      "focus:border-b-2 bg-slate-200 m-3 pt-2 text-xl text-center mx-auto w-11/12 focus:outline-none border-b-black transition-all",
    form: "mt-0 flex justify-stretch transition-all rounded-md bg-slate-200",
  });
  const [showHelperKeys, setShowHelperKeys] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItem.meaning[target] === solution) {
      setReviewStatus("correct");
    } else {
      setReviewStatus("incorrect");
    }

    // This is where we can update the backend for this item, i.e. learningHistory and most of all new level and next review time

    // This is where we can trigger additional reviews for this item, i.e. gender

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
    }, 1000);
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

  return (
    <div className="flex flex-col justify-center transition-all">
      <div id="TopBar" className="bg-slate-200 text-center w-full text-xl">
        <h1 className="font-semibold">Reviewing {listName}</h1>
        <h2>
          {reviewedItems + 1} / {items.length} items
        </h2>
      </div>
      <div className="w-95 mx-6 flex flex-col mt-3 gap-3">
        <div
          id="Prompt"
          className={`bg-slate-200 text-center w-95 rounded-md py-2`}
        >
          <h3 className="my-3 text-2xl">{activeItem.meaning[native]}</h3>
          <p className="text-sm">{activeItem.partOfSpeech}</p>
        </div>
        {languageFeatures[target].requiresHelperKeys && !showHelperKeys && (
          <>
            <div
              className="bg-slate-200 p-2 my-2 text-center hidden md:block rounded-md"
              onClick={() => setShowHelperKeys(true)}
            >
              Need help entering special characters?
            </div>
            <div
              className="bg-slate-200 p-2 my-2 text-center md:hidden rounded-md"
              onClick={() => toggleMobileMenu!()}
            >
              Need help entering special characters?
            </div>
          </>
        )}

        <MobileMenu>
          <HelperKeysSelector
            target={target}
            handleHelperKeyClick={handleHelperKeyClick}
            toggleMobileMenu={toggleMobileMenu!}
            languageFeatures={languageFeatures}
            mobile={true}
          />
        </MobileMenu>
        {languageFeatures[target].requiresHelperKeys && showHelperKeys && (
          <HelperKeysSelector
            target={target}
            handleHelperKeyClick={handleHelperKeyClick}
            languageFeatures={languageFeatures}
            mobile={false}
          />
        )}
        <form onSubmit={handleSubmit} className={inputStyling.form}>
          <input
            type="text"
            placeholder={`Translate to ${languageFeatures[target].name}`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className={inputStyling.input}
            autoFocus
            ref={inputRef}
            readOnly={reviewStatus !== "neutral"}
          />
        </form>
      </div>
    </div>
  );
}
