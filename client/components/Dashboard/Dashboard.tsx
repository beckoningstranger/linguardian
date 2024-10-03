import Link from "next/link";

import { getLearningDataForList, getPopulatedList } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import BottomRightButton from "../BottomRightButton";
import ListDashboardCard from "./ListDashboardCard";

interface DashboardProps {
  language: SupportedLanguage;
}

export default async function Dashboard({ language }: DashboardProps) {
  const sessionUser = await getUserOnServer();

  let learnedLists: number[] | undefined = sessionUser.learnedLists[language];
  if (!learnedLists) learnedLists = [];

  const { fetchedLists, fetchedLearningDataForEachList } =
    await getListsAndLearningDataForLanguage(
      learnedLists,
      sessionUser.id,
      language
    );

  const renderedLists = (
    <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
      {learnedLists?.map(async (listNumber) => {
        const listData = fetchedLists.find(
          (list) => list?.listNumber === listNumber
        );
        if (!listData) return null;
        const learningDataForList = fetchedLearningDataForEachList.find(
          (list) => list?.learnedList.listNumber
        );
        return (
          <ListDashboardCard
            key={listNumber}
            list={listData}
            userId={sessionUser.id}
            unlockedModes={
              listData.unlockedReviewModes[sessionUser.native.name]
            }
            learningDataForList={learningDataForList}
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
      className={`${dashboardIsEmpty ? "animate-pulse" : ""}`}
    >
      <BottomRightButton />
    </Link>
  );
}

async function getListsAndLearningDataForLanguage(
  learnedLists: number[],
  sessionUserId: string,
  language: SupportedLanguage
) {
  const fetchedListsPromises =
    learnedLists.length > 0
      ? learnedLists.map((listNumber) => getPopulatedList(listNumber))
      : [];

  const fetchedLearningDataForEachListPromises = learnedLists?.map(
    (listNumber) => getLearningDataForList(sessionUserId, language, listNumber)
  );
  const [fetchedLists, fetchedLearningDataForEachList] = await Promise.all([
    Promise.all(fetchedListsPromises),
    Promise.all(fetchedLearningDataForEachListPromises),
  ]);
  if (!fetchedLists) throw new Error("Could not get lists");
  if (!fetchedLearningDataForEachList)
    throw new Error("Could not get learning data");

  return { fetchedLists, fetchedLearningDataForEachList };
}
