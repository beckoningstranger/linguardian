"use client";

import { Combobox, ComboboxInput } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { DictionarySearchResult, LanguageWithFlag } from "@/lib/types";
import paths from "@/lib/paths";

interface SearchBoxProps {
  findItems: Function;
  searchResults: DictionarySearchResult[];
  searchLanguagesWithFlags: LanguageWithFlag[];
  setSearchResults: Function;
  getFlag: Function;
}
export default function SearchBox({
  findItems,
  searchResults,
  setSearchResults,
  searchLanguagesWithFlags,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const searchLanguages = searchLanguagesWithFlags.map((item) => item.name);
    if (query.length < 2 || debouncedQuery.length < 2) setSearchResults([]);

    if (debouncedQuery.length > 1) {
      const controller = new AbortController();
      (async () => {
        const response: DictionarySearchResult[] = await findItems(
          searchLanguages,
          debouncedQuery
        );
        response.sort((a, b) => {
          if (
            a.name.slice(0, query.length) === query &&
            b.name.slice(0, query.length) !== query
          )
            return -1;
          return 1;
        });
        setSearchResults(response);
      })();
      return () => controller.abort();
    } else {
      setSearchResults([]);
    }
  }, [
    debouncedQuery,
    findItems,
    query,
    setSearchResults,
    searchLanguagesWithFlags,
  ]);

  const handleChange = (result: DictionarySearchResult | "showAll") => {
    if (!result) return;
    if (result === "showAll") return null;
    if (typeof result === "object")
      router.push(paths.dictionaryItemPath(result.language, result.slug));
  };

  return (
    <div className="m-1 flex justify-stretch rounded-md border-2 border-slate-600">
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
