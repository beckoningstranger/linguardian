import { SupportedLanguage } from "@/types";
import ItemPageField from "./ItemPageField";
import Link from "next/link";
import ItemPageContainer from "./ItemPageContainer";
import paths from "@/paths";

interface ItemPageDEFTRProps {
  definition?: string;
  translations?: {
    name: string;
    slug: string;
    language: SupportedLanguage;
    ipa?: string[];
  }[];
}

export default function ItemPageDEFTRCO({
  definition,
  translations,
}: ItemPageDEFTRProps) {
  const renderedDefinition = <div className="ml-2">{definition}</div>;

  const renderedTranslations = translations?.map((translation) => (
    <Link
      href={paths.dictionaryItemPath(translation.language, translation.slug)}
      key={translation.slug}
    >
      <div className="ml-2 hover:underline">{translation.name}</div>
    </Link>
  ));

  return (
    <ItemPageContainer>
      <div className="ml-8 gap-y-2">
        {definition && definition.length > 0 && (
          <ItemPageField type="Definition" content={renderedDefinition} />
        )}
        {translations && translations?.length > 0 && renderedTranslations && (
          <ItemPageField
            type={`Translations (${translations[0].language})`}
            content={renderedTranslations}
          />
        )}
      </div>
    </ItemPageContainer>
  );
}
