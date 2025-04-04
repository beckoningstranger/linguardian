import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import DashboardBottomButtons from "./DashboardBottomButtons";
import ListDashboardCard from "./ListDashboardCard";

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
    <div className="flex max-w-[1126px] flex-col items-center gap-4 px-4 pt-4 tablet:flex-row tablet:flex-wrap tablet:gap-6 desktop:gap-10">
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
  );

  return (
    <>
      {renderedLists}
      <DashboardBottomButtons
        dashboardIsEmpty={learnedLists && learnedLists.length < 1}
        language={language}
      />
    </>
  );
}
