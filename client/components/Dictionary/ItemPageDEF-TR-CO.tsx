import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { Item, SupportedLanguage } from "@/lib/types";
import Link from "next/link";
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

  const foundTranslations: Item[] = [];
  allUserLanguages.forEach((lang) => {
    if (!translations || !translations[lang.code]) return;

    translations[lang.code]?.forEach((item) => {
      foundTranslations.push(item);
    });
  });
  foundTranslations.sort((a, b) => a.language.localeCompare(b.language));
  const languagesWithTranslations: SupportedLanguage[] =
    foundTranslations.reduce((a, curr) => {
      if (!a.includes(curr.language)) a.push(curr.language);
      return a;
    }, [] as SupportedLanguage[]);

  const translationItemArrays: JSX.Element[][] = [];

  languagesWithTranslations.forEach(async (lang) => {
    const translationsInThisLanguage = foundTranslations.filter(
      (translation) => translation.language === lang
    );
    const itemsForThisLanguage = translationsInThisLanguage.map(
      (translation) => (
        <Link
          href={paths.dictionaryItemPath(translation.slug)}
          key={translation.slug}
          className="hover:underline"
        >
          {translation.name}
        </Link>
      )
    );
    translationItemArrays.push(itemsForThisLanguage);
  });

  return (
    <div className="ml-2 flex flex-col gap-y-2 sm:ml-8">
      {definition && definition.length > 0 && (
        <ItemPageField type="Definition" content={renderedDefinition} />
      )}
      {translationItemArrays.map(async (lang, index) => {
        return (
          <ItemPageField
            key={index}
            type={
              `Translation (` +
              (await getLanguageName(
                translationItemArrays[index][0].props.href
                  .split("/")[2]
                  .slice(0, 2)
              )) +
              ")"
            }
            content={lang}
          />
        );
      })}
    </div>
  );
}

async function getLanguageName(langCode: string) {
  const langFeatures = await getLanguageFeaturesForLanguage(
    langCode as SupportedLanguage
  );
  return langFeatures?.langName;
}
