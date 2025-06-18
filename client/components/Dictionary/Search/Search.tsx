"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";

import Button from "@/components/ui/Button";
import paths from "@/lib/paths";
import {
  ItemFE,
  LanguageWithFlagAndName,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import RecentSearches from "./RecentSearches";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";

interface SearchProps {
  searchLanguages: LanguageWithFlagAndName[];
  mode:
    | "searchResultIsLinkToItemPage"
    | "searchResultIsTranslation"
    | "searchResultWillBeAddedToList";
  doAfterClickOnSearchResult?: Function;
  recentSearches?: ItemFE[];
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
  const [searchResults, setSearchResults] = useState<ItemFE[]>([]);

  const getFlagCode = (langCode: SupportedLanguage) => {
    return searchLanguages.reduce((a, curr) => {
      if (curr.code === langCode) a = curr.flag;
      return a;
    }, "" as string);
  };

  return (
    <div id="Search">
      <SearchBox
        query={query}
        debouncedQuery={debouncedQuery}
        setQuery={setQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchLanguages={searchLanguages}
        getFlagCode={getFlagCode}
      />
      {searchResults?.length > 0 && (
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
          <Button
            intent="primary"
            className="left-2 top-2 w-[calc(100vw-24px)] rounded-md py-4"
          >
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
      {searchResults?.length > 0 && (
        <Link href={paths.addItemToDictionaryPath()}>
          <Button intent="bottomRightButton">
            <FaPlus className="h-8 w-8 font-semibold text-white" />
          </Button>
        </Link>
      )}
    </div>
  );
}
