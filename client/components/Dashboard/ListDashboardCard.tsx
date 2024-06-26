"use client";
import { useState } from "react";
import { RxDotsVertical } from "react-icons/rx";

import ContextMenu from "../Menus/ContextMenu";
import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "../Charts/ListPieChart";
import { LearnedItem, LearningMode, List } from "@/lib/types";
import Link from "next/link";
import paths from "@/lib/paths";
import { removeListFromDashboard } from "@/lib/actions";
import FlexibleLearningButtons from "../Lists/FlexibleLearningButtons";
import { Types } from "mongoose";
import { calculateListStats, determineListStatus } from "../Lists/ListHelpers";
import RemoveListSubmitButton from "./RemoveListSubmitButton";

interface ListDashboardCardProps {
  list: List;
  allLearnedItemsForLanguage: LearnedItem[];
  allIgnoredItemsForLanguage: Types.ObjectId[];
  userId: string;
  unlockedModes: LearningMode[] | undefined;
}

export default function ListDashboardCard({
  list,
  allIgnoredItemsForLanguage,
  allLearnedItemsForLanguage,
  userId,
  unlockedModes,
}: ListDashboardCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const stats = calculateListStats(
    list,
    allLearnedItemsForLanguage,
    allIgnoredItemsForLanguage
  );
  const status = determineListStatus(stats);

  const removeListFromDashboardAction = removeListFromDashboard.bind(
    null,
    list.listNumber,
    list.language,
    userId
  );

  return (
    <div className="relative mx-6 rounded-md bg-slate-200 lg:mx-3 xl:mx-6">
      <ContextMenu
        show={showContextMenu}
        toggleContextMenu={() => setShowContextMenu(false)}
        moreClasses="absolute top-0 left-0 h-full"
      >
        <div className="m-4 flex flex-col">
          <form action={removeListFromDashboardAction}>
            <RemoveListSubmitButton
              language={list.language}
              listNumber={list.listNumber}
            />
          </form>
        </div>
      </ContextMenu>
      <div className="m-3 flex items-center justify-between">
        <div
          className="py-2 pr-2 text-2xl hover:text-white"
          onClick={() => setShowContextMenu(true)}
        >
          <RxDotsVertical />
        </div>
        <Link
          href={paths.listDetailsPath(list.listNumber, list.language)}
          className="w-full pl-2"
        >
          <h2 className="text-lg font-semibold">{list.name}</h2>
        </Link>
      </div>

      <div className="my-3 md:flex md:w-full md:flex-row md:justify-evenly md:px-2 xl:px-0">
        <div className="md:hidden">
          <ListBarChart stats={stats} />
        </div>
        <div className="hidden h-[267px] w-[300px] md:block">
          {/* These numbers are the exact dimensions of the PieChart */}
          <ListPieChart stats={stats} />
        </div>

        <FlexibleLearningButtons
          listLanguage={list.language}
          stats={stats}
          status={status}
          listNumber={list.listNumber}
          unlockedModes={unlockedModes}
        />
      </div>
    </div>
  );
}
