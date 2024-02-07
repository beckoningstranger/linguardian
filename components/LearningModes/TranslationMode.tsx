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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSolution("");
    console.log("Form submitted with ", solution);
    if (activeItem.meaning[target]?.includes(solution)) {
      console.log("Correct!");
    } else console.log("Wrong!");
    if (items[reviewedItems + 1]) {
      setReviewedItems(reviewedItems + 1);
      setActiveItem(items[reviewedItems + 1]);
    } else {
      console.log("Session complete");
    }
  };

  if (typeof activeItem.meaning !== undefined) {
    return (
      <div className="flex flex-col justify-center">
        <div id="TopBar" className="bg-slate-200 text-center w-full text-xl">
          <h1 className="font-semibold">Reviewing {listName}</h1>
          <h2>
            {reviewedItems + 1} / {items.length} items
          </h2>
        </div>
        <div
          id="Prompt"
          className="bg-slate-200 text-center w-95 m-6 rounded-md p-3"
        >
          <h3 className="my-3 text-2xl">
            {activeItem.meaning[native]?.join(", ")}
          </h3>
          <p className="text-sm">{activeItem.partOfSpeech}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-95 mb-6 mx-6 rounded-md bg-slate-200 flex justify-stretch"
        >
          <input
            type="text"
            placeholder={`Translate to ${convertCodeToLanguageName(target)}`}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="m-3 pt-2 text-xl bg-slate-200 text-center mx-auto w-11/12 focus:outline-none focus:border-b-2 border-b-black"
          />
        </form>
      </div>
    );
  }
}
