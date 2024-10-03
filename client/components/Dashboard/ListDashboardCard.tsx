"use client";
import { useState } from "react";
import { RxDotsVertical } from "react-icons/rx";

import ListBarChart from "@/components/Charts/ListBarChart";
import paths from "@/lib/paths";
import { LearningData, LearningMode, PopulatedList } from "@/lib/types";
import Link from "next/link";
import ListPieChart from "../Charts/ListPieChart";
import FlexibleLearningButtons from "../Lists/FlexibleLearningButtons";
import { getListStatsAndStatus } from "../Lists/ListHelpers";
import ContextMenu from "../Menus/ContextMenu";
import RemoveListButton from "./RemoveListButton";

interface ListDashboardCardProps {
  list: PopulatedList;
  userId: string;
  unlockedModes: LearningMode[] | undefined;
  learningDataForList: LearningData | undefined;
}

export default function ListDashboardCard({
  list,
  userId,
  unlockedModes,
  learningDataForList,
}: ListDashboardCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const itemIdsInUnits = list.units.map((item) => item.item._id);
  const { listStats, listStatus } = getListStatsAndStatus(
    itemIdsInUnits,
    learningDataForList
  );

  return (
    <div className="relative mx-6 rounded-md bg-slate-200 lg:mx-3 xl:mx-6">
      <ContextMenu
        show={showContextMenu}
        toggleContextMenu={() => setShowContextMenu(false)}
        moreClasses="absolute top-0 left-0 h-full"
      >
        <div className="m-4 flex flex-col">
          <RemoveListButton
            listLanguage={list.language}
            listName={list.name}
            listNumber={list.listNumber}
            userId={userId}
          />
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
          href={paths.listDetailsPath(list.listNumber)}
          className="w-full pl-2"
        >
          <h2 className="text-lg font-semibold">{list.name}</h2>
        </Link>
      </div>

      <div className="my-3 md:flex md:w-full md:flex-row md:justify-evenly md:px-2 xl:px-0">
        <div className="md:hidden">
          <ListBarChart stats={listStats} />
        </div>
        <div className="hidden h-[267px] w-[300px] md:block">
          {/* These numbers are the exact dimensions of the PieChart */}
          <ListPieChart stats={listStats} />
        </div>

        <FlexibleLearningButtons
          stats={listStats}
          status={listStatus}
          listNumber={list.listNumber}
          unlockedModes={unlockedModes}
          listLanguage={list.language}
        />
      </div>
    </div>
  );
}
