import Link from "next/link";

import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import { Item, SupportedLanguage } from "@/lib/types";
import paths from "@/lib/paths";

interface ItemTranslationsProps {
  translations?: Partial<Record<SupportedLanguage, Item[]>>;
}

export default async function ItemTranslations({
  translations,
}: ItemTranslationsProps) {
  const allUserLanguages = await getAllUserLanguages();
  const foundTranslations: Partial<Record<string, Item[]>> = {};

  allUserLanguages.forEach((lang) => {
    if (!translations || !translations[lang.code]) return;

    translations[lang.code]?.forEach((item) => {
      if (!foundTranslations[item.languageName])
        foundTranslations[item.languageName] = [];
      foundTranslations[item.languageName]?.push(item);
    });
  });

  const renderedTranslations = Object.keys(foundTranslations).map(
    (languageName, index) => (
      <div key={index} className="text-gray-800">
        Translation {languageName}
        <div className="ml-4">
          {foundTranslations[languageName]?.map((item, index) => (
            <Link
              href={paths.dictionaryItemPath(item.slug)}
              key={item.normalizedName + index}
            >
              <div className="text-black hover:underline">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
    )
  );

  return <div>{renderedTranslations}</div>;
}
