"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { User, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { moreLanguagesToLearn } from "./LanguageSelector";
import { calculateNewPath } from "./LanguageSelectorLink";

interface MobileLanguageSelectorProps {
  allSupportedLanguages: SupportedLanguage[];
}

export default function MobileLanguageSelector({
  allSupportedLanguages,
}: MobileLanguageSelectorProps) {
  const { setActiveLanguage } = useActiveLanguage();
  const { toggleMobileMenu } = useMobileMenu();
  const currentPath = usePathname();
  const amountOfSupportedLanguages = allSupportedLanguages.length;
  const { data, update } = useSession();
  const user = data?.user as User;

  if (toggleMobileMenu && user.learnedLanguages) {
    const amountOfLanguagesUserLearns = Object.keys(
      user.learnedLanguages
    ).length;
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-8">
        {user.learnedLanguages.map((lang) => {
          return (
            <Link
              key={lang.flag}
              href={calculateNewPath(lang.code, currentPath)}
              onClick={() => {
                toggleMobileMenu();
                setActiveLanguage(lang);
                update({
                  ...data,
                  user: {
                    ...user,
                    activeLanguageAndFlag: lang,
                  },
                });
              }}
            >
              <Flag
                code={lang.flag}
                className={`h-24 w-24 rounded-full object-cover shadow-lg transition-all hover:scale-110`}
              />
            </Link>
          );
        })}
        {amountOfLanguagesUserLearns < 6 &&
          moreLanguagesToLearn(
            amountOfLanguagesUserLearns,
            amountOfSupportedLanguages
          ) && <AddNewLanguageOption />}
      </div>
    );
  }
}
