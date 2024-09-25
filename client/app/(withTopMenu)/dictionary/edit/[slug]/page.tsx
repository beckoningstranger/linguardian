import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import {
  getLanguageFeaturesForLanguage,
  getPopulatedItemBySlug,
} from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
} from "@/lib/helperFunctions";
import { LanguageFeatures } from "@/lib/types";

interface EditPageProps {
  params: { slug: string };
  searchParams: { comingFrom: string };
}

export async function generateMetadata({ params: { slug } }: EditPageProps) {
  const item = await getPopulatedItemBySlug(slug);
  return { title: `Edit ${item?.name}` };
}

export default async function EditPage({ params: { slug } }: EditPageProps) {
  const [allUserLanguages, seperatedUserLanguagesWithFlags] = await Promise.all(
    [getAllUserLanguages(), getSeperatedUserLanguagesWithFlags()]
  );

  const languageFeaturesForUserLanguagesPromises = allUserLanguages.map(
    (lang) => getLanguageFeaturesForLanguage(lang)
  );

  const languageFeaturesForUserLanguages = (
    await Promise.all(languageFeaturesForUserLanguagesPromises)
  ).filter((features): features is LanguageFeatures => features !== undefined);

  const [item] = await Promise.all([
    getPopulatedItemBySlug(slug, allUserLanguages),
  ]);

  if (!item) throw new Error("Could not get data from server");

  return (
    <EditOrCreateItem
      item={item}
      languageFeaturesForUserLanguages={languageFeaturesForUserLanguages}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
    />
  );
}
