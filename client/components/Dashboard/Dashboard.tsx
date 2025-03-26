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
    <div className="w-[1106px] px-4 pt-4">
      {learnedLists?.map((listNumber) => {
        const listData = populatedLists.find(
          (list) => list?.listNumber === listNumber
        );
        if (!listData) return null;
        return (
          <ListDashboardCard
            key={listNumber}
            list={listData}
            userNative={userNative}
            learningDataForLanguage={learningDataForLanguage}
          />
        );
      })}
    </div>
  );

  return (
    <>
      {renderedLists}
      <AddNewListOption
        dashboardIsEmpty={learnedLists && learnedLists.length < 1}
        language={language}
      />
    </>
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
