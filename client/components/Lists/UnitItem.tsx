import paths from "@/lib/paths";
import { ListAndUnitData } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import DeleteItemButton from "./DeleteItemButton";
import UnitItemText from "./UnitItemText";
import { ItemPlusLearningInfo } from "./UnitItems";
import { updateRecentDictionarySearches } from "@/lib/actions";
import { MobileMenuContextProvider } from "../../context/MobileMenuContext";

interface UnitItemProps {
  item: ItemPlusLearningInfo;
  translations: string | undefined;
  showTranslations: boolean;
  pathToUnit: string;
  listAndUnitData: ListAndUnitData;
  userIsAuthor: boolean;
}

export default function UnitItem({
  item,
  translations,
  showTranslations,
  pathToUnit,
  listAndUnitData,
  userIsAuthor,
}: UnitItemProps) {
  const [showItemTranslation, setShowItemTranslation] =
    useState<boolean>(false);

  return (
    <Link
      href={paths.dictionaryItemPath(item.slug) + `?comingFrom=${pathToUnit}`}
      className={`relative p-3 rounded-md w-full flex flex-col items-center justify-center ${bgColor(
        item.nextReview,
        item.level
      )}`}
      onMouseOver={() => setShowItemTranslation(true)}
      onMouseOut={() => setShowItemTranslation(false)}
      onClick={() => updateRecentDictionarySearches(item.slug)}
    >
      {userIsAuthor && (
        <MobileMenuContextProvider>
          <DeleteItemButton
            listAndUnitData={listAndUnitData}
            itemId={item._id}
            itemName={item.name}
            listName={listAndUnitData.listName}
          />
        </MobileMenuContextProvider>
      )}
      <UnitItemText
        translations={translations}
        itemName={!showItemTranslation ? item.name : translations}
        showTranslations={showTranslations}
      />
      <div className="pointer-events-none text-xs">{item.partOfSpeech}</div>
      <div className="pointer-events-none flex gap-1 text-center text-xs sm:flex-col">
        {item.level && (
          <div>
            <span>
              Level {item.level}:{" "}
              {currentItemStatus(item.nextReview, item.level)}
            </span>
            <span className="sm:hidden">.</span>
          </div>
        )}
        <div>{nextReview(item.nextReview, item.level)}</div>
      </div>
    </Link>
  );
}

function bgColor(nextReview?: number, itemLevel?: number) {
  // Ready to water blue: #26A0FC
  // Mature green: #00E396
  // Growing orange: #FEB019
  if (!nextReview || !itemLevel) return "bg-slate-100";
  const now = Date.now();
  return itemLevel < 8
    ? nextReview > now
      ? "bg-[#FEB019]"
      : "text-white bg-[#26A0FC]"
    : nextReview > now
    ? "bg-[#00E396]"
    : "text-white bg-[#26A0FC]";
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

function nextReview(nextReview?: number, itemLevel?: number) {
  if (!nextReview || !itemLevel) return "";
  const waterMessage =
    `Water after ` +
    new Date(nextReview).toLocaleString(undefined, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  return waterMessage;
}
