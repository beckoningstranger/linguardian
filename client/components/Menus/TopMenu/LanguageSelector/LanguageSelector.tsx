"use client";

import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";
import Flag from "react-world-flags";

import { MAX_NUMBER_OF_LANGUAGES_ALLOWED } from "@/lib/constants";
import { useOutsideClick } from "@/lib/hooks";
import { siteSettings } from "@/lib/siteSettings";
import { LanguageWithFlagAndName, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import AddNewLanguageOption from "./AddNewLanguageOption";
import LanguageSelectorLink from "./LanguageSelectorLink";

interface LanguageSelectorProps {
  activeLanguage: LanguageWithFlagAndName;
}

export default function LanguageSelector({
  activeLanguage,
}: LanguageSelectorProps) {
  const user = useSession().data?.user as User;
  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const currentPath = usePathname();
  const amountOfSupportedLanguages = siteSettings.supportedLanguages.length;

  const allLanguagesAndFlagsUserIsLearning = user?.learnedLanguages || [];

  const amountOfLanguagesUserLearns = Object.keys(
    allLanguagesAndFlagsUserIsLearning
  ).length;

  const allLanguageAndFlagExceptActive =
    allLanguagesAndFlagsUserIsLearning.filter(
      (lang) => lang.code !== activeLanguage.code
    );

  const ref = useOutsideClick(
    () =>
      setShowAllLanguageOptions(
        (showAllLanguageOptions) => !showAllLanguageOptions
      ),
    showAllLanguageOptions
  );

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="z-50 hidden tablet:block"
    >
      <div>
        <Flag
          code={activeLanguage.flag}
          onClick={() =>
            setShowAllLanguageOptions(
              (showAllLanguageOptions) => !showAllLanguageOptions
            )
          }
          className={`h-[75px] w-[75px] rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110`}
        />
      </div>
      {showAllLanguageOptions && (
        <div className={`absolute mt-4 grid animate-from-here gap-4`}>
          {allLanguageAndFlagExceptActive.map((lang) => {
            if (!lang) return;
            return (
              <LanguageSelectorLink
                setShowAllLanguageOptions={setShowAllLanguageOptions}
                language={lang}
                currentPath={currentPath}
                key={lang.flag}
              />
            );
          })}
          {allLanguageAndFlagExceptActive.length <
            MAX_NUMBER_OF_LANGUAGES_ALLOWED &&
            moreLanguagesToLearn(
              amountOfLanguagesUserLearns,
              amountOfSupportedLanguages
            ) && <AddNewLanguageOption />}
        </div>
      )}
    </div>
  );
}

export function moreLanguagesToLearn(
  amountOfLanguagesUserLearns: number,
  amountOfSupportedLanguages: number
): boolean {
  const amountOfLanguagesThatCanBeLearned = amountOfSupportedLanguages - 1; // native language has to be deducted
  if (amountOfLanguagesUserLearns >= amountOfLanguagesThatCanBeLearned)
    return false;
  return true;
}
