"use client";

import {
  ItemPopulatedWithTranslations,
  LearnedItem,
  SupportedLanguage,
} from "@/types";
import { useState } from "react";
import UnitItem from "./UnitItem";

interface UnitItemsProps {
  unitItems: ItemPopulatedWithTranslations[];
  allLearnedItems: LearnedItem[];
  userNative: SupportedLanguage;
}

export interface ItemPlusLearningInfo extends ItemPopulatedWithTranslations {
  learned: boolean;
  nextReview?: number;
  level?: number;
}

export default function UnitItems({
  unitItems,
  allLearnedItems,
  userNative,
}: UnitItemsProps) {
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const enrichedItems = unitItems.map((item) => {
    const enrichedItem = item as ItemPlusLearningInfo;
    const foundLearnedItem = allLearnedItems.find(
      (learnedItem) => learnedItem.id === item._id
    );
    if (foundLearnedItem) {
      enrichedItem.learned = true;
      enrichedItem.nextReview = foundLearnedItem.nextReview;
      enrichedItem.level = foundLearnedItem.level;
      return enrichedItem;
    }
    return { ...item, learned: false } as ItemPlusLearningInfo;
  });

  let learnedItems: JSX.Element[] = [];
  let unlearnedItems: JSX.Element[] = [];

  enrichedItems.forEach((item, index) => {
    const translations = item.translations[userNative]
      .map((trans) => trans.name)
      .join(", ");
    const renderedItem = (
      <UnitItem
        item={item}
        translations={translations}
        showTranslations={showTranslations}
        key={index}
      />
    );
    item.learned
      ? learnedItems.push(renderedItem)
      : unlearnedItems.push(renderedItem);
  });

  return (
    <div className="grid grid-cols-1 justify-items-center gap-2 p-2 md:grid-cols-2">
      <div
        className="grid w-full select-none place-items-center rounded-md bg-slate-100 p-4 hover:bg-slate-200 md:hidden"
        onClick={() => setShowTranslations(!showTranslations)}
      >
        Show item translations
      </div>
      {learnedItems} {unlearnedItems}
    </div>
  );
}
