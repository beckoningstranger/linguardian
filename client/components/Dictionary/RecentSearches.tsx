import { DictionarySearchResult } from "@/lib/types";
import SearchResults from "./SearchResults";

interface RecentSearchesProps {
  recentSearches: DictionarySearchResult[];
  getFlag: Function;
}

export default function RecentSearches({
  recentSearches,
  getFlag,
}: RecentSearchesProps) {
  return (
    <div className="mx-1">
      <div className="font-semibold">Your recent items:</div>
      <SearchResults
        results={recentSearches}
        getFlag={getFlag}
        mode="returnLinkToItem"
      />
    </div>
  );
}
