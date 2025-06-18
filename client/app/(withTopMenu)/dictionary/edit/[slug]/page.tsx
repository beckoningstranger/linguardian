import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getPopulatedItemBySlug } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguages,
} from "@/lib/helperFunctionsServer";
import { itemSchemaWithPopulatedTranslationsFE } from "@/lib/validations";
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

  // This is unnecessary. If we just send user id the backend can get this and send it to us, saving time
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

  const parsedItem = itemSchemaWithPopulatedTranslationsFE.parse(item);

  return (
    <EditOrCreateItem
      item={parsedItem}
      seperatedUserLanguages={seperatedUserLanguages}
      comingFrom={comingFrom}
    />
  );
}
