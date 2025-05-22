import Link from "next/link";

import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { Item, SupportedLanguage } from "@/lib/types";
import ItemPageField from "./ItemPageField";

interface ItemPageDEFTRProps {
  definition?: string[];
  translations?: Partial<Record<SupportedLanguage, Item[]>>;
}

export default async function ItemPageDEFTRCO({
  definition,
  translations,
}: ItemPageDEFTRProps) {
  const renderedDefinition = <div className="ml-2">{definition}</div>;
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

  return (
    <>
      <div className="ml-2 flex flex-col gap-y-2 sm:ml-8">
        {definition && definition.length > 0 && (
          <ItemPageField type="Definition" content={renderedDefinition} />
        )}
        {renderedTranslations}
      </div>
    </>
  );
}
