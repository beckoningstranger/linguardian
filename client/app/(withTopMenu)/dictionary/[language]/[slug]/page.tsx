import ItemPageBottomRightButton from "@/components/Dictionary/ItemPageBottomRightButton";
import ItemPageContainer from "@/components/Dictionary/ItemPageContainer";
import ItemPageDEFTRCO from "@/components/Dictionary/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPageMain";
import ItemBackButton from "@/components/Lists/ItemBackButton";
import {
  getAllSlugsForLanguage,
  getItemBySlug,
  getSupportedLanguages,
} from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctions";
import paths from "@/lib/paths";
import { SlugLanguageObject, SupportedLanguage } from "@/lib/types";

export const metadata = { title: "Dictionary" };

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
  searchParams: { comingFrom: string };
}

export default async function ItemPage({
  params: { slug, language },
  searchParams: { comingFrom },
}: ItemPageProps) {
  const userLanguages = await getAllUserLanguages();

  const item = await getItemBySlug(
    language as SupportedLanguage,
    slug,
    userLanguages
  );
  if (!item) return <div>No item found</div>;

  console.log(comingFrom);

  return (
    <ItemPageContainer>
      <ItemBackButton path={comingFrom} />
      <ItemPageMain
        itemName={item.name}
        partOfSpeech={item.partOfSpeech}
        gender={item.gender}
        case={item.case}
        IPA={item.IPA}
        pluralForm={item.pluralForm}
        tags={item.tags}
      />
      <ItemPageDEFTRCO
        definition={item.definition}
        translations={item.translations}
      />
      <ItemPageBottomRightButton
        path={paths.editDictionaryItemPath(item.language, item.slug)}
      />
    </ItemPageContainer>
  );
}
