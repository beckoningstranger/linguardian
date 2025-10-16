import Link from "next/link";

import ListPieChart from "@/components/Charts/ListPieChart";
import LearningButtonWithExpand from "@/components/ui/LearningButtonWithExpand";
import paths from "@/lib/paths";
import { ListForDashboard } from "@/lib/contracts";

interface ListDashboardCardProps {
  list: ListForDashboard;
}

export default function ListDashboardCard({ list }: ListDashboardCardProps) {
  const itemIdsInUnits = list.units.map((unitItem) => unitItem.item);

  const { listNumber, name } = list;
  const listIsEmpty = itemIdsInUnits.length > 0;

  return (
    <div className="w-[350px] cursor-pointer overflow-clip rounded-lg bg-white/80 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/90 hover:shadow-2xl">
      <Link href={paths.listDetailsPath(listNumber)}>
        <div className="flex h-[88px] items-center justify-center text-balance bg-blue-700 px-2 text-center font-serif text-hmd text-white">
          {name}
        </div>
        <div className="grid h-[350px] place-items-center">
          {listIsEmpty ? (
            <ListPieChart
              stats={list.learningStatsForUser}
              height={336}
              mode="dashboard"
            />
          ) : (
            <div className="px-4 pt-12 text-center font-serif text-hlgb leading-relaxed text-blue-800">
              Start adding items to your new list!
            </div>
          )}
        </div>
      </Link>
      {listIsEmpty ? (
        <LearningButtonWithExpand
          listNumber={listNumber}
          unlockedLearningModesForUser={list.unlockedReviewModesForUser}
          learningStats={list.learningStatsForUser}
          from="dashboard"
        />
      ) : (
        <div className="h-[90px]" />
      )}
    </div>
  );
}
