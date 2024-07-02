import Link from "next/link";

import { SupportedLanguage } from "@/lib/types";
import paths from "@/lib/paths";

interface TopMenuLogoProps {
  language: SupportedLanguage;
}
export default function TopMenuLogo({ language }: TopMenuLogoProps) {
  return (
    <Link
      href={paths.dashboardLanguagePath(language)}
      className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex"
    >
      Linguardian
    </Link>
  );
}
