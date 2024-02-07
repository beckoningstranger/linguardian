"use client";

import { Item, SupportedLanguage } from "@/app/context/GlobalContext";
import { useState } from "react";

import convertCodeToLanguageName from "@/app/helpers/convertLanguageCodeToName";

interface TranslationModeProps {
  items: Item[];
  listName?: string;
  target: SupportedLanguage;
  native: SupportedLanguage;
}

export default function TranslationMode({
  listName,
  items,
  target,
  native,
}: TranslationModeProps) {
  const [reviewedItems, setReviewedItems] = useState(0);
  const [activeItem, setActiveItem] = useState(items[reviewedItems]);
  const [solution, setSolution] = useState("");
  const [inputFieldColor, setInputFieldColor] = useState("bg-slate-200");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSolution("");
    const success = activeItem.meaning[target]!.includes(solution);

    setInputFieldColor(success ? "bg-green-300" : "bg-red-400");
    // This is where we can update the backend for this item, i.e. learningHistory and most of all new level and next review time

    // This is where we can trigger additional reviews for this item, i.e. gender

    setTimeout(() => {
      setInputFieldColor("bg-slate-200");
      if (items[reviewedItems + 1]) {
        setReviewedItems(reviewedItems + 1);
        setActiveItem(items[reviewedItems + 1]);
      } else {
        console.log("Session complete");
        // This is where we navigate back to the dashboard and load fresh data from backend
      }
    }, 1000);
  };

  if (typeof activeItem.meaning !== undefined) {
    return (
      <div className="flex flex-col justify-center transition-all">
        <div id="TopBar" className="bg-slate-200 text-center w-full text-xl">
          <h1 className="font-semibold">Reviewing {listName}</h1>
          <h2>
            {reviewedItems + 1} / {items.length} items
          </h2>
        </div>
        <div
          id="Prompt"
          className={`bg-slate-200 text-center w-95 m-6 rounded-md p-3`}
        >
          <h3 className="my-3 text-2xl">
            {activeItem.meaning[native]?.join(", ")}
          </h3>
          <p className="text-sm">{activeItem.partOfSpeech}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`w-95 mb-6 mx-6 rounded-md ${inputFieldColor} flex justify-stretch transition-all`}
        >
          <input
            type="text"
            placeholder={`Translate to ${convertCodeToLanguageName(target)}`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className={`m-3 pt-2 bg-transparent text-xl text-center mx-auto w-11/12 focus:outline-none focus:border-b-2 border-b-black`}
          />
        </form>
      </div>
    );
  }
}
