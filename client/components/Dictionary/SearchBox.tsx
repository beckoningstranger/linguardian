"use client";

import { findItems } from "@/lib/actions";
import paths from "@/lib/paths";
import { DictionarySearchResult, LanguageWithFlagAndName } from "@/lib/types";
import { Combobox, ComboboxInput } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

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
  const router = useRouter();

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

  const handleChange = (result: DictionarySearchResult | "showAll") => {
    if (!result) return;
    if (result === "showAll") return null;
    if (typeof result === "object")
      router.push(paths.dictionaryItemPath(result.slug));
  };

  return (
    <div className="flex justify-stretch rounded-md border-2 border-slate-600">
      <div className="relative flex w-full flex-col justify-stretch rounded-md px-2">
        <Combobox onChange={handleChange}>
          <ComboboxInput
            placeholder={`Search all of your languages...`}
            className="flex h-20 w-full rounded px-6 text-xl outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute right-1 flex h-20 items-center px-6 text-sm text-slate-500">
            {searchResults.length && searchResults.length > 0 ? (
              <div>
                <span>{searchResults.length} results</span>
              </div>
            ) : (
              <div>{debouncedQuery.length > 1 ? "No results" : ""}</div>
            )}
          </span>
        </Combobox>
      </div>
    </div>
  );
}
