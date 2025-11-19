import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { ItemWithPopulatedTranslations } from "@/lib/contracts";
import { getUserOnServer } from "@/lib/utils";

interface NewItemPageProps {
  searchParams: {
    initialName: string;
    addToList: string;
    addToUnit: string;
    unitName: string;
    language: string;
  };
}

export default async function NewItemPage({
  searchParams: { initialName },
}: NewItemPageProps) {
  const user = await getUserOnServer();
  if (!user) throw new Error("Could not get user");

  const item: ItemWithPopulatedTranslations = {
    id: "newItem",
    name: initialName || "Change me",
    normalizedName: "",
    language: user.native.code,
    partOfSpeech: "noun",
    slug: "",
    translations: {},
    context: [],
    flagCode: user.native.flag,
    languageName: user.native.name,
  };

  return <EditOrCreateItem item={item} />;
}
