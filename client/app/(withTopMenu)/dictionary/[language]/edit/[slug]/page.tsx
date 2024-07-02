import EditItem from "@/components/Dictionary/EditItem";
import { getItemBySlug } from "@/lib/fetchData";
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
  const item = await getItemBySlug(
    language as SupportedLanguage,
    slug,
    userLanguages
  );

  return item ? <EditItem item={item} /> : null;
}
