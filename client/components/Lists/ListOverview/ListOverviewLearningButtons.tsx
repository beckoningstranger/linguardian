import {
  IconSidebar,
  LearningButton,
  LearningButtonWithExpand,
} from "@/components";
import { LearningMode, LearningStats } from "@/lib/contracts";

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
  const unlockedLearningModesForUser: LearningMode[] = ["translation"];
  return (
    <div id="ListOverviewLearningButtons" className="z-20">
      <div className="fixed bottom-0 left-0 w-full overflow-hidden rounded-t-lg tablet:left-1/2 tablet:ml-[44px] tablet:w-[632px] tablet:-translate-x-1/2 desktop:hidden">
        <LearningButtonWithExpand
          unlockedLearningModesForUser={unlockedLearningModesForUser}
          listNumber={listNumber}
          learningStats={learningStats}
          from={listNumber}
        />
      </div>
      <IconSidebar position="right" showOn="desktop">
        <LearningButton
          mode="learn"
          showIcon
          rounded
          listNumber={listNumber}
          itemNumber={learningStats.unlearned}
          unitNumber={unitNumber}
          disabled={learningStats.unlearned === 0}
          from={listNumber}
        />
        {unlockedLearningModesForUser.includes("translation") && (
          <LearningButton
            mode="translation"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={learningStats.readyToReview}
            unitNumber={unitNumber}
            disabled={learningStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedLearningModesForUser.includes("context") && (
          <LearningButton
            mode="context"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={learningStats.readyToReview}
            unitNumber={unitNumber}
            disabled={learningStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedLearningModesForUser.includes("context") && (
          <LearningButton
            mode="dictionary"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={learningStats.readyToReview}
            unitNumber={unitNumber}
            disabled={learningStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedLearningModesForUser.includes("context") && (
          <LearningButton
            mode="spellingBee"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={learningStats.readyToReview}
            unitNumber={unitNumber}
            disabled={learningStats.readyToReview === 0}
            from={listNumber}
          />
        )}
        {unlockedLearningModesForUser.includes("context") && (
          <LearningButton
            mode="visual"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={learningStats.readyToReview}
            unitNumber={unitNumber}
            disabled={learningStats.readyToReview === 0}
            from={listNumber}
          />
        )}
      </IconSidebar>
    </div>
  );
}
