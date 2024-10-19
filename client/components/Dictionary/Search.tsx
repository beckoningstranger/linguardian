"use client";

import {
  DictionarySearchResult,
  LanguageWithFlagAndName,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import RecentSearches from "./RecentSearches";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";
import Button from "../ui/Button";

interface SearchProps {
  searchLanguages: LanguageWithFlagAndName[];
  mode:
    | "searchResultIsLinkToItemPage"
    | "searchResultIsTranslation"
    | "searchResultWillBeAddedToList";
  doAfterClickOnSearchResult?: Function;
  recentSearches?: DictionarySearchResult[];
  listData?: ListAndUnitData;
}
export default function Search({
  searchLanguages,
  mode,
  doAfterClickOnSearchResult,
  recentSearches = [],
  listData,
}: SearchProps) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [searchResults, setSearchResults] = useState<DictionarySearchResult[]>(
    []
  );
  useState(false);

  const getFlagCode = (langCode: SupportedLanguage) => {
    return searchLanguages.reduce((a, curr) => {
      if (curr.code === langCode) a = curr.flag;
      return a;
    }, "" as string);
  };

  return (
    <div className="mx-1 grid gap-y-1">
      <SearchBox
        query={query}
        debouncedQuery={debouncedQuery}
        setQuery={setQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchLanguages={searchLanguages}
        getFlagCode={getFlagCode}
      />
      {searchResults && searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          getFlagCode={getFlagCode}
          doAfterClickOnSearchResult={doAfterClickOnSearchResult}
          mode={mode}
        />
      )}
      {recentSearches.length > 0 &&
        mode === "searchResultIsLinkToItemPage" &&
        query.length === 0 && (
          <RecentSearches
            recentSearches={recentSearches}
            getFlagCode={getFlagCode}
          />
        )}
      {searchResults.length === 0 &&
        debouncedQuery.length > 0 &&
        mode !== "searchResultIsTranslation" && (
          <Button intent="primary" className="p-3">
            <Link
              href={
                listData
                  ? `/dictionary/new/${listData?.listNumber}/${listData?.unitName}?initialName=${query}`
                  : `/dictionary/new?initialName=${query}`
              }
            >
              Add a new item
            </Link>
          </Button>
        )}
    </div>
  );
}
