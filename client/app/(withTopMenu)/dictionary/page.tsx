import Search from "@/components/Dictionary/Search";
import { getRecentDictionarySearches } from "@/lib/fetchData";
import { getAllUserLanguagesWithFlags } from "@/lib/helperFunctions";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const [userLanguagesWithFlags, recentSearches] = await Promise.all([
    getAllUserLanguagesWithFlags(),
    getRecentDictionarySearches(),
  ]);

  return (
    <div className="md:mx-12">
      <Search
        searchLanguagesWithFlags={userLanguagesWithFlags}
        mode="searchResultIsLinkToItemPage"
        recentSearches={recentSearches}
      />
    </div>
  );
}
