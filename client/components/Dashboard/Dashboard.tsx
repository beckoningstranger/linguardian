import { IconSidebar, LearningButton, ListDashboardCard } from "@/components";
import {
  LearningModeWithInfo,
  ListForDashboard,
  SupportedLanguage,
} from "@/lib/contracts";
import { cn } from "@/lib/utils";
import AddListsToDashboardButton from "./AddListsToDashboardButton";

interface DashboardProps {
  dashboardLanguage: SupportedLanguage;
  learnedLists: number[];
  listsForDashboard: ListForDashboard[];
  modesAvailableForAllLists: LearningModeWithInfo[];
}

export default async function Dashboard({
  dashboardLanguage,
  learnedLists,
  listsForDashboard,
  modesAvailableForAllLists,
}: DashboardProps) {
  return (
    <div
      id="Dashboard"
      className="flex w-full grow justify-center overflow-y-auto"
    >
      <div
        id="Dashboard-Lists"
        className="m-4 grid min-h-[calc(100vh-112px-32px)] w-full items-start justify-center tablet:m-8 tablet:min-h-[calc(100vh-112px-64px)]"
        // This calculation is full height - top menu height -  margin
      >
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
            const listData = listsForDashboard.find(
              (list) => list?.listNumber === listNumber
            );
            if (!listData) return null;
            return <ListDashboardCard key={listNumber} list={listData} />;
          })}
        </div>
      </div>
      <IconSidebar position="right" showOn="tablet">
        {modesAvailableForAllLists.map((modeWithInfo) => {
          if (modeWithInfo.mode === "overstudy") return null;
          return (
            <LearningButton
              key={modeWithInfo.mode}
              modeWithInfo={modeWithInfo}
              showIcon
              rounded
              global
              langCode={dashboardLanguage}
              from="dashboard"
            />
          );
        })}
        <div className="flex grow flex-col justify-end">
          <AddListsToDashboardButton
            dashboardEmpty={learnedLists.length === 0}
            dashboardLanguage={dashboardLanguage}
          />
        </div>
      </IconSidebar>
    </div>
  );
}
