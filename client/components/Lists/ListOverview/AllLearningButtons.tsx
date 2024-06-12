import ReviewButton from "@/components/ReviewButton";
import { LearningMode, ListStats, SupportedLanguage } from "@/types";

interface AllLearningButtonsProps {
  listNumber: number;
  listStats: ListStats;
  unlockedReviewModes: LearningMode[];
  listLanguage: SupportedLanguage;
}

export default function AllLearningButtons({
  listNumber,
  listStats,
  unlockedReviewModes,
  listLanguage,
}: AllLearningButtonsProps) {
  return (
    <>
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="learn"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="translation"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="dictionary"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="context"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="visual"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
      <ReviewButton
        listLanguage={listLanguage}
        listNumber={listNumber}
        mode="spellingBee"
        stats={listStats}
        unlockedModes={unlockedReviewModes}
      />
    </>
  );
}
