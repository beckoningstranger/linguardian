import { useState } from "react";
import UnitItemText from "./UnitItemText";
import { ItemPlusLearningInfo } from "./UnitItems";

interface UnitItemProps {
  item: ItemPlusLearningInfo;
  translations: string;
  showTranslations: boolean;
}

export default function UnitItem({
  item,
  translations,
  showTranslations,
}: UnitItemProps) {
  const [showItemTranslation, setShowItemTranslation] =
    useState<boolean>(false);

  return (
    <div
      key={item.name + item.language}
      className={`p-3 rounded-md w-full flex flex-col items-center justify-center z-50 ${bgColor(
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
      <div className="text-xs">{item.partOfSpeech}</div>
      <div className="text-xs">
        {item.level && <span>Level {item.level}:</span>}
        <span> {nextReview(item.nextReview)}</span>
      </div>
    </div>
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
