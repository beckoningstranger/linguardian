import Link from "next/link";
import { Types } from "mongoose";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import ListDashboardCard from "./ListDashboardCard";
import {
  LearnedItem,
  LearnedLanguageWithPopulatedLists,
  List,
  ListStats,
  ListStatus,
  SupportedLanguage,
  User,
} from "@/types";
import { getLearnedLanguageData } from "@/app/actions";

interface DashboardProps {
  user: User;
  currentlyActiveLanguage: SupportedLanguage;
}

export default async function Dashboard({
  user,
  currentlyActiveLanguage,
}: DashboardProps) {
  const userLearningDataForActiveLanguage:
    | LearnedLanguageWithPopulatedLists
    | undefined = await getLearnedLanguageData(
    user.id,
    currentlyActiveLanguage
  );

  let renderedLists: JSX.Element[] = [];

  if (userLearningDataForActiveLanguage?.learnedLists) {
    renderedLists = userLearningDataForActiveLanguage?.learnedLists.map(
      (list) => {
        const stats = calculateListStats(
          list,
          userLearningDataForActiveLanguage.learnedItems,
          userLearningDataForActiveLanguage.ignoredItems
        );
        const status = determineListStatus(stats);

        return (
          <ListDashboardCard
            key={list.listNumber}
            id={list.listNumber}
            title={list.name}
            stats={stats}
            status={status}
          />
        );
      }
    );
  }

  function AddNewListOption() {
    return (
      <Link
        href={`/app/lists?lang=${currentlyActiveLanguage}`}
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

function calculateListStats(
  list: List,
  learnedItems: LearnedItem[],
  ignoredItems: Types.ObjectId[]
): ListStats {
  const itemIDsInList = list.units.map((unitItem) => unitItem.item);
  const userlearnedItemIDs = learnedItems.map((item) => item.id);
  const learnedItemsInList = userlearnedItemIDs.filter((id) =>
    itemIDsInList.includes(id)
  );

  const ignoredItemsInList = ignoredItems.filter((id) =>
    itemIDsInList.includes(id)
  );

  const readyToReview = learnedItems.filter(
    (item) => item.nextReview < Date.now()
  );

  const learned = learnedItems.filter(
    (item) => !readyToReview.includes(item) && item.level > 8
  );

  const learning = learnedItems.filter(
    (item) => !readyToReview.includes(item) && item.level < 8
  );

  return {
    unlearned: itemIDsInList.length - learnedItemsInList.length,
    readyToReview: readyToReview.length,
    learned: learned.length,
    learning: learning.length,
    ignored: ignoredItemsInList.length,
  };
}

function determineListStatus(stats: ListStats): ListStatus {
  if (stats.readyToReview > 0) return "review";
  if (stats.readyToReview === 0 && stats.unlearned > 0) return "add";
  return "practice";
}
