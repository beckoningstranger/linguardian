"use client";

import { useMobileMenu } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import Link from "next/link";
import { RxPlus } from "react-icons/rx";

export default function AddNewLanguageOption() {
  const { closeMobileMenu } = useMobileMenu();

  return (
    <div className="flex justify-center">
      <Link
        href={paths.learnNewLanguagePath()}
        className={`grid h-24 w-24 place-items-center rounded-full border border-grey-600 bg-white/80 transition-all hover:scale-110 md:h-[75px] md:w-[75px]`}
        onClick={closeMobileMenu}
      >
        <RxPlus className="text-5xl tablet:scale-150 tablet:text-2xl" />
      </Link>
    </div>
  );
}
