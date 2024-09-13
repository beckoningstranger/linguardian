"use client";

import {
  ItemWithPopulatedTranslations,
  LearnedItem,
  ListAndUnitData,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { useState } from "react";
import ListAddItemButton from "./ListAddItemButton";
import UnitItem from "./UnitItem";

interface UnitItemsProps {
  unitItems: ItemWithPopulatedTranslations[];
  allLearnedItems: LearnedItem[];
  userNative: SupportedLanguage;
  userIsAuthor: boolean;
  pathToUnit: string;
  userLanguagesWithFlags: UserLanguagesWithFlags;
  listAndUnitData: ListAndUnitData;
}

export interface ItemPlusLearningInfo extends ItemWithPopulatedTranslations {
  learned: boolean;
  nextReview?: number;
  level?: number;
}

export default function UnitItems({
  unitItems,
  allLearnedItems,
  userNative,
  userIsAuthor,
  pathToUnit,
  userLanguagesWithFlags,
  listAndUnitData,
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
      ?.map((trans) => trans.name)
      .join(", ");
    const renderedItem = (
      <UnitItem
        item={item}
        translations={translations}
        showTranslations={showTranslations}
        key={index}
        pathToUnit={pathToUnit}
        listAndUnitData={listAndUnitData}
        userIsAuthor={userIsAuthor}
      />
    );
    item.learned
      ? learnedItems.push(renderedItem)
      : unlearnedItems.push(renderedItem);
  });

  return (
    <div className="relative grid grid-cols-1 justify-items-center gap-2 p-2 md:grid-cols-2">
      {unitItems.length > 0 && (
        <button
          className="grid w-full select-none place-items-center rounded-md bg-slate-100 p-4 hover:bg-slate-200 md:hidden"
          onClick={() => setShowTranslations(!showTranslations)}
        >
          {showTranslations ? "Tap to show items" : "Tap to show translations"}
        </button>
      )}
      {learnedItems} {unlearnedItems}
      {userIsAuthor && (
        <ListAddItemButton
          userLanguagesWithFlags={userLanguagesWithFlags}
          addToThisList={listAndUnitData}
        />
      )}
    </div>
  );
}
