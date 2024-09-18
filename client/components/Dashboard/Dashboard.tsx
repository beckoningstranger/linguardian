import Link from "next/link";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import { getLearnedLanguageData } from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import paths from "@/lib/paths";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import ListDashboardCard from "./ListDashboardCard";
import BottomRightButton from "../BottomRightButton";
import { renderIntoDocument } from "react-dom/test-utils";

interface DashboardProps {
  language: SupportedLanguage;
}

export default async function Dashboard({ language }: DashboardProps) {
  const sessionUser = await getUserOnServer();
  if (!userIsLearningThisLanguage(sessionUser, language))
    throw new Error("You are not learning this language yet.");

  const userLearningDataForActiveLanguage = await getLearnedLanguageData(
    sessionUser.id,
    language
  );

  const unlockedModesForListsPromises =
    userLearningDataForActiveLanguage?.learnedLists.map((list) => {
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

  function AddNewListOption({
    dashboardContainsLists,
  }: {
    dashboardContainsLists: boolean | undefined;
  }) {
    return (
      <Link
        href={paths.listsLanguagePath(language)}
        className={`${!dashboardContainsLists ? "animate-pulse" : ""}`}
      >
        <BottomRightButton />
      </Link>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
        {renderedLists}
        <AddNewListOption
          dashboardContainsLists={renderedLists && renderedLists?.length > 0}
        />
      </div>
    </div>
  );
}

function userIsLearningThisLanguage(
  sessionUser: SessionUser,
  language: SupportedLanguage
) {
  const check = sessionUser.isLearning.filter((lang) => lang.name === language);
  if (check.length > 0) return true;
  return false;
}
