"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";

import AddNewLanguageOption from "@/components/Menus/TopMenu/LanguageSelector/AddNewLanguageOption";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUser } from "@/context/UserContext";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { moreLanguagesToLearn, showLanguageSelector } from "@/lib/utils";

export default function MobileLanguageSelector() {
  const amountOfSupportedLanguages = allSupportedLanguages.length;

  const currentPath = usePathname();
  const { setActiveLanguage, activeLanguage, user } = useUser();
  const { openMobileMenu, closeMobileMenu } = useMobileMenu();

  if (!showLanguageSelector(currentPath) || !user?.learnedLanguages)
    return null;

  const amountOfLanguagesUserLearns = user.learnedLanguages.length;

  return (
    <div id="MobileLanguageSelector">
      <Flag
        code={activeLanguage?.flag}
        className={
          "absolute left-1/2 -translate-x-1/2 top-6 size-[64px] rounded-full border-2 border-slate-300 object-cover tablet:hidden"
        }
        onClick={() =>
          openMobileMenu(
            <div className="mx-8 grid grid-cols-2 grid-rows-3 gap-8">
              {user.learnedLanguages.map((lang) => {
                const newPath = currentPath.slice(0, -2) + lang.code;
                return (
                  <Link
                    key={lang.flag}
                    href={newPath}
                    onClick={() => {
                      setActiveLanguage(lang);
                      closeMobileMenu();
                    }}
                    className="flex justify-center"
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
          )
        }
      />
    </div>
  );
}
