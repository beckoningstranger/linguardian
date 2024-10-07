import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import {
  getAllLanguageFeatures,
  getPopulatedItemBySlug,
} from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
} from "@/lib/helperFunctionsServer";

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

  const allLanguageFeatures = await getAllLanguageFeatures();
  if (!allLanguageFeatures) throw new Error("Could not get langauge features");

  const [item] = await Promise.all([
    getPopulatedItemBySlug(slug, allUserLanguages),
  ]);

  if (!item) throw new Error("Could not get data from server");

  return (
    <EditOrCreateItem
      item={item}
      allLanguageFeatures={allLanguageFeatures}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
    />
  );
}
