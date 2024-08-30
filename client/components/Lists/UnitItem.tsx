import { useState } from "react";
import UnitItemText from "./UnitItemText";
import { ItemPlusLearningInfo } from "./UnitItems";
import Link from "next/link";
import paths from "@/lib/paths";

interface UnitItemProps {
  item: ItemPlusLearningInfo;
  translations: string | undefined;
  showTranslations: boolean;
  pathToUnit: string;
}

export default function UnitItem({
  item,
  translations,
  showTranslations,
  pathToUnit,
}: UnitItemProps) {
  const [showItemTranslation, setShowItemTranslation] =
    useState<boolean>(false);

  return (
    <Link
      href={
        paths.dictionaryItemPath(item.language, item.slug) +
        `?comingFrom=${pathToUnit}`
      }
      key={item.name + item.language}
      className={`p-3 rounded-md w-full flex flex-col items-center justify-center ${bgColor(
        item.nextReview,
        item.level
      )}`}
      onMouseOver={() => setShowItemTranslation(!showItemTranslation)}
      onMouseOut={() => setShowItemTranslation(!showItemTranslation)}
    >
      <UnitItemText
        translations={translations}
        itemName={!showItemTranslation ? item.name : translations}
        showTranslations={showTranslations}
      />
      <div className="pointer-events-none text-xs">{item.partOfSpeech}</div>
      <div className="pointer-events-none text-xs">
        {item.level && <span>Level {item.level}:</span>}
        <span> {nextReview(item.nextReview)}</span>
      </div>
    </Link>
  );
}

function bgColor(nextReview?: number, level?: number) {
  // Ready to water blue: #26A0FC
  // Mature green: #00E396
  // Growing orange: #FEB019
  if (!nextReview || !level) return "bg-slate-100";
  const now = Date.now();
  return level < 8
    ? nextReview > now
      ? "bg-[#FEB019]"
      : "text-white bg-[#26A0FC]"
    : nextReview > now
    ? "bg-[#00E396]"
    : "text-white bg-[#26A0FC]";
}

function nextReview(nextReview?: number) {
  if (!nextReview) return null;
  const now = Date.now();

  return nextReview > now
    ? `Growing. Water after ${new Date(nextReview).toLocaleString()}`
    : "Ready to water";
}
