import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Button from "../ui/Button";
import LearningButton from "../ui/LearningButton";

interface DashboardBottomButtonsProps {
  language: SupportedLanguage;
  dashboardIsEmpty: boolean;
}
export default function DashboardBottomButtons({
  language,
  dashboardIsEmpty,
}: DashboardBottomButtonsProps) {
  return (
    <div className="absolute bottom-4 flex w-screen justify-between px-4">
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
      <AddNewListOption
        dashboardIsEmpty={dashboardIsEmpty}
        language={language}
      />
    </div>
  );
}

function AddNewListOption({
  dashboardIsEmpty,
  language,
}: {
  dashboardIsEmpty: boolean;
  language: SupportedLanguage;
}) {
  return (
    <Link
      href={paths.listsLanguagePath(language)}
      className={`${dashboardIsEmpty && "animate-pulse"}`}
    >
      <Button
        className="grid h-[90px] w-[90px] place-items-center rounded-full shadow-xl"
        color="green"
        aria-label="Add a new list to your dashboard"
      >
        <FaPlus className="text-4xl font-semibold text-white" />
      </Button>
    </Link>
  );
}
