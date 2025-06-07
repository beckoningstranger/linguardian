"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import useUserOnClient from "@/lib/hooks/useUserOnClient";
import { siteSettings } from "@/lib/siteSettings";
import { MouseEventHandler } from "react";
import MobileMenu from "../../MobileMenu/MobileMenu";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { moreLanguagesToLearn } from "./LanguageSelector";
import { calculateNewPath } from "./LanguageSelectorLink";

export default function MobileLanguageSelector() {
  const { setActiveLanguage, activeLanguage } = useActiveLanguage();
  const { toggleMobileMenu } = useMobileMenu();
  const currentPath = usePathname();
  const amountOfSupportedLanguages = siteSettings.supportedLanguages.length;
  const { data, update } = useSession();
  const user = useUserOnClient();
  const currentBaseUrl = usePathname();

  if (!siteSettings.showLanguageSelectorOnlyOn.includes(currentBaseUrl))
    return null;

  if (toggleMobileMenu && user.learnedLanguages) {
    const amountOfLanguagesUserLearns = Object.keys(
      user.learnedLanguages
    ).length;
    return (
      <div id="MobileLanguageSelector">
        <Flag
          code={activeLanguage?.flag}
          className={
            "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 size-[64px] rounded-full border-2 border-slate-300 object-cover tablet:hidden"
          }
          onClick={toggleMobileMenu as MouseEventHandler}
        />
        <MobileMenu>
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
        </MobileMenu>
      </div>
    );
  }
}
