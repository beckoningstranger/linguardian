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
    <>
      <div className="fixed bottom-0 z-50 flex w-full overflow-hidden tablet:left-1/2 tablet:w-auto tablet:-translate-x-1/2 tablet:transform desktop:hidden">
        <div className="w-full overflow-hidden rounded-t-lg tablet:ml-[86px] tablet:w-[632px]">
          <LearningButtonWithExpand
            unlockedModes={unlockedModes}
            listNumber={listNumber}
            listStats={listStats}
          />
        </div>
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
          />
        )}
      </IconSidebar>
    </>
  );
}
