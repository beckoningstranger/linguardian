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
import Button from "./ui/Button";
import { cn } from "@/lib/helperFunctionsClient";

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
      icon = <FaSpinner />;
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
    <Button
      intent="icon"
      className={cn(color, "text-3xl h-14 w-14")}
      onClick={mode === "more" ? () => showAllModes!(true) : () => {}}
      aria-label="Show all learning modes"
    >
      {icon}
    </Button>
  ) : (
    <Button
      intent="icon"
      disabled={isDisabled()}
      aria-label={`Start a learning session in ${mode} mode`}
      className={cn(color, "text-3xl h-14 w-14")}
      tabIndex={isDisabled() ? -1 : undefined}
    >
      <Link href={href}>{icon}</Link>
    </Button>
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
