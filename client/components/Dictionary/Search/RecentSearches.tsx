import { ItemFE } from "@/lib/types";
import SearchResults from "./SearchResults";

interface RecentSearchesProps {
  recentSearches: ItemFE[];
  getFlagCode: Function;
}

export default function RecentSearches({
  recentSearches,
  getFlagCode,
}: RecentSearchesProps) {
  return (
    <>
      <div className="w-full bg-white/80 py-2 text-center font-semibold">
        Your most recently looked up items:
      </div>
      <SearchResults
        results={recentSearches}
        getFlagCode={getFlagCode}
        mode="searchResultIsLinkToItemPage"
      />
    </>
  );
}
