import Image from "next/image";

import LearningButton from "@/components/ui/LearningButton";
import { LearningStats } from "@/lib/contracts";
import learningButtonConfig from "@/lib/learningButtonConfig";
import { cn } from "@/lib/utils";

interface LearningButtonWithExpandProps {
  listNumber: number;
  learningStats: LearningStats;
  from: "dashboard" | number;
}
export default function LearningButtonWithExpand({
  listNumber,
  learningStats,
  from,
}: LearningButtonWithExpandProps) {
  const { availableModesWithInfo, recommendedModeWithInfo } = learningStats;
  const usedWithExpandButton = availableModesWithInfo.length > 1;

  const bgColor =
    "bg-" +
    learningButtonConfig.find(
      (config) => config.name === recommendedModeWithInfo.mode
    )?.color;
  const hoverColor =
    "hover:bg-" +
    learningButtonConfig.find(
      (config) => config.name === recommendedModeWithInfo.mode
    )?.hoverColor;

  return (
    <div
      className={cn("flex h-[90px] relative w-full rounded-t-md", hoverColor)}
    >
      <LearningButton
        modeWithInfo={recommendedModeWithInfo}
        listNumber={listNumber}
        usedWithExpandButton
        showLabel
        showIcon
        from={from}
      />

      {usedWithExpandButton && (
        <div
          className={cn(
            "group flex w-12 items-center justify-center",
            bgColor,
            hoverColor
          )}
        >
          <div className="absolute bottom-0 right-0 z-50 flex w-full translate-y-[600px] flex-col overflow-hidden rounded-t-md opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
            {availableModesWithInfo.map((modeWithInfo) => {
              if (modeWithInfo.mode === "overstudy") return null;
              return (
                <LearningButton
                  key={modeWithInfo.mode}
                  modeWithInfo={modeWithInfo}
                  listNumber={listNumber}
                  usedWithExpandButton
                  showIcon
                  showLabel
                  from={from}
                />
              );
            })}
          </div>

          {/* Divider */}
          <div className="absolute right-11 top-1/2 h-[64px] w-[1px] -translate-y-1/2 bg-grey-200" />

          <Image
            src="/icons/ExpandButton.svg"
            width={35}
            height={35}
            alt="Show more learning modes icon"
            className="size-[90px]"
          />
          <div />
        </div>
      )}
    </div>
  );
}
