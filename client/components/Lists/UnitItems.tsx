"use client";

import {
  ItemWithPopulatedTranslations,
  LearnedItem,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import { useState } from "react";
import ListAddItemButton from "./ListAddItemButton";
import UnitItem from "./UnitItem";
import Button from "../ui/Button";

interface UnitItemsProps {
  unitItems: ItemWithPopulatedTranslations[];
  allLearnedItems: LearnedItem[];
  userNative: SupportedLanguage;
  userIsAuthor: boolean;
  pathToUnit: string;
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
  listAndUnitData,
}: UnitItemsProps) {
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const enrichedItems = unitItems.map((item) => {
    const enrichedItem = item as ItemPlusLearningInfo;
    const foundLearnedItem = allLearnedItems.find(
      (learnedItem) => learnedItem.id === item._id.toString()
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
    <div className="relative grid grid-cols-1 justify-items-center gap-2 p-2 sm:grid-cols-2">
      {unitItems.length > 0 && (
        <Button
          color="blue"
          fullWidth
          className="p-4 sm:hidden"
          onClick={() => setShowTranslations(!showTranslations)}
        >
          {showTranslations ? "Tap to show items" : "Tap to show translations"}
        </Button>
      )}
      {learnedItems} {unlearnedItems}
      {userIsAuthor && <ListAddItemButton addToThisList={listAndUnitData} />}
    </div>
  );
}
