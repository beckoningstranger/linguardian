import { lookUpItemBySlug } from "@/lib/fetchData";
import { SlugLanguageObject, SupportedLanguage } from "@/types";

interface EditPageProps {
  params: SlugLanguageObject;
}

export async function generateMetadata({
  params: { slug, language },
}: EditPageProps) {
  const item = await lookUpItemBySlug(language as SupportedLanguage, slug);
  return { title: `Edit ${item?.name}` };
}

export default function EditPage({
  params: { slug, language },
}: EditPageProps) {
  return <div>Edit</div>;
}
