import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import {
  getLanguageFeaturesForLanguage,
  getPopulatedItemBySlug,
} from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
} from "@/lib/helperFunctions";
import {
  LanguageFeatures,
  SlugLanguageObject,
  SupportedLanguage,
} from "@/lib/types";

interface EditPageProps {
  params: SlugLanguageObject;
  searchParams: { comingFrom: string };
}

export async function generateMetadata({
  params: { slug, language },
}: EditPageProps) {
  const item = await getPopulatedItemBySlug(
    language as SupportedLanguage,
    slug
  );
  return { title: `Edit ${item?.name}` };
}

export default async function EditPage({
  params: { slug, language },
}: EditPageProps) {
  const [allUserLanguages, seperatedUserLanguagesWithFlags] = await Promise.all(
    [getAllUserLanguages(), getSeperatedUserLanguagesWithFlags()]
  );

  const languageFeaturesForUserLanguagesPromises = allUserLanguages.map(
    (lang) => getLanguageFeaturesForLanguage(lang)
  );

  const languageFeaturesForUserLanguages = (
    await Promise.all(languageFeaturesForUserLanguagesPromises)
  ).filter((features): features is LanguageFeatures => features !== undefined);

  const [item, languageFeatures] = await Promise.all([
    getPopulatedItemBySlug(
      language as SupportedLanguage,
      slug,
      allUserLanguages
    ),
    getLanguageFeaturesForLanguage(language as SupportedLanguage),
  ]);
  if (!item || !languageFeatures)
    throw new Error("Could not get data from server");

  return (
    <EditOrCreateItem
      item={item}
      languageFeaturesForUserLanguages={languageFeaturesForUserLanguages}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
    />
  );
}
