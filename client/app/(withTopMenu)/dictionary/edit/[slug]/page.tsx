import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getPopulatedItemBySlug } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguages,
} from "@/lib/helperFunctionsServer";
import { Metadata } from "next";

interface EditPageProps {
  params: { slug: string };
  searchParams: { comingFrom: string };
}

// export async function generateMetadata({ params: { slug } }: EditPageProps) {
//   const item = await getPopulatedItemBySlug(slug);
//   return { title: `Edit ${item?.name}` };
// }

export const metadata: Metadata = { title: "Edit an item" };

export default async function EditPage({ params: { slug } }: EditPageProps) {
  const [allUserLanguages, seperatedUserLanguages] = await Promise.all([
    getAllUserLanguages(),
    getSeperatedUserLanguages(),
  ]);

  const [item] = await Promise.all([
    getPopulatedItemBySlug(
      slug,
      allUserLanguages.map((lang) => lang.code)
    ),
  ]);

  return (
    <EditOrCreateItem
      item={item}
      seperatedUserLanguages={seperatedUserLanguages}
    />
  );
}
