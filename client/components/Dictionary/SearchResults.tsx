"use client";

import { updateRecentDictionarySearches } from "@/lib/actions";
import paths from "@/lib/paths";
import { DictionarySearchResult } from "@/lib/types";
import Link from "next/link";
import SearchResultItem from "./SearchResultItem";
import Masonry from "react-responsive-masonry";

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
    <Masonry columnsCount={3} gutter="8px" sequential>
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
  );
}
