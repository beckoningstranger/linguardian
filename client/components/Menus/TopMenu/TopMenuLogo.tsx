import Link from "next/link";

import { SupportedLanguage } from "@/types";

interface TopMenuLogoProps {
  language: SupportedLanguage;
}
export default function TopMenuLogo({ language }: TopMenuLogoProps) {
  return (
    <Link
      href={`/app/dashboard?lang=${language}`}
      className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex"
    >
      Linguardian
    </Link>
  );
}
