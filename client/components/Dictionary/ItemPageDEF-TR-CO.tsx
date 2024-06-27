import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import { getUserLanguagesWithFlags } from "@/lib/helperFunctions";
import paths from "@/paths";
import { ItemPopulatedWithTranslations, SupportedLanguage } from "@/types";
import Link from "next/link";
import ItemPageContainer from "./ItemPageContainer";
import ItemPageField from "./ItemPageField";

interface ItemPageDEFTRProps {
  definition?: string;
  translations?: Record<SupportedLanguage, ItemPopulatedWithTranslations[]>;
}

export default async function ItemPageDEFTRCO({
  definition,
  translations,
}: ItemPageDEFTRProps) {
  const renderedDefinition = <div className="ml-2">{definition}</div>;
  const allUserLanguages = (await getUserLanguagesWithFlags()).map(
    (lwf) => lwf.name
  );

  const foundTranslations: ItemPopulatedWithTranslations[] = [];
  allUserLanguages.forEach((lang) => {
    if (!translations || !translations[lang]) return;
    translations[lang].forEach((item) => {
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
          href={paths.dictionaryItemPath(
            translation.language,
            translation.slug
          )}
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
    <ItemPageContainer>
      <div className="ml-2 flex flex-col gap-y-2 sm:ml-8">
        {definition && definition.length > 0 && (
          <ItemPageField type="Definition" content={renderedDefinition} />
        )}
        {translationItemArrays.map(async (lang, index) => (
          <ItemPageField
            key={index}
            type={
              `Translation (` +
              (await getLanguageName(
                translationItemArrays[index][0].props.href.split("/")[2]
              )) +
              ")"
            }
            content={lang}
          />
        ))}
      </div>
    </ItemPageContainer>
  );
}

async function getLanguageName(langCode: string) {
  const langFeatures = await getLanguageFeaturesForLanguage(
    langCode as SupportedLanguage
  );
  return langFeatures?.langName;
}
