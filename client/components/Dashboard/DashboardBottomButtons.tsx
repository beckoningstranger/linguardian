import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import Button from "../ui/Button";
import LearningButton from "../ui/LearningButton";
import { FaPlus } from "react-icons/fa";

interface DashboardBottomButtonsProps {
  language: SupportedLanguage;
  dashboardIsEmpty: boolean;
}
export default function DashboardBottomButtons({
  language,
  dashboardIsEmpty,
}: DashboardBottomButtonsProps) {
  return (
    <div className="absolute bottom-4 flex w-screen justify-between gap-4 px-4">
      <div></div>
      <div className="w-[700px] rounded-lg shadow-xl">
        <LearningButton
          global
          listNumber={1}
          mode="learn"
          itemNumber={0}
          showLabel
          showIcon
          rounded
          disabled
        />
      </div>
      <Link
        href={paths.listsLanguagePath(language)}
        className={`${dashboardIsEmpty && "animate-pulse"}`}
      >
        <Button
          color="green"
          intent="icon"
          aria-label="Add a new list to your dashboard"
          className="grid h-[90px] w-[90px] place-items-center rounded-full bg-green-500 shadow-xl hover:scale-110 hover:ring-green-700 disabled:after:rounded-full"
        >
          <FaPlus className="text-4xl font-semibold text-white" />
        </Button>
      </Link>
    </div>
  );
}
