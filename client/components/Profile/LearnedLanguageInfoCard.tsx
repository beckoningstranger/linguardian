import Flag from "react-world-flags";

import ActivityOverview from "@/components/Profile//ActivityOverview";
import CompetencyBadge from "@/components/Profile//CompetencyBadge";
import UserTopLists from "@/components/Profile//UserTopLists";
import StreakBadge from "@/components/Profile/StreakBadge";
import { cn } from "@/lib/utils";
import { LanguageWithFlagAndName, User } from "@linguardian/shared/contracts";

interface LearnedLanguageInfoCardProps {
  user: User;
  fillWidth: boolean;
  language: LanguageWithFlagAndName;
}

export default function LearnedLanguageInfoCard({
  user,
  fillWidth,
  language,
}: LearnedLanguageInfoCardProps) {
  const totalItemsForLanguage = user.learnedItems[language.code]?.length;
  const totalListsForLanguage = user.learnedLists[language.code]?.length;

  return (
    <div
      className={cn(
        "relative w-full rounded-md bg-white/90 grid gap-4 py-8",
        fillWidth && "min-[980px]:col-span-2"
      )}
      id={`LearnedLanguageInfo-${language.name}`}
    >
      <CompetencyBadge language={language} rating={99} />

      {/* Overview Start */}
      <div
        id={`Overview-${language.name}`}
        className="flex items-center gap-4 tablet:px-8"
      >
        <div
          id={`FlagAndStreak-${language.name}`}
          className="relative ml-4 mt-6 min-w-[120px] phone:ml-12 tablet:min-w-[150px]"
        >
          <Flag
            code={language.flag}
            className="size-[120px] rounded-full object-cover drop-shadow-lg tablet:size-[150px]"
          />
          <StreakBadge language={language} streak={3} />
        </div>
        <div
          id={`BasicInfo-${language.name}`}
          className={cn(
            "flex w-full flex-col",
            !fillWidth && "text-center",
            fillWidth && "ml-[48px]"
          )}
        >
          <p className="font-serif text-hlg">{language.name}</p>
          <p className="text-clgm">
            {totalItemsForLanguage || 0} items in {totalListsForLanguage} lists
          </p>
        </div>
      </div>
      {/* Overview End */}
      <div className={cn("grid", fillWidth && "min-[980px]:grid-cols-2")}>
        <ActivityOverview language={language} />
        <UserTopLists language={language} user={user} />
      </div>
    </div>
  );
}
