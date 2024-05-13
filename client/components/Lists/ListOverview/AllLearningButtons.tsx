import ReviewButton from "@/components/ReviewButton";
import { ListStats } from "@/types";

interface AllLearningButtonsProps {
  listNumber: number;
  listStats: ListStats;
}

export default function AllLearningButtons({
  listNumber,
  listStats,
}: AllLearningButtonsProps) {
  return (
    <>
      <ReviewButton listNumber={listNumber} mode="learn" stats={listStats} />
      <ReviewButton
        listNumber={listNumber}
        mode="translation"
        stats={listStats}
      />
      <ReviewButton
        listNumber={listNumber}
        mode="dictionary"
        stats={listStats}
      />
      <ReviewButton listNumber={listNumber} mode="context" stats={listStats} />
      <ReviewButton listNumber={listNumber} mode="visual" stats={listStats} />
      <ReviewButton
        listNumber={listNumber}
        mode="spellingBee"
        stats={listStats}
      />
    </>
  );
}
