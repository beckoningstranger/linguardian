import EditItem from "@/components/Dictionary/EditItem";
import { getItemBySlug, getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import { getUserLanguagesWithFlags } from "@/lib/helperFunctions";
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
  const userLanguages = (await getUserLanguagesWithFlags()).map(
    (lang) => lang.name
  );
  const [item, languageFeatures] = await Promise.all([
    getItemBySlug(language as SupportedLanguage, slug, userLanguages),
    getLanguageFeaturesForLanguage(language as SupportedLanguage),
  ]);
  if (!item || !languageFeatures)
    throw new Error("Could not get data from server");

  return <EditItem item={item} languageFeatures={languageFeatures} />;
}
