import { notFound } from "next/navigation";

import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { fetchItemBySlug } from "@/lib/api/item-api";
import { KeyboardContextProvider } from "@/context/KeyboardContext";

interface EditPageProps {
  params: Promise<{ itemSlug: string }>;
  searchParams: Promise<{ comingFrom: string }>;
}

export async function generateMetadata(props: EditPageProps) {
  const params = await props.params;

  const {
    itemSlug
  } = params;

  const response = await fetchItemBySlug({ itemSlug });

  if (!response.success) notFound();

  const item = response.data;
  return { title: `Edit ${item.name}` };
}

export default async function EditPage(props: EditPageProps) {
  const searchParams = await props.searchParams;

  const {
    comingFrom
  } = searchParams;

  const params = await props.params;

  const {
    itemSlug
  } = params;

  // This needs its own background picture. Instead of the hands just holding a book, it should be the same thing but writing in the book.

  const response = await fetchItemBySlug({ itemSlug });
  if (!response.success) notFound();

  const item = response.data;

  // Do not filter or translations may be lost!

  return (
    <KeyboardContextProvider>
      <EditOrCreateItem item={item} comingFrom={comingFrom} />
    </KeyboardContextProvider>
  );
}
