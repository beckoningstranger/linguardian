import Link from "next/link";
import Flag from "react-world-flags";

import paths from "@/lib/paths";
import { siteSettings } from "@/lib/siteSettings";
import { Item, LanguageWithFlagAndName, SupportedLanguage } from "@/lib/types";
import ItemSection from "./ItemSection";

interface ItemTranslationsProps {
  translations?: Partial<Record<SupportedLanguage, Item[]>>;
  allUserLanguages: LanguageWithFlagAndName[];
  forItemPresentation?: boolean;
}

export default function ItemTranslations({
  translations,
  allUserLanguages,
  forItemPresentation,
}: ItemTranslationsProps) {
  if (!translations) return null;

  const displayedTranslationLanguages =
    allUserLanguages.map((lang) => lang.code) ||
    siteSettings.supportedLanguages;

  return (
    <ItemSection title="Translations">
      {displayedTranslationLanguages.map((lang) => (
        <div
          key={lang}
          className="grid grid-cols-1 gap-2 pt-2 tablet:grid-cols-2 desktop:grid-cols-3"
        >
          {translations[lang] &&
            translations[lang].map((translation) => (
              <Link
                target={forItemPresentation ? "_blank" : "_self"}
                rel={forItemPresentation ? "noopener noreferrer" : undefined}
                href={paths.dictionaryItemPath(translation.slug)}
                key={translation.slug}
                className="flex items-center gap-x-2 hover:underline"
              >
                <Flag
                  code={translation.flagCode}
                  className="size-10 rounded-full object-cover"
                />
                {translation.name}
              </Link>
            ))}
        </div>
      ))}
    </ItemSection>
  );
}
