"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";

import AddNewLanguageOption from "./AddNewLanguageOption";
import { SessionUser, SupportedLanguage, User } from "@/lib/types";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { moreLanguagesToLearn } from "./LanguageSelector";
import { useSession } from "next-auth/react";

interface MobileLanguageSelectorProps {
  setCurrentlyActiveLanguage: Function;
  allSupportedLanguages: SupportedLanguage[];
}

export default function MobileLanguageSelector({
  setCurrentlyActiveLanguage,
  allSupportedLanguages,
}: MobileLanguageSelectorProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const currentPath = usePathname();
  const amountOfSupportedLanguages = allSupportedLanguages.length;
  const sessionUser = useSession().data?.user as SessionUser;
  const languagesAndFlags: { name: SupportedLanguage; flag: string }[] =
    sessionUser.isLearning;
  const amountOfLanguagesUserLearns = Object.keys(languagesAndFlags).length;

  if (toggleMobileMenu)
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-8">
        {languagesAndFlags.map((lang) => {
          return (
            <Link
              key={lang.flag}
              href={`/${lang.name}/${currentPath.split("/")[2]}`}
              onClick={() => {
                toggleMobileMenu();
                setCurrentlyActiveLanguage(lang.name);
              }}
            >
              <Flag
                code={lang.flag}
                className={`h-24 w-24 rounded-full object-cover shadow-lg transition-all hover:scale-125`}
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
