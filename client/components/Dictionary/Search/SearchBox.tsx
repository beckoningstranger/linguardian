"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import SearchInput from "@/components/Forms/SearchInput";
import { searchDictionaryAction } from "@/lib/actions/dictionary-actions";
import { Item, SupportedLanguage } from "@linguardian/shared/contracts";

interface SearchBoxProps {
  query: string;
  debouncedQuery: string;
  setQuery: Dispatch<SetStateAction<string>>;
  searchResults: Item[];
  searchLanguageCodes: SupportedLanguage[];
  setSearchResults: Function;
}

export default function SearchBox({
  query,
  debouncedQuery,
  setQuery,
  searchResults,
  setSearchResults,
  searchLanguageCodes,
}: SearchBoxProps) {
  useEffect(() => {
    if (debouncedQuery.length >= 2)
      (async () => {
        const foundItems = await searchDictionaryAction(
          searchLanguageCodes,
          debouncedQuery
        );

        const sortedResults = foundItems.sort((a, b) => {
          if (
            a.name.slice(0, query.length) === query &&
            b.name.slice(0, query.length) !== query
          )
            return -1;
          return 1;
        });
        setSearchResults(sortedResults);
      })();
    else setSearchResults([]);
  }, [debouncedQuery, query, setSearchResults, searchLanguageCodes]);

  return (
    <div
      className="flex justify-stretch bg-white/90 px-4 pb-2 pt-6"
      id="SearchBox"
    >
      <SearchInput
        label="Search all of your languages..."
        query={query}
        setQuery={setQuery}
        searchResultsNumber={searchResults.length}
      />
    </div>
  );
}
