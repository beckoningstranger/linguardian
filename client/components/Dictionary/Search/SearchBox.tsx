"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { findItems } from "@/lib/actions";
import { DictionarySearchResult, LanguageWithFlagAndName } from "@/lib/types";
import SearchInput from "@/components/ui/SearchInput";

interface SearchBoxProps {
  query: string;
  debouncedQuery: string;
  setQuery: Dispatch<SetStateAction<string>>;
  searchResults: DictionarySearchResult[];
  searchLanguages: LanguageWithFlagAndName[];
  setSearchResults: Function;
  getFlagCode: Function;
}
export default function SearchBox({
  query,
  debouncedQuery,
  setQuery,
  searchResults,
  setSearchResults,
  searchLanguages,
}: SearchBoxProps) {
  useEffect(() => {
    if (query.length < 2 || debouncedQuery.length < 2) setSearchResults([]);

    if (debouncedQuery.length > 1) {
      const controller = new AbortController();
      (async () => {
        const response = await findItems(
          searchLanguages.map((lang) => lang.code),
          debouncedQuery
        );
        if (response) {
          response.sort((a, b) => {
            if (
              a.name.slice(0, query.length) === query &&
              b.name.slice(0, query.length) !== query
            )
              return -1;
            return 1;
          });
          setSearchResults(response);
        }
      })();
      return () => controller.abort();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, query, setSearchResults, searchLanguages]);

  return (
    <div className="relative flex justify-stretch bg-white/90 px-1 pt-4 tablet:px-4">
      <SearchInput
        label="Search all of your languages..."
        query={query}
        setQuery={setQuery}
      />

      <div className="absolute right-28 top-7 text-csmr text-slate-500">
        {searchResults.length && searchResults.length > 0 ? (
          <div>{searchResults.length} results</div>
        ) : (
          <div>{debouncedQuery.length > 1 ? "No results" : ""}</div>
        )}
      </div>
    </div>
  );
}
