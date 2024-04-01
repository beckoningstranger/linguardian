import {
  GiWateringCan,
  GiSeedling,
  GiSpellBook,
  GiRead,
  GiCheckMark,
} from "react-icons/gi"; // Learn, Classic/Translation Review Mode, Dictionary Mode, alternatives for Context and Spelling Bee Mode
import {
  FaBookOpenReader,
  FaSpellCheck,
  FaRegEye,
  FaSpinner,
} from "react-icons/fa6"; // Context and Spelling Bee Mode
import { RxDotsHorizontal, RxDotsVertical } from "react-icons/rx"; // More button
import Link from "next/link";
import { ListStats } from "@/types";

interface ReviewButtonProps {
  mode: string;
  showAllModes?: Function;
  id: number;
  stats: ListStats;
}

export default function ReviewButton({
  mode,
  showAllModes,
  id,
  stats,
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
    case "spelling":
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

  return mode === "more" ? (
    <button
      className="m-1 rounded-lg border-4 border-white bg-yellow-300 p-2 text-3xl text-white transition-all hover:scale-125 hover:border-slate-200"
      onClick={mode === "more" ? () => showAllModes!(true) : () => {}}
    >
      {icon}
    </button>
  ) : (
    <Link
      href={`/learn/${mode}/${id}`}
      className={`m-1 rounded-lg border-4 border-white ${
        seeIfDisabled()
          ? "bg-gray-300 pointer-events-none"
          : color + " hover:border-slate-200 hover:scale-125"
      } p-2 text-3xl text-white transition-all block`}
      aria-disabled={seeIfDisabled()}
      tabIndex={seeIfDisabled() ? -1 : undefined}
    >
      {icon}
    </Link>
  );

  function seeIfDisabled(): boolean | undefined {
    if (mode === "learn" && stats.unlearned === 0) return true;
    if (mode !== "learn" && mode !== "more" && stats.readyToReview === 0)
      return true;
    return false;
  }
}
