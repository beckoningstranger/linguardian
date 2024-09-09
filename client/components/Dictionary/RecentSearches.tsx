import { DictionarySearchResult } from "@/lib/types";
import SearchResults from "./SearchResults";

interface RecentSearchesProps {
  recentSearches: DictionarySearchResult[];
  getFlagCode: Function;
}

export default function RecentSearches({
  recentSearches,
  getFlagCode,
}: RecentSearchesProps) {
  return (
    <div className="mx-1">
      <div className="font-semibold">Your recent items:</div>
      <SearchResults
        results={recentSearches}
        getFlagCode={getFlagCode}
        mode="searchResultIsLinkToItemPage"
      />
    </div>
  );
}
