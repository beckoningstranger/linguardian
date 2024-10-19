import Link from "next/link";

import paths from "@/lib/paths";
import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import { FaPlus } from "react-icons/fa";
import Button from "../ui/Button";
import ListDashboardCard from "./ListDashboardCard";

interface DashboardProps {
  language: SupportedLanguage;
  learnedLists: number[];
  populatedLists: PopulatedList[];
  learningDataForLanguage: LearningDataForLanguage;

  userNative: SupportedLanguage;
}

export default async function Dashboard({
  language,
  learnedLists,
  populatedLists,
  learningDataForLanguage,
  userNative,
}: DashboardProps) {
  const renderedLists = (
    <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
      {learnedLists?.map((listNumber) => {
        const listData = populatedLists.find(
          (list) => list?.listNumber === listNumber
        );
        if (!listData) return null;
        return (
          <ListDashboardCard
            key={listNumber}
            list={listData}
            unlockedModes={listData.unlockedReviewModes[userNative]}
            learningDataForLanguage={learningDataForLanguage}
          />
        );
      })}
    </div>
  );

  return (
    <div className="flex justify-center">
      {renderedLists}
      <AddNewListOption
        dashboardIsEmpty={learnedLists && learnedLists.length < 1}
        language={language}
      />
    </div>
  );
}

function AddNewListOption({
  dashboardIsEmpty,
  language,
}: {
  dashboardIsEmpty: boolean | undefined;
  language: SupportedLanguage;
}) {
  return (
    <Link
      href={paths.listsLanguagePath(language)}
      className={`${dashboardIsEmpty && "animate-pulse"}`}
    >
      <Button
        bottomRightButton
        intent="icon"
        aria-label="Add a new list to your dashboard"
      >
        <FaPlus className="text-2xl font-semibold text-white" />
      </Button>
    </Link>
  );
}
