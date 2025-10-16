import Image from "next/image";

import { LanguageWithFlagAndName } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  language?: LanguageWithFlagAndName;
  streak: number;
}

export default function StreakBadge({ language, streak }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        "absolute flex size-[80px] items-center justify-center rounded-full bg-blue-700 text-white",
        language ? "-bottom-4 -right-4" : "bottom-0 -right-8"
      )}
      id="StreakCounter"
    >
      <Image
        src={"/icons/Lightning.svg"}
        height={35}
        width={35}
        alt={`${!language && "Total"} Streak length ${
          language && ` for ${language.name}`
        }`}
        className="size-[24px] tablet:size-[36px]"
      />
      <div className="font-sans text-clgm">{streak}</div>
    </div>
  );
}
