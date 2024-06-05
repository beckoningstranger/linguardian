"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { DictionarySearchResult, SupportedLanguage } from "@/types";
import paths from "@/paths";

interface SearchBoxProps {
  language: SupportedLanguage;
  findItems: Function;
  languageName: string;
  searchResults: DictionarySearchResult[];
  setSearchResults: Function;
}
export default function SearchBox({
  language,
  findItems,
  languageName,
  searchResults,
  setSearchResults,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);

  const NO_OF_RESULTS_SHOWN_IN_SEARCHBOX = 5;

  useEffect(() => {
    if (query.length < 2 || debouncedQuery.length < 2) setSearchResults([]);

    if (debouncedQuery.length > 1) {
      const controller = new AbortController();
      (async () => {
        const response: DictionarySearchResult[] = await findItems(
          language,
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
  }, [debouncedQuery, language, findItems, query, setSearchResults]);

  const handleChange = (result: DictionarySearchResult | "showAll") => {
    if (!result) return;
    if (result === "showAll") return null;
    if (typeof result === "object")
      router.push(paths.dictionaryItemPath(language, result.slug));
  };

  return (
    <div className="m-1 flex justify-stretch rounded-md border-2 border-slate-200">
      <div className="relative flex w-full flex-col justify-stretch rounded-md px-2">
        <Combobox onChange={handleChange}>
          <ComboboxInput
            placeholder={`Search our ${languageName} dictionary`}
            className="flex h-20 w-full rounded px-6 text-xl outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute right-1 flex h-20 items-center px-6 text-sm text-slate-300">
            {searchResults.length && searchResults.length > 0 ? (
              <div>
                {`showing ${
                  searchResults.length < NO_OF_RESULTS_SHOWN_IN_SEARCHBOX
                    ? searchResults.length
                    : NO_OF_RESULTS_SHOWN_IN_SEARCHBOX
                } of ${searchResults.length} results`}
              </div>
            ) : (
              <div>{debouncedQuery.length > 1 ? "No results" : ""}</div>
            )}
          </span>
          <ComboboxOptions className="flex flex-col gap-1 bg-white">
            <ComboboxOption value="showall">
              {({ focus }) => (
                <div
                  className={`px-6 mb-2 flex justify-center flex-col truncate h-20 text-xl border rounded-md border-slate-200 ${
                    focus ? "bg-slate-100" : ""
                  }`}
                >
                  Show all results
                </div>
              )}
            </ComboboxOption>
            {searchResults
              .slice(0, NO_OF_RESULTS_SHOWN_IN_SEARCHBOX)
              .map((result) => (
                <ComboboxOption key={result.slug} value={result}>
                  {({ focus }) => (
                    <div
                      className={`px-6 mb-2 flex justify-center flex-col truncate h-20 text-xl border rounded-md border-slate-200 ${
                        focus ? "bg-slate-100" : ""
                      }`}
                    >
                      <div>{result.name} </div>
                      <div className="text-sm text-slate-300">
                        {result.IPA && result.IPA.length > 0
                          ? `/${result.IPA}/`
                          : null}
                      </div>
                      <div className="text-sm">{result.partOfSpeech}</div>
                    </div>
                  )}
                </ComboboxOption>
              ))}
          </ComboboxOptions>
        </Combobox>
      </div>
    </div>
  );
}
