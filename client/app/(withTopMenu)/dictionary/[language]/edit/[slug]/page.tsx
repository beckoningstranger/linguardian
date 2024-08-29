import EditItem from "@/components/Dictionary/EditItem";
import { getRecentDictionarySearches } from "@/lib/actions";
import { getItemBySlug, getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
} from "@/lib/helperFunctions";
import { SlugLanguageObject, SupportedLanguage } from "@/lib/types";

interface EditPageProps {
  params: SlugLanguageObject;
}

export async function generateMetadata({
  params: { slug, language },
}: EditPageProps) {
  const item = await getItemBySlug(language as SupportedLanguage, slug);
  return { title: `Edit ${item?.name}` };
}

export default async function EditPage({
  params: { slug, language },
}: EditPageProps) {
  const [allUserLanguages, seperatedUserLanguagesWithFlags, recentSearches] =
    await Promise.all([
      getAllUserLanguages(),
      getSeperatedUserLanguagesWithFlags(),
      getRecentDictionarySearches(),
    ]);

  const [item, languageFeatures] = await Promise.all([
    getItemBySlug(language as SupportedLanguage, slug, allUserLanguages),
    getLanguageFeaturesForLanguage(language as SupportedLanguage),
  ]);
  if (!item || !languageFeatures)
    throw new Error("Could not get data from server");

  return (
    <EditItem
      item={item}
      languageFeatures={languageFeatures}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
      recentSearches={recentSearches}
    />
  );
}
