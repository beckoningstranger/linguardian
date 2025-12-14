import Link from "next/link";
import Flag from "react-world-flags";

import ItemSection from "@/components/Dictionary/ItemPage/ItemSection";
import { Item, SupportedLanguage } from "@linguardian/shared/contracts";
import paths from "@/lib/paths";

interface ItemTranslationsProps {
  translations?: Partial<Record<SupportedLanguage, Item[]>>;
  allUserLanguageCodes: SupportedLanguage[];
  forItemPresentation?: boolean;
}

export default function ItemTranslations({
  translations,
  allUserLanguageCodes,
  forItemPresentation,
}: ItemTranslationsProps) {
  if (!translations) return null;

  return (
    <ItemSection title="Translations">
      {allUserLanguageCodes.map((lang) => (
        <div
          key={lang}
          className="grid grid-cols-1 gap-2 tablet:grid-cols-2 desktop:grid-cols-3"
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
