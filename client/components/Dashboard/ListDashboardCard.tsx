import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import ListPieChart from "../Charts/ListPieChart";
import { getListStats } from "../Lists/ListHelpers";
import LearningButtonWithExpand from "../ui/LearningButtonWithExpand";
import Link from "next/link";
import paths from "@/lib/paths";

interface ListDashboardCardProps {
  list: PopulatedList;
  userNative: SupportedLanguage;
  learningDataForLanguage: LearningDataForLanguage | undefined;
}

export default function ListDashboardCard({
  list,
  userNative,
  learningDataForLanguage,
}: ListDashboardCardProps) {
  const itemIdsInUnits = list.units.map((item) => item.item._id.toString());
  const listStats = getListStats(itemIdsInUnits, learningDataForLanguage);

  const { listNumber, name, unlockedReviewModes } = list;
  const listIsEmpty = itemIdsInUnits.length > 0;

  return (
    <div className="w-[336px] cursor-pointer overflow-clip rounded-lg bg-white/80 shadow-lg transition-all duration-500 ease-in-out hover:bg-white/90 hover:shadow-2xl">
      <Link href={paths.listDetailsPath(listNumber)}>
        <div className="flex h-[88px] items-center justify-center bg-blue-700 px-2 text-center font-serif text-hmd text-white">
          {name}
        </div>
        <div className="grid h-[336px] place-items-center">
          {listIsEmpty ? (
            <ListPieChart stats={listStats} height={336} mode="dashboard" />
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
          unlockedModes={unlockedReviewModes[userNative]}
          listStats={listStats}
          from="dashboard"
        />
      ) : (
        <div className="h-[90px]" />
      )}
    </div>
  );
}
