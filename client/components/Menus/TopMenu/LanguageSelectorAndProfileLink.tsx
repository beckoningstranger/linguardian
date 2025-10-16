"use client";

import { Button } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

import LanguageSelector from "@/components/Menus/TopMenu/LanguageSelector/LanguageSelector";
import MobileLanguageSelector from "@/components/Menus/TopMenu/LanguageSelector/MobileLanguageSelector";
import { useUser } from "@/context/UserContext";
import paths from "@/lib/paths";

export default function LanguageSelectorAndProfileLink() {
  const { user } = useUser();

  if (!user) return null;
  return (
    <div
      id="LanguageSelector|ProfileLink"
      className="flex gap-3 pr-1 tablet:px-3"
    >
      <MobileLanguageSelector />
      <LanguageSelector />
      <Link href={paths.profilePath(user.usernameSlug)}>
        {user.image ? (
          <Image
            src={user.image}
            width="75"
            height="75"
            alt="User profile image"
            className="size-[64px] rounded-full transition-transform hover:scale-110 tablet:size-[75px]"
            priority
          />
        ) : (
          <Button className="size-[64px] rounded-full bg-purple-500 text-c2xlb text-white drop-shadow-sm transition-transform hover:scale-110 hover:drop-shadow-md tablet:size-[75px]">
            {user.username[0].toLocaleUpperCase()}
          </Button>
        )}
      </Link>
    </div>
  );
}
