"use client";

import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { SearchResultItem } from "@/components";
import { updateRecentSearchesAction } from "@/lib/actions/user-actions";
import { Item } from "@/lib/contracts";
import paths from "@/lib/paths";

interface SearchResultsProps {
  results: Item[];
  mode:
    | "searchResultIsTranslation"
    | "searchResultIsLinkToItemPage"
    | "searchResultWillBeAddedToList";
  doAfterClickOnSearchResult?: (item: Item) => void;
}

export default function SearchResults({
  results,
  mode,
  doAfterClickOnSearchResult,
}: SearchResultsProps) {
  return (
    <div
      className="w-full overflow-y-auto rounded-md px-1 py-2 drop-shadow-md tablet:p-2 desktop:p-4"
      id="SearchResults"
    >
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 744: 2, 1140: 3 }}>
        <Masonry gutter="8px" sequential>
          {results.map((result) => {
            return result && mode === "searchResultIsLinkToItemPage" ? (
              <Link
                href={paths.dictionaryItemPath(result.slug)}
                key={result.slug}
                onClick={async () =>
                  await updateRecentSearchesAction(result.id)
                }
                className="w-full"
              >
                <SearchResultItem result={result} />
              </Link>
            ) : (
              <div
                key={result.slug}
                onClick={() => {
                  if (doAfterClickOnSearchResult)
                    doAfterClickOnSearchResult(result);
                }}
                className="w-full"
              >
                <SearchResultItem result={result} />
              </div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
