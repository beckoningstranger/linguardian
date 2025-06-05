import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import DashboardBottomButtons from "./DashboardBottomButtons";
import ListDashboardCard from "./ListDashboardCard";
import { cn } from "@/lib/helperFunctionsClient";

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
    <div id="DashboardLists" className="m-4 grid place-items-center tablet:m-8">
      <div
        className={cn(
          "grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3 desktop:gap-10 desktopxl:grid-cols-4 pb-24",
          learnedLists.length < 2 &&
            "tablet:grid-cols-1 desktop:grid-cols-1 desktopxl:grid-cols-1",
          learnedLists.length < 3 &&
            "tablet:grid-cols-2 desktop:grid-cols-2 desktopxl:grid-cols-2"
        )}
      >
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
    </div>
  );

  return (
    <div id="Dashboard">
      {renderedLists}
      <DashboardBottomButtons
        dashboardIsEmpty={learnedLists && learnedLists.length < 1}
        language={language}
      />
    </div>
  );
}
