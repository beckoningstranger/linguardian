import Link from "next/link";
import { Button } from "@headlessui/react";
import { FaPlus } from "react-icons/fa";

import paths from "@/lib/paths";
import LearningButton from "@/components/ui/LearningButton";
import { SupportedLanguage } from "@/lib/contracts";

interface DashboardBottomButtonsProps {
  language: SupportedLanguage;
  dashboardIsEmpty: boolean;
}
export default function DashboardBottomButtons({
  language,
  dashboardIsEmpty,
}: DashboardBottomButtonsProps) {
  return (
    <div className="fixed inset-x-0 flex w-full justify-end gap-1 px-1 py-2 tablet:static tablet:justify-between tablet:px-4">
      <div className="hidden size-[90px] tablet:block" />
      {!dashboardIsEmpty && (
        <div className="w-full rounded-lg shadow-xl tablet:w-[724px] desktop:m-0 desktop:w-[740px]">
          <LearningButton
            global
            listNumber={1}
            mode="learn"
            itemNumber={0}
            showLabel
            showIcon
            rounded
            disabled
            from="dashboard"
          />
        </div>
      )}
      <Link
        href={paths.listStorePath(language)}
        className={dashboardIsEmpty ? "animate-pulse" : ""}
      >
        <Button
          aria-label="Add a new list to your dashboard"
          className="grid size-[90px] place-items-center rounded-full bg-green-500 text-white shadow-xl ring-2 ring-transparent transition-all duration-300 hover:scale-105 hover:ring-green-700 hover:ring-offset-1 hover:ring-offset-white focus:ring-current focus:ring-offset-2 focus:ring-offset-white active:scale-100"
        >
          <FaPlus className="h-8 w-8 font-semibold text-white" />
        </Button>
      </Link>
    </div>
  );
}
