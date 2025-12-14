import SearchResults from "@/components/Dictionary/Search/SearchResults";
import { Item } from "@linguardian/shared/contracts";

interface RecentSearchesProps {
  recentSearches: Item[];
}

export default function RecentSearches({
  recentSearches,
}: RecentSearchesProps) {
  return (
    <>
      <div className="w-full bg-white/80 py-2 text-center font-semibold">
        Your most recently looked up items:
      </div>
      <SearchResults
        results={recentSearches}
        mode="searchResultIsLinkToItemPage"
      />
    </>
  );
}
