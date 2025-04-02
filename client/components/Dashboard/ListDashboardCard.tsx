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

  return (
    <div className="w-[336px] cursor-pointer overflow-clip rounded-lg bg-white/80 shadow-lg transition-all duration-500 ease-in-out hover:bg-white/90 hover:shadow-2xl">
      <Link href={paths.listDetailsPath(listNumber)}>
        <div className="flex min-h-[88px] items-center justify-center bg-blue-700 py-4 font-serif text-hmd text-white">
          {name}
        </div>
        <div className="grid h-[336px] place-items-center">
          <ListPieChart stats={listStats} height={336} mode="dashboard" />
        </div>
      </Link>
      <LearningButtonWithExpand
        listNumber={listNumber}
        unlockedModes={unlockedReviewModes[userNative]}
        listStats={listStats}
      />
    </div>
  );
}
