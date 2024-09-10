import paths from "@/lib/paths";
import Link from "next/link";
import { useState } from "react";
import UnitItemText from "./UnitItemText";
import { ItemPlusLearningInfo } from "./UnitItems";
import { FaTrashCan } from "react-icons/fa6";
import { removeItemFromList } from "@/lib/actions";
import { ListAndUnitData } from "@/lib/types";
import toast from "react-hot-toast";

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
      href={
        paths.dictionaryItemPath(item.language, item.slug) +
        `?comingFrom=${pathToUnit}`
      }
      key={item.name + item.language}
      className={`relative p-3 rounded-md w-full flex flex-col items-center justify-center ${bgColor(
        item.nextReview,
        item.level
      )}`}
      onMouseOver={() => setShowItemTranslation(!showItemTranslation)}
      onMouseOut={() => setShowItemTranslation(!showItemTranslation)}
    >
      {userIsAuthor && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 transform p-3 text-2xl hover:text-red-500"
          onClick={async (e) => {
            e.preventDefault();
            toast.promise(removeItemFromList(listAndUnitData, item._id), {
              loading: "Deleting the item...",
              success: () => "Item deleted! 🎉",
              error: (err) => err.toString(),
            });
          }}
        >
          <FaTrashCan />
        </button>
      )}
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
