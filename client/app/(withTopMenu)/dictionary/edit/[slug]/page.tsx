import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import {
  getAllLanguageFeatures,
  getPopulatedItemBySlug,
} from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguages,
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
  const [allUserLanguages, seperatedUserLanguages] = await Promise.all([
    getAllUserLanguages(),
    getSeperatedUserLanguages(),
  ]);

  const allLanguageFeatures = await getAllLanguageFeatures();
  if (!allLanguageFeatures) throw new Error("Could not get langauge features");

  const [item] = await Promise.all([
    getPopulatedItemBySlug(
      slug,
      allUserLanguages.map((lang) => lang.code)
    ),
  ]);

  if (!item) throw new Error("Could not get data from server");

  return (
    <EditOrCreateItem
      item={item}
      allLanguageFeatures={allLanguageFeatures}
      seperatedUserLanguages={seperatedUserLanguages}
    />
  );
}
