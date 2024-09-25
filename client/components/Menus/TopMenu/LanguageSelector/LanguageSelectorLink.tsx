import { SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import Flag from "react-world-flags";

interface LanguageSelectorLinkProps {
  setShowAllLanguageOptions: Function;
  showAllLanguageOptions: boolean;
  flag: string;
  language: SupportedLanguage;
  currentPath: string;
  setCurrentlyActiveLanguage: Function;
}

export default function LanguageSelectorLink({
  setShowAllLanguageOptions,
  showAllLanguageOptions,
  flag,
  language,
  currentPath,
  setCurrentlyActiveLanguage,
}: LanguageSelectorLinkProps) {
  return (
    <Link
      href={calculateNewPath(language, currentPath)}
      onClick={() => {
        setShowAllLanguageOptions(false);
        setCurrentlyActiveLanguage(language);
      }}
    >
      <Flag
        code={flag}
        className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
          showAllLanguageOptions &&
          "scale-100 h-12 my-2 md:border border-slate-300"
        }
`}
      />
    </Link>
  );
}

export function calculateNewPath(language: SupportedLanguage, oldPath: string) {
  return "/" + language + "/" + oldPath.split("/").slice(2).join("/");
}
