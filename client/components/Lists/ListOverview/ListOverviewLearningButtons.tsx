import {
  IconSidebar,
  LearningButton,
  LearningButtonWithExpand,
} from "@/components";
import { LearningStats } from "@/lib/contracts";

interface ListOverviewLearningButtonsProps {
  listNumber: number;
  unitNumber?: number;
  learningStats: LearningStats;
}
export default function ListOverviewLearningButtons({
  listNumber,
  unitNumber,
  learningStats,
}: ListOverviewLearningButtonsProps) {
  const { availableModesWithInfo } = learningStats;
  return (
    <div id="ListOverviewLearningButtons" className="z-20">
      <div className="fixed bottom-0 left-0 w-full tablet:left-1/2 tablet:ml-12 tablet:w-[630px] tablet:-translate-x-1/2 desktop:hidden">
        <LearningButtonWithExpand
          listNumber={listNumber}
          learningStats={learningStats}
          from={listNumber}
        />
      </div>
      <IconSidebar position="right" showOn="desktop">
        {availableModesWithInfo.map((modeWithInfo) => {
          if (modeWithInfo.mode === "overstudy") return null;
          return (
            <LearningButton
              key={modeWithInfo.mode}
              modeWithInfo={modeWithInfo}
              showIcon
              rounded
              listNumber={listNumber}
              unitNumber={unitNumber}
              from={listNumber}
            />
          );
        })}
      </IconSidebar>
    </div>
  );
}
