"use client";

import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import { useListContext } from "@/context/ListContext";
import {
  AllLearningButtonsDesktopContainer,
  AllLearningButtonsMobileContainer,
} from "../AllLearningButtonsContainer";
import FlexibleLearningButtons from "../FlexibleLearningButtons";
import Leaderboard from "../Leaderboard";
import AllLearningButtons from "./AllLearningButtons";
import StartLearningListButton from "./StartLearningListButton";
import { useSession } from "next-auth/react";
import { User } from "@/lib/types";

export default function ChartsLButtonsLeaderboard() {
  const {
    listStats,
    listStatus,
    listData: { language, listNumber },
    unlockedLearningModesForUser,
  } = useListContext();

  const { data } = useSession();
  const user = data?.user as User;

  if (!user?.learnedLists?.[language.code]?.includes(listNumber)) {
    return <StartLearningListButton />;
  }

  return (
    <>
      <>
        <div className="md:hidden">
          <ListBarChart stats={listStats} />
        </div>
        <div className="flex">
          <div className="m-2 hidden w-1/2 rounded-md bg-slate-100 py-4 md:block">
            <ListPieChart stats={listStats} />
          </div>
          <div className="m-2 hidden rounded-md bg-slate-100 py-4 md:block md:w-1/2">
            <Leaderboard />
          </div>
        </div>
      </>
      <AllLearningButtonsDesktopContainer>
        <AllLearningButtons
          listNumber={listNumber}
          unlockedLearningModesForUser={unlockedLearningModesForUser}
          listStats={listStats}
        />
      </AllLearningButtonsDesktopContainer>
      <div className="m-2 rounded-md bg-slate-100 py-4 md:hidden">
        <Leaderboard />
      </div>
      <AllLearningButtonsMobileContainer>
        <FlexibleLearningButtons
          stats={listStats}
          status={listStatus}
          listNumber={listNumber}
          unlockedModes={unlockedLearningModesForUser}
        />
      </AllLearningButtonsMobileContainer>
    </>
  );
}
