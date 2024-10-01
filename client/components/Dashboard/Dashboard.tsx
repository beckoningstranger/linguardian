import Link from "next/link";

import { getLearnedLanguageData } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { LearningMode, SupportedLanguage } from "@/lib/types";
import BottomRightButton from "../BottomRightButton";
import ListDashboardCard from "./ListDashboardCard";

interface DashboardProps {
  language: SupportedLanguage;
}

export default async function Dashboard({ language }: DashboardProps) {
  const sessionUser = await getUserOnServer();
  const userLearningDataForLanguage = await getLearnedLanguageData(
    sessionUser.id,
    language
  );
  let unlockedModesForUser: LearningMode[][] = [];
  const allLists = userLearningDataForLanguage?.learnedLists;

  if (userLearningDataForLanguage && allLists) {
    allLists.forEach((list) => {
      const unlockedForUser = list.unlockedReviewModes[sessionUser.native.name];
      unlockedModesForUser.push(unlockedForUser);
    });
  }

  const renderedLists = userLearningDataForLanguage?.learnedLists?.map(
    (list, index) => (
      <ListDashboardCard
        key={list.listNumber}
        list={list}
        allLearnedItemsForLanguage={userLearningDataForLanguage.learnedItems}
        allIgnoredItemsForLanguage={userLearningDataForLanguage.ignoredItems}
        userId={sessionUser.id}
        unlockedModes={
          unlockedModesForUser
            ? unlockedModesForUser[index]
            : unlockedModesForUser
        }
      />
    )
  );

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
        {renderedLists}
        <AddNewListOption
          dashboardIsNotEmpty={renderedLists && renderedLists?.length > 0}
          language={language}
        />
      </div>
    </div>
  );
}

function AddNewListOption({
  dashboardIsNotEmpty,
  language,
}: {
  dashboardIsNotEmpty: boolean | undefined;
  language: SupportedLanguage;
}) {
  return (
    <Link
      href={paths.listsLanguagePath(language)}
      className={`${!dashboardIsNotEmpty ? "animate-pulse" : ""}`}
    >
      <BottomRightButton />
    </Link>
  );
}
