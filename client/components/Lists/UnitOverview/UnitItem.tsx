"use client";

import paths from "@/lib/paths";
import { ListAndUnitData } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import DeleteItemButton from "../EditUnit/DeleteItemButton";
import UnitItemText from "./UnitItemText";
import { ItemPlusLearningInfo } from "./UnitItems";
import { updateRecentDictionarySearches } from "@/lib/actions";
import { MobileMenuContextProvider } from "../../../context/MobileMenuContext";
import Image from "next/image";

interface UnitItemProps {
  item: ItemPlusLearningInfo;
  translations: string | undefined;
  pathToUnit: string;
  listAndUnitData: ListAndUnitData;
  editMode?: boolean;
}

export default function UnitItem({
  item,
  translations,
  pathToUnit,
  listAndUnitData,
  editMode,
}: UnitItemProps) {
  const [showItemTranslation, setShowItemTranslation] =
    useState<boolean>(false);

  return (
    <div
      className={`relative pr-4 flex w-full rounded-lg h-[86px] ${bgColor(
        item.nextReview,
        item.level
      )}`}
    >
      {editMode && (
        <MobileMenuContextProvider>
          <DeleteItemButton
            listAndUnitData={listAndUnitData}
            itemId={item._id}
            itemName={item.name}
            listName={listAndUnitData.listName}
          />
        </MobileMenuContextProvider>
      )}
      <Image
        alt="Translation Icon"
        height={20}
        width={60}
        className="h-[86px] w-[48px]"
        src={"/icons/Translate.svg"}
        onClick={() => setShowItemTranslation((prev) => !prev)}
      />
      <Link
        href={paths.dictionaryItemPath(item.slug) + `?comingFrom=${pathToUnit}`}
        className="w-full"
        onClick={() => updateRecentDictionarySearches(item.slug)}
      >
        <div id="content" className="flex w-full flex-col gap-2 py-4">
          <div className="flex w-full items-center justify-between">
            <UnitItemText
              translations={translations}
              itemName={!showItemTranslation ? item.name : translations}
              showItemTranslation={showItemTranslation}
            />
            <div
              className={`text-left absolute top-4 text-csmb text-grey-900 ${
                editMode ? "right-20" : "right-4"
              }`}
            >
              {item.partOfSpeech === "noun" &&
                item.gender &&
                !showItemTranslation && <span>{item.gender} </span>}
              {item.partOfSpeech}
            </div>
          </div>

          {item.level && (
            <div className="absolute bottom-2 left-11 flex justify-between text-cxsb text-grey-900 phone:text-csmb">
              Level {item.level}:{" "}
              {currentItemStatus(item.nextReview, item.level)}
            </div>
          )}
          {item.nextReview && item.level && (
            <div className="absolute bottom-2 right-4 text-cxsb text-grey-900 phone:text-csmb">
              {nextReview(item.nextReview, item.level)}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

function bgColor(nextReview?: number, itemLevel?: number) {
  if (!nextReview || !itemLevel) return "bg-white/90 hover:bg-white";
  const now = Date.now();
  return itemLevel < 8
    ? nextReview > now
      ? "bg-orange-300 hover:bg-orange-400"
      : "bg-blue-400 hover:bg-blue-500"
    : nextReview > now
    ? "bg-green-400 hover:bg-green-500"
    : "bg-blue-400 hover:bg-blue-500";
}

function currentItemStatus(nextReview?: number, itemLevel?: number) {
  if (!nextReview || !itemLevel) return "";
  const now = Date.now();
  return nextReview > now
    ? itemLevel < 8
      ? "Growing"
      : "Mature"
    : "Ready to water";
}

function nextReview(nextReview: number, itemLevel: number) {
  if (!nextReview || !itemLevel) return "";
  if (currentItemStatus(nextReview, itemLevel) === "Ready to water") {
    return "Water now!";
  }
  const waterMessage =
    `Due next: ` +
    new Date(nextReview).toLocaleString(undefined, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  return waterMessage;
}
