import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import getUserOnServer from "@/lib/helperFunctions";
import { LearnedItem, List } from "@/types";
import { Types } from "mongoose";
import {
  AllLearningButtonsDesktopContainer,
  AllLearningButtonsMobileContainer,
} from "../AllLearningButtonsContainer";
import FlexibleLearningButtons from "../FlexibleLearningButtons";
import Leaderboard from "../Leaderboard";
import { calculateListStats, determineListStatus } from "../ListHelpers";
import AllLearningButtons from "./AllLearningButtons";

interface ChartsLButtonsLeaderboardProps {
  list: List;
  learnedItems: LearnedItem[];
  ignoredItems: Types.ObjectId[];
}

export default async function ChartsLButtonsLeaderboard({
  list,
  learnedItems,
  ignoredItems,
}: ChartsLButtonsLeaderboardProps) {
  const sessionUser = await getUserOnServer();
  const { unlockedReviewModes, language, listNumber } = list;
  const unlockedForUser = unlockedReviewModes[sessionUser.native.name];
  const listStats = calculateListStats(list, learnedItems, ignoredItems);
  const listStatus = determineListStatus(listStats);
  return (
    <>
      <div className="">
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
      </div>
      <AllLearningButtonsDesktopContainer>
        <AllLearningButtons
          listLanguage={language}
          listNumber={listNumber}
          listStats={listStats}
          unlockedReviewModes={unlockedReviewModes[language]}
        />
      </AllLearningButtonsDesktopContainer>
      <div className="m-2 rounded-md bg-slate-100 py-4 md:hidden">
        <Leaderboard />
      </div>
      <AllLearningButtonsMobileContainer>
        <FlexibleLearningButtons
          listLanguage={language}
          stats={listStats}
          status={listStatus}
          listNumber={listNumber}
          unlockedModes={unlockedForUser}
        />
      </AllLearningButtonsMobileContainer>
    </>
  );
}
