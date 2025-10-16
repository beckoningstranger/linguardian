import { DashboardBottomButtons, ListDashboardCard } from "@/components";
import { ListForDashboard, SupportedLanguage } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface DashboardProps {
  dashboardLanguage: SupportedLanguage;
  learnedLists: number[];
  listsForDashboard: ListForDashboard[];
}

export default async function Dashboard({
  dashboardLanguage,
  learnedLists,
  listsForDashboard,
}: DashboardProps) {
  const renderedLists = (
    <div
      id="DashboardLists"
      className="m-4 grid min-h-[calc(100vh-112px-90px-32px-16px)] place-items-center tablet:m-8 tablet:min-h-[calc(100vh-112px-90px-64px-16px)]"
      // This calculation is full height - top menu height - bottom button height - margin (here) - padding (around bottom button)
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
  );

  return (
    <div id="Dashboard">
      {renderedLists}
      <DashboardBottomButtons
        dashboardIsEmpty={learnedLists && learnedLists.length < 1}
        language={dashboardLanguage}
      />
    </div>
  );
}
