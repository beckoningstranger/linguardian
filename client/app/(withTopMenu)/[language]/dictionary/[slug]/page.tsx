import {
  getAllSlugsForLanguage,
  getSupportedLanguages,
  lookUpItemBySlug,
} from "@/app/actions";
import ItemPageDEFTRCO from "@/components/Dictionary/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPageMain";
import ItemPageTopIcons from "@/components/Dictionary/ItemPageTopIcons";
import ListContainer from "@/components/Lists/ListContainer";
import { getUserLanguagesWithFlags } from "@/lib/getAllUserLanguages";
import { SupportedLanguage } from "@/types";

interface SlugLanguageObject {
  language: string;
  slug: string;
}

export async function generateStaticParams() {
  const supportedLanguages = await getSupportedLanguages();
  let allSlugs: SlugLanguageObject[] = [];
  const promises = supportedLanguages?.map((lang: SupportedLanguage) =>
    getAllSlugsForLanguage(lang)
  );

  if (promises) {
    const resolvedPromises = await Promise.all(promises);
    if (resolvedPromises)
      resolvedPromises.forEach((language) =>
        language?.forEach((item) => {
          allSlugs.push(item);
        })
      );

    return allSlugs;
  } else {
    return [];
  }
}

interface ItemPageProps {
  params: SlugLanguageObject;
}

export default async function ItemPage({
  params: { slug, language },
}: ItemPageProps) {
  const userLanguagesWithFlags = await getUserLanguagesWithFlags();

  const item = await lookUpItemBySlug(
    language as SupportedLanguage,
    slug,
    userLanguagesWithFlags.map((lwf) => lwf.name)
  );
  if (!item) return <div>No item found</div>;

  return (
    <ListContainer>
      <ItemPageTopIcons language={item.language} />
      <ItemPageMain
        itemName={item.name}
        partOfSpeech={item.partOfSpeech}
        gender={item.gender}
        case={item.case}
        ipa={item.IPA}
        pluralForm={item.pluralForm}
      />
      <ItemPageDEFTRCO
        definition={item.definition}
        translations={item.translations}
      />
    </ListContainer>
  );
}
