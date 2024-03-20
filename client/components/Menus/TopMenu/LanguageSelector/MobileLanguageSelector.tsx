"use client";

import Flag from "react-world-flags";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { SupportedLanguage, User } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";

interface MobileLanguageSelectorProps {
  user: User;
  setCurrentlyActiveLanguage: Function;
}

export default function MobileLanguageSelector({
  user,
  setCurrentlyActiveLanguage,
}: MobileLanguageSelectorProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const currentPath = usePathname();
  const languagesAndFlags: { name: SupportedLanguage; flagCode: string }[] = [];
  user.languages.map((lang) =>
    languagesAndFlags.push({
      name: lang.code,
      flagCode: lang.code === "EN" ? "GB" : lang.code,
    })
  );

  if (toggleMobileMenu)
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-8 pt-28">
        {languagesAndFlags.map((lang) => {
          return (
            <Link key={lang.flagCode} href={`${currentPath}?lang=${lang.name}`}>
              <Flag
                code={lang.flagCode}
                onClick={() => {
                  toggleMobileMenu();
                  setCurrentlyActiveLanguage(lang.name);
                }}
                className={`h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
              />
            </Link>
          );
        })}
        {user.languages.length < 6 && <AddNewLanguageOption />}
      </div>
    );
}
