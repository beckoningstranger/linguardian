import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { ItemWithPopulatedTranslations } from "@linguardian/shared/contracts";
import { getUserOnServer } from "@/lib/utils/server";

interface NewItemPageProps {
  searchParams: Promise<{
    initialName: string;
    addToList: string;
    addToUnit: string;
    unitName: string;
    language: string;
  }>;
}

export default async function NewItemPage(props: NewItemPageProps) {
  const searchParams = await props.searchParams;

  const {
    initialName
  } = searchParams;

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
