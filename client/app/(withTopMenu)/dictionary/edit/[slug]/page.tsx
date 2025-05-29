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

export default async function EditPage({
  params: { slug },
  searchParams: { comingFrom },
}: EditPageProps) {
  // This needs its own background picture. Instead of the hands just holding a book, it should be the same thing but writing in the book.

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
      comingFrom={comingFrom}
    />
  );
}
