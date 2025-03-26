"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import paths from "@/lib/paths";
import { SupportedLanguage, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useMobileMenu } from "../../../context/MobileMenuContext";
import MobileMenu from "../MobileMenu/MobileMenu";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";

interface LanguageSelectorAndProfileLinkProps {
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelectorAndProfileLink({
  allSupportedLanguages,
}: LanguageSelectorAndProfileLinkProps) {
  const { toggleMobileMenu } = useMobileMenu();
  const currentBaseUrl = usePathname();
  const { activeLanguage } = useActiveLanguage();
  const user = useSession().data?.user as User;

  const showLanguageSelectorOnlyOn: string[] = [];
  allSupportedLanguages.forEach((lang) => {
    ["dashboard", "dictionary", "lists", "lists/new"].forEach((entry) =>
      showLanguageSelectorOnlyOn.push("/" + lang + "/" + entry)
    );
  });

  if (activeLanguage)
    return (
      <>
        <div
          className={
            !showLanguageSelectorOnlyOn.includes(currentBaseUrl)
              ? "hidden"
              : undefined
          }
        >
          <Flag
            code={activeLanguage.flag}
            className={
              "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 phone:h-[75px] phone:w-[75px] w-16 h-16 rounded-full border-2 border-slate-300 object-cover tablet:hidden"
            }
            onClick={toggleMobileMenu as MouseEventHandler}
          />
          <MobileMenu fromDirection="animate-from-top">
            <MobileLanguageSelector
              allSupportedLanguages={allSupportedLanguages}
            />
          </MobileMenu>
        </div>
        <div className="flex items-center justify-evenly gap-4">
          <div
            className={`${
              !showLanguageSelectorOnlyOn.includes(currentBaseUrl) && "hidden"
            } z-50`}
          >
            <LanguageSelector
              activeLanguage={activeLanguage}
              allSupportedLanguages={allSupportedLanguages}
            />
          </div>
          <Link href={paths.profilePath(user.usernameSlug)}>
            {user?.image && (
              <>
                <Image
                  src={user.image}
                  alt="User profile image"
                  width={75}
                  height={75}
                  className="hidden rounded-full transition-transform hover:scale-110 phone:block"
                />
                <Image
                  src={user.image}
                  alt="User profile image"
                  width={64}
                  height={64}
                  className="rounded-full transition-transform hover:scale-110 phone:hidden"
                />
              </>
            )}
          </Link>
        </div>
      </>
    );
}
