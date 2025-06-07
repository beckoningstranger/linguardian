"use client";

import Image from "next/image";
import Link from "next/link";

import useUserOnClient from "@/lib/hooks/useUserOnClient";
import paths from "@/lib/paths";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";

export default function LanguageSelectorAndProfileLink() {
  const user = useUserOnClient();

  return (
    <div
      id="LanguageSelector|ProfileLink"
      className="flex gap-3 pr-1 tablet:px-3"
    >
      <MobileLanguageSelector />
      <LanguageSelector />
      <Link href={paths.profilePath(user.usernameSlug)}>
        {user?.image && (
          <Image
            src={user.image}
            width="75"
            height="75"
            alt="User profile image"
            className="size-[64px] rounded-full transition-transform hover:scale-110 tablet:size-[75px]"
            priority
          />
        )}
      </Link>
    </div>
  );
}
