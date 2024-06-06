"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";

import AddNewLanguageOption from "./AddNewLanguageOption";
import { SupportedLanguage, User } from "@/types";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { moreLanguagesToLearn } from "./LanguageSelector";

interface MobileLanguageSelectorProps {
  user: User;
  setCurrentlyActiveLanguage: Function;
  allSupportedLanguages: SupportedLanguage[];
}

export default function MobileLanguageSelector({
  user,
  setCurrentlyActiveLanguage,
  allSupportedLanguages,
}: MobileLanguageSelectorProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const currentPath = usePathname();
  const languagesAndFlags: { name: SupportedLanguage; flagCode: string }[] = [];
  const amountOfSupportedLanguages = allSupportedLanguages.length;

  user.languages.map((lang) =>
    languagesAndFlags.push({
      name: lang.code,
      flagCode: lang.flag,
    })
  );

  if (toggleMobileMenu)
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-8">
        {languagesAndFlags.map((lang) => {
          return (
            <Link
              key={lang.flagCode}
              href={`/${lang.name}/${currentPath.split("/")[2]}`}
              onClick={() => {
                toggleMobileMenu();
                setCurrentlyActiveLanguage(lang.name);
              }}
            >
              <Flag
                code={lang.flagCode}
                className={`h-24 w-24 rounded-full object-cover shadow-lg transition-all hover:scale-125`}
              />
            </Link>
          );
        })}
        {user.languages.length < 6 &&
          moreLanguagesToLearn(user, amountOfSupportedLanguages) && (
            <AddNewLanguageOption />
          )}
      </div>
    );
}
