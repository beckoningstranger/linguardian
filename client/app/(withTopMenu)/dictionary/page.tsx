import Search from "@/components/Dictionary/Search";
import { getUserLanguagesWithFlags } from "@/lib/helperFunctions";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const userLanguagesWithFlags = await getUserLanguagesWithFlags();

  return <Search userLanguagesWithFlags={userLanguagesWithFlags} />;
}
