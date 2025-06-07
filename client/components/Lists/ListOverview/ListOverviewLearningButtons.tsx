import IconSidebar from "@/components/IconSidebar/IconSidebar";
import LearningButton from "@/components/ui/LearningButton";
import LearningButtonWithExpand from "@/components/ui/LearningButtonWithExpand";
import { LearningMode, ListStats } from "@/lib/types";

interface ListOverviewLearningButtonsProps {
  listNumber: number;
  unitNumber?: number;
  unlockedModes: LearningMode[];
  listStats: ListStats;
}
export default function ListOverviewLearningButtons({
  listNumber,
  unitNumber,
  unlockedModes,
  listStats,
}: ListOverviewLearningButtonsProps) {
  return (
    <div id="ListOverviewLearningButtons" className="z-20">
      <div className="fixed bottom-0 left-0 w-full overflow-hidden rounded-t-lg tablet:left-1/2 tablet:ml-[41px] tablet:w-[632px] tablet:-translate-x-1/2 desktop:hidden">
        <LearningButtonWithExpand
          unlockedModes={unlockedModes}
          listNumber={listNumber}
          listStats={listStats}
          from={listNumber}
        />
      </div>
      <IconSidebar position="right" showOn="desktop">
        <LearningButton
          mode="learn"
          showIcon
          rounded
          listNumber={listNumber}
          itemNumber={listStats.unlearned}
          unitNumber={unitNumber}
          disabled={listStats.unlearned === 0}
          from={listNumber}
        />
        {unlockedModes.includes("translation") && (
          <LearningButton
            mode="translation"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={listStats.readyToReview}
            unitNumber={unitNumber}
            disabled={listStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedModes.includes("context") && (
          <LearningButton
            mode="context"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={listStats.readyToReview}
            unitNumber={unitNumber}
            disabled={listStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedModes.includes("context") && (
          <LearningButton
            mode="dictionary"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={listStats.readyToReview}
            unitNumber={unitNumber}
            disabled={listStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedModes.includes("context") && (
          <LearningButton
            mode="spellingBee"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={listStats.readyToReview}
            unitNumber={unitNumber}
            disabled={listStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedModes.includes("context") && (
          <LearningButton
            mode="visual"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={listStats.readyToReview}
            unitNumber={unitNumber}
            disabled={listStats.readyToReview === 0}
            from={listNumber}
          />
        )}
      </IconSidebar>
    </div>
  );
}
