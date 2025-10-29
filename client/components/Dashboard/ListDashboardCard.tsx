import Link from "next/link";

import ListPieChart from "@/components/Charts/ListPieChart";
import LearningButtonWithExpand from "@/components/ui/LearningButtonWithExpand";
import { ListForDashboard } from "@/lib/contracts";
import paths from "@/lib/paths";

interface ListDashboardCardProps {
  list: ListForDashboard;
}

export default function ListDashboardCard({ list }: ListDashboardCardProps) {
  const { listNumber, name, units } = list;
  const listIsNotEmpty = units.length > 0;

  const listTitleElement = (
    <div className="flex h-[88px] items-center justify-center text-balance bg-blue-700 px-2 text-center font-serif text-hmd text-white">
      {name}
    </div>
  );

  const containerStyling =
    "w-[350px] cursor-pointer overflow-clip rounded-lg bg-white/80 shadow-lg transition-all duration-300 ease-in-out hover:bg-white/90 hover:shadow-2xl";

  if (!listIsNotEmpty)
    return (
      <div className={containerStyling}>
        <Link href={paths.listDetailsPath(listNumber)}>
          {listTitleElement}
          <div className="px-4 pt-12 text-center font-serif text-hlgb leading-relaxed text-blue-800">
            Start adding items to your new list!
          </div>
        </Link>
      </div>
    );

  return (
    <div className={containerStyling}>
      <Link href={paths.listDetailsPath(listNumber)}>
        {listTitleElement}
        <div className="grid h-[350px] place-items-center">
          <ListPieChart
            stats={list.learningStatsForUser}
            height={336}
            mode="dashboard"
          />
        </div>
      </Link>

      <LearningButtonWithExpand
        listNumber={listNumber}
        learningStats={list.learningStatsForUser}
        from="dashboard"
      />
    </div>
  );
}
