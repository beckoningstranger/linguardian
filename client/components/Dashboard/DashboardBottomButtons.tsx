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
    <div className="fixed bottom-4 flex w-screen justify-between gap-1 tablet:gap-4">
      <div></div>
      <div className="mr-32 w-[700px] rounded-lg shadow-xl tablet:mr-28 desktop:m-0">
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
          intent="bottomRightButton"
          aria-label="Add a new list to your dashboard"
        >
          <FaPlus className="h-8 w-8 font-semibold text-white" />
        </Button>
      </Link>
    </div>
  );
}
