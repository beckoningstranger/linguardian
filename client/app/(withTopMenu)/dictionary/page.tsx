import Search from "@/components/Dictionary/Search";
import { getAllUserLanguagesWithFlags } from "@/lib/helperFunctions";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const userLanguagesWithFlags = await getAllUserLanguagesWithFlags();

  return (
    <div className="md:mx-12">
      <Search
        searchLanguagesWithFlags={userLanguagesWithFlags}
        mode="returnLinkToItem"
      />
    </div>
  );
}
