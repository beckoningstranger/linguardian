"use client";

import { updateRecentDictionarySearches } from "@/lib/actions";
import paths from "@/lib/paths";
import { DictionarySearchResult } from "@/lib/types";
import Link from "next/link";
import SearchResultItem from "./SearchResultItem";

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
    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {results.map((result) => {
        return result && mode === "searchResultIsLinkToItemPage" ? (
          <Link
            href={paths.dictionaryItemPath(result.slug)}
            key={result.slug}
            onClick={async () =>
              await updateRecentDictionarySearches(result.slug)
            }
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
    </div>
  );
}
