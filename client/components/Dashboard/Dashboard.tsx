import Link from "next/link";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import { getLearnedLanguageData } from "@/lib/fetchData";
import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import { SupportedLanguage } from "@/types";
import ListDashboardCard from "./ListDashboardCard";

interface DashboardProps {
  language: SupportedLanguage;
}

export default async function Dashboard({ language }: DashboardProps) {
  const sessionUser = await getUserOnServer();
  const userLearningDataForActiveLanguage = await getLearnedLanguageData(
    sessionUser.id,
    language
  );

  const unlockedModesForListsPromises =
    userLearningDataForActiveLanguage?.learnedLists.map(async (list) => {
      if (list.unlockedReviewModes)
        return list.unlockedReviewModes[sessionUser.native.name];
    });
  if (!unlockedModesForListsPromises)
    throw new Error("Could not get unlocked modes for lists");

  const unlockedModesForLists = await Promise.all(
    unlockedModesForListsPromises
  );

  const renderedLists = userLearningDataForActiveLanguage?.learnedLists.map(
    (list, index) => {
      return (
        <ListDashboardCard
          key={list.listNumber}
          list={list}
          allLearnedItemsForLanguage={
            userLearningDataForActiveLanguage.learnedItems
          }
          allIgnoredItemsForLanguage={
            userLearningDataForActiveLanguage.ignoredItems
          }
          userId={sessionUser.id}
          unlockedModes={unlockedModesForLists[index]}
        />
      );
    }
  );

  function AddNewListOption() {
    return (
      <Link
        href={paths.listsLanguagePath(language)}
        className="relative mx-6 flex h-full min-h-40 items-center justify-center rounded-md bg-slate-200 md:min-h-80 lg:mx-3 xl:mx-6"
      >
        <div className="flex size-4/5 items-center justify-center rounded-md bg-slate-100 text-6xl text-slate-600 transition-all hover:scale-110 md:text-8xl">
          <HiOutlinePlusCircle />
        </div>
      </Link>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
        {renderedLists}
        <AddNewListOption />
      </div>
    </div>
  );
}
