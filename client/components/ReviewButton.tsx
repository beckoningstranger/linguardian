"use client";

import paths from "@/lib/paths";
import { LearningMode, ListStats } from "@/lib/types";
import Link from "next/link";
import {
  FaBookOpenReader,
  FaRegEye,
  FaSpellCheck,
  FaSpinner,
} from "react-icons/fa6";
import { GiSeedling, GiSpellBook, GiWateringCan } from "react-icons/gi";
import { RxDotsHorizontal } from "react-icons/rx";

interface ReviewButtonProps {
  mode: LearningMode | "more" | "spinner";
  showAllModes?: Function;
  listNumber: number;
  unitNumber?: number;
  stats: ListStats;
  unlockedModes: LearningMode[] | undefined;
}

export default function ReviewButton({
  mode,
  showAllModes,
  listNumber,
  unitNumber,
  stats,
  unlockedModes,
}: ReviewButtonProps) {
  let icon;
  let color;

  switch (mode) {
    case "translation":
      icon = <GiWateringCan />;
      color = "bg-blue-500";
      break;
    case "learn":
      icon = <GiSeedling />;
      color = "bg-lime-600";
      break;
    case "context":
      icon = <FaBookOpenReader />;
      color = "bg-indigo-600";
      break;
    case "spellingBee":
      icon = <FaSpellCheck />;
      color = "bg-red-500";
      break;
    case "more":
      icon = <RxDotsHorizontal />;
      color = "bg-yellow-300";
      break;
    case "visual":
      icon = <FaRegEye />;
      color = "bg-sky-300";
      break;
    case "dictionary":
      icon = <GiSpellBook />;
      color = "bg-fuchsia-600";
      break;
    case "spinner":
      icon = <FaSpinner className="animate-spin" />;
      color = "bg-slate-300";
      break;
    default:
      throw new Error("Unknown learning mode");
  }

  const href =
    mode !== "spinner" && mode !== "more"
      ? unitNumber
        ? paths.learnUnitPath(mode, listNumber, unitNumber)
        : paths.learnListPath(mode, listNumber)
      : "";

  return mode === "more" ? (
    <button
      className="m-1 rounded-lg border-4 border-white bg-yellow-300 p-2 text-3xl text-white transition-all hover:scale-125 hover:border-slate-200"
      onClick={mode === "more" ? () => showAllModes!(true) : () => {}}
    >
      {icon}
    </button>
  ) : (
    <Link
      href={href}
      className={`m-1 rounded-lg border-4 border-white ${
        isDisabled()
          ? "bg-gray-300 pointer-events-none"
          : color + " hover:border-slate-200 hover:scale-125"
      } p-2 text-3xl text-white transition-all block`}
      aria-disabled={isDisabled()}
      tabIndex={isDisabled() ? -1 : undefined}
    >
      {icon}
    </Link>
  );

  function isDisabled(): boolean | undefined {
    if (mode === "more") return false;
    if (mode === "spinner") return true;
    if (mode === "learn" && stats.unlearned === 0) return true;
    if (mode === "learn" && unlockedModes && unlockedModes.length > 0)
      return false;
    if (
      mode !== "learn" &&
      stats.readyToReview > 0 &&
      unlockedModes &&
      unlockedModes.includes(mode)
    )
      return false;
    return true;
  }
}
