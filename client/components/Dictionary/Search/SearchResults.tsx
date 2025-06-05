"use client";

import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import SearchResultItem from "./SearchResultItem";
import { updateRecentDictionarySearches } from "@/lib/actions";
import paths from "@/lib/paths";
import { DictionarySearchResult } from "@/lib/types";

interface SearchResultsProps {
  results: DictionarySearchResult[];
  getFlagCode: Function;
  mode:
    | "searchResultIsTranslation"
    | "searchResultIsLinkToItemPage"
    | "searchResultWillBeAddedToList";
  doAfterClickOnSearchResult?: Function;
}

export default function SearchResults({
  results,
  getFlagCode,
  mode,
  doAfterClickOnSearchResult,
}: SearchResultsProps) {
  return (
    <div
      className="w-full overflow-y-auto px-1 py-2 tablet:p-2 desktop:p-4"
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
                  await updateRecentDictionarySearches(result.slug)
                }
                className="w-full"
              >
                <SearchResultItem getFlagCode={getFlagCode} result={result} />
              </Link>
            ) : (
              <div
                key={result.slug}
                onClick={() => {
                  if (doAfterClickOnSearchResult)
                    doAfterClickOnSearchResult(result);
                }}
              >
                <SearchResultItem getFlagCode={getFlagCode} result={result} />
              </div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
