import Search from "@/components/Dictionary/Search";
import { getRecentDictionarySearches } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const [allUserLanguages, recentSearches] = await Promise.all([
    getAllUserLanguages(),
    getRecentDictionarySearches(),
  ]);

  return (
    <>
      <Search
        searchLanguages={allUserLanguages}
        mode="searchResultIsLinkToItemPage"
        recentSearches={recentSearches}
      />
    </>
  );
}
