import Link from "next/link";

import { SupportedLanguage } from "@/types";

interface TopMiddleNavigationProps {
  language: SupportedLanguage;
}

export default function TopMiddleNavigation({
  language,
}: TopMiddleNavigationProps) {
  return (
    <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
      <Link
        href={`/lists?lang=${language}`}
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Lists
      </Link>
      <Link
        href={`/dictionary?lang=${language}`}
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Dictionary
      </Link>
      <Link
        href="/social"
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Social
      </Link>
    </div>
  );
}
