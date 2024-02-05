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

interface ReviewButtonProps {
  mode: string;
  showAllModes?: Function;
  id: number;
}

export default function ReviewButton({
  mode,
  showAllModes,
  id,
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
    default:
      throw new Error("Unknown learning mode");
  }

  const renderedButton = (
    <button
      className={`p-2 m-1 ${color} text-white rounded-lg text-3xl border-4 border-white hover:border-slate-200 hover:scale-125 transition-all`}
      onClick={mode === "more" ? () => showAllModes!(true) : () => {}}
    >
      {icon}
    </button>
  );

  return mode === "more" ? (
    renderedButton
  ) : (
    <Link href={`/learn/${mode}/${id}`}>{renderedButton}</Link>
  );
}
