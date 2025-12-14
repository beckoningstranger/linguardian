"use client";

import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";
import Flag from "react-world-flags";

import AddNewLanguageOption from "@/components/Menus/TopMenu/LanguageSelector/AddNewLanguageOption";
import LanguageSelectorLink from "@/components/Menus/TopMenu/LanguageSelector/LanguageSelectorLink";
import { useUser } from "@/context/UserContext";
import { MAX_NUMBER_OF_LANGUAGES_ALLOWED } from "@/lib/constants";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { allSupportedLanguages } from "@linguardian/shared/constants";
import { moreLanguagesToLearn, showLanguageSelector } from "@/lib/utils";

export default function LanguageSelector() {
  const { user, activeLanguage } = useUser();

  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const currentPath = usePathname();
  const ref = useOutsideClick(
    () =>
      setShowAllLanguageOptions(
        (showAllLanguageOptions) => !showAllLanguageOptions
      ),
    showAllLanguageOptions
  );

  if (!user || !showLanguageSelector(currentPath)) return null;

  const amountOfSupportedLanguages = allSupportedLanguages.length;

  const allLanguagesAndFlagsUserIsLearning = user?.learnedLanguages || [];

  const amountOfLanguagesUserLearns = Object.keys(
    allLanguagesAndFlagsUserIsLearning
  ).length;

  const allLanguageAndFlagExceptActive =
    allLanguagesAndFlagsUserIsLearning.filter(
      (lang) => lang.code !== activeLanguage?.code
    );

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="z-50 hidden tablet:block"
    >
      <Flag
        code={activeLanguage?.flag}
        onClick={() =>
          setShowAllLanguageOptions(
            (showAllLanguageOptions) => !showAllLanguageOptions
          )
        }
        className={`size-[75px] rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110`}
      />

      {showAllLanguageOptions && (
        <div className={`absolute mt-4 grid animate-from-here gap-4`}>
          {allLanguageAndFlagExceptActive.map((lang) => {
            if (!lang) return;
            return (
              <LanguageSelectorLink
                setShowAllLanguageOptions={setShowAllLanguageOptions}
                language={lang}
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
