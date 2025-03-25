import { cn } from "@/lib/helperFunctionsClient";
import learningButtonConfig from "@/lib/learningButtonConfig";
import { LearningMode, ListStats } from "@/lib/types";
import Image from "next/image";
import LearningButton from "./LearningButton";

interface LearningButtonWithExpandProps {
  listNumber: number;
  unlockedModes: LearningMode[];
  listStats: ListStats;
}
export default function LearningButtonWithExpand({
  listNumber,
  unlockedModes,
  listStats,
}: LearningButtonWithExpandProps) {
  // Show LearnNewWords if there are new words to learn and there is nothing to review
  let recommendedLearningMode = "learn" as LearningMode;
  const excludeModes: LearningMode[] = [];

  // If there are no new words to learn exclude LearnNewWords and show random practice mode
  if (listStats.unlearned === 0) excludeModes.push("learn");
  if (listStats.readyToReview > 0)
    recommendedLearningMode =
      unlockedModes[Math.floor(Math.random() * unlockedModes.length)];

  excludeModes.push(recommendedLearningMode);
  const showExpandButton: boolean = Boolean(
    unlockedModes.length - excludeModes.length + 1
  );

  const allLearningModes: LearningMode[] = [
    "learn",
    "translation",
    "context",
    "dictionary",
    "spellingBee",
    "visual",
  ];

  return (
    <div
      className={cn(
        learningButtonConfig.find(
          (config) => config.name === recommendedLearningMode
        )?.color,
        learningButtonConfig.find(
          (config) => config.name === recommendedLearningMode
        )?.hoverColor,
        "flex h-[90px] transition-colors duration-200 ease-in-out w-full"
      )}
    >
      <LearningButton
        mode={recommendedLearningMode}
        itemNumber={
          recommendedLearningMode === "learn"
            ? listStats.unlearned
            : listStats.readyToReview
        }
        listNumber={listNumber}
        showExpand
        showLabel
        showIcon
      />
      {showExpandButton && (
        <div className="relative flex w-10 items-center justify-center">
          <div className="group">
            <div className="absolute bottom-0 right-0 z-50 flex w-[336px] translate-y-[600px] flex-col opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
              {allLearningModes
                .filter(
                  (m) =>
                    (!excludeModes.includes(m) && unlockedModes.includes(m)) ||
                    (m === "learn" && listStats.unlearned > 0)
                )
                .map((mode: LearningMode) => (
                  <LearningButton
                    key={mode}
                    mode={mode}
                    itemNumber={
                      mode === "learn"
                        ? listStats.unlearned
                        : listStats.readyToReview
                    }
                    listNumber={listNumber}
                    showIcon
                    showLabel
                  />
                ))}
            </div>

            {/* Divider */}
            <div className="absolute left-0 top-1/2 h-[64px] w-[1px] -translate-y-1/2 bg-grey-200" />

            <Image
              src="/static/icons/ExpandButton.svg"
              width={35}
              height={35}
              alt="Show more learning modes icon"
              className="h-[90px] w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
