import {
  checkPassedLanguageAsync,
  getAllSlugsForLanguage,
  getSupportedLanguages,
  lookUpItemBySlug,
} from "@/app/actions";
import ItemPageDEFTRCO from "@/components/Dictionary/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPageMain";
import ItemPageTopIcons from "@/components/Dictionary/ItemPageTopIcons";
import ListContainer from "@/components/Lists/ListContainer";
import getUserOnServer from "@/lib/getUserOnServer";
import { ItemPopulatedWithTranslations, SupportedLanguage } from "@/types";

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
  // const sessionUser = await getServerSession();
  const sessionUser = await getUserOnServer();
  const userNative: SupportedLanguage = sessionUser.native.name;
  const passedLanguage = language?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  if (!validPassedLanguage)
    return <div>There is no dictionary for this language</div>;

  const item: ItemPopulatedWithTranslations = await lookUpItemBySlug(
    language as SupportedLanguage,
    slug,
    userNative
  );
  if (!item) return <div>No item found</div>;
  console.log("page.tsx /[slug]", item.translations[userNative]);

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
        translations={item.translations[userNative].map((translation) => ({
          name: translation.name,
          slug: translation.slug,
          language: translation.language,
          ipa: translation.IPA,
        }))}
      />
    </ListContainer>
  );
}
