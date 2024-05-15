import ReviewButton from "@/components/ReviewButton";
import { LearningMode, ListStats } from "@/types";

interface AllLearningButtonsProps {
  listNumber: number;
  listStats: ListStats;
  unlockedReviewModes: LearningMode[];
}

export default function AllLearningButtons({
  listNumber,
  listStats,
  unlockedReviewModes,
}: AllLearningButtonsProps) {
  return (
    <>
      <ReviewButton
        listNumber={listNumber}
        mode="learn"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="translation"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="dictionary"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="context"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="visual"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="spellingBee"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
    </>
  );
}
