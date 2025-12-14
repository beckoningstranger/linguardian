import { cn } from "@/lib/utils";

import LearnedLanguageInfoCard from "@/components/Profile/LearnedLanguageInfoCard";
import { User } from "@linguardian/shared/contracts";

interface LearnedLanguageInfoProps {
  user: User;
}

export default function LearnedLanguageInfo({
  user,
}: LearnedLanguageInfoProps) {
  const totalLanguagesLearning = user.learnedLanguages.length;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-y-12 gap-x-2",
        totalLanguagesLearning > 1 && "min-[980px]:grid-cols-2"
      )}
    >
      {user.learnedLanguages.map((learnedLanguage, index) => {
        const fillWidth =
          totalLanguagesLearning > 1 &&
          totalLanguagesLearning % 2 !== 0 &&
          index === totalLanguagesLearning - 1;

        return (
          <LearnedLanguageInfoCard
            user={user}
            language={learnedLanguage}
            key={learnedLanguage.code}
            fillWidth={fillWidth}
          />
        );
      })}
    </div>
  );
}
