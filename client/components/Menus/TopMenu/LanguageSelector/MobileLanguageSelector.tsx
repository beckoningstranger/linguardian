"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";

import { AddNewLanguageOption, MobileMenu } from "@/components";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUser } from "@/context/UserContext";
import paths from "@/lib/paths";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { moreLanguagesToLearn, showLanguageSelector } from "@/lib/utils";

export default function MobileLanguageSelector() {
  const amountOfSupportedLanguages = allSupportedLanguages.length;

  const currentPath = usePathname();
  const { setActiveLanguage, activeLanguage, user } = useUser();
  const { toggleMobileMenu } = useMobileMenu();

  if (
    !showLanguageSelector(currentPath) ||
    !user ||
    !user.learnedLanguages ||
    !toggleMobileMenu
  )
    return null;

  const amountOfLanguagesUserLearns = user.learnedLanguages.length;
  return (
    <div id="MobileLanguageSelector">
      <Flag
        code={activeLanguage?.flag}
        className={
          "absolute left-1/2 -translate-x-1/2 top-6 size-[64px] rounded-full border-2 border-slate-300 object-cover tablet:hidden"
        }
        onClick={toggleMobileMenu as MouseEventHandler}
      />
      <MobileMenu>
        <div className="grid grid-cols-2 grid-rows-3 gap-8">
          {user.learnedLanguages.map((lang) => {
            return (
              <Link
                key={lang.flag}
                href={paths.dashboardLanguagePath(lang.code)}
                onClick={() => {
                  toggleMobileMenu();
                  setActiveLanguage(lang);
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
      </MobileMenu>
    </div>
  );
}
