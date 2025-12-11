"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";

import RecentSearches from "@/components/Dictionary/Search/RecentSearches";
import SearchBox from "@/components/Dictionary/Search/SearchBox";
import SearchResults from "@/components/Dictionary/Search/SearchResults";
import Button from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import { Item, SupportedLanguage } from "@/lib/contracts";
import paths from "@/lib/paths";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { SearchMode } from "@/lib/types";

interface SearchProps {
  mode: SearchMode;
  doAfterClickOnSearchResult?: (item: Item) => void;
  recentSearches?: Item[];
  listNumber?: number;
  unitNumber?: number;
  unitName?: string;
  listLanguageCode?: SupportedLanguage;
  searchLanguageCodes?: SupportedLanguage[];
}
export default function Search({
  mode,
  doAfterClickOnSearchResult,
  recentSearches = [],
  listNumber,
  unitName,
  unitNumber,
  listLanguageCode,
  searchLanguageCodes,
}: SearchProps) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const { user } = useUser();

  if (
    mode === "searchResultWillBeAddedToList" &&
    (!listNumber || !unitName || !listLanguageCode)
  )
    throw new Error("Need listNumber, unitNumber and listLanguage!");

  const allUserLanguageCodes = useMemo(() => {
    return user
      ? [user.native.code, ...user.learnedLanguages.map((lang) => lang.code)]
      : allSupportedLanguages;
  }, [user]);

  const searchForTheseLanguages = searchLanguageCodes || allUserLanguageCodes;

  const memoizedLanguageCodes = useMemo(() => {
    return searchForTheseLanguages;
  }, [searchForTheseLanguages]);

  return (
    <div id="Search">
      <SearchBox
        query={query}
        debouncedQuery={debouncedQuery}
        setQuery={setQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchLanguageCodes={memoizedLanguageCodes}
      />
      {searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          doAfterClickOnSearchResult={doAfterClickOnSearchResult}
          mode={mode}
        />
      )}
      {recentSearches.length > 0 &&
        mode === "searchResultIsLinkToItemPage" &&
        query.length === 0 && (
          <RecentSearches recentSearches={recentSearches} />
        )}
      {searchResults.length === 0 &&
        debouncedQuery.length > 1 &&
        mode === "searchResultWillBeAddedToList" &&
        listNumber &&
        unitName &&
        listLanguageCode && (
          <Link
            href={paths.addItemToDictionaryPath(
              encodeURIComponent(debouncedQuery),
              listNumber,
              unitNumber,
              encodeURIComponent(unitName),
              listLanguageCode
            )}
          >
            <Button
              intent="primary"
              className="mt-4 flex h-16 w-full items-center justify-center gap-4 rounded-lg px-8 text-clgm text-white"
            >
              Add a new item
            </Button>
          </Link>
        )}
      {debouncedQuery.length >= 2 &&
        mode === "searchResultIsLinkToItemPage" && (
          <Link
            href={paths.addItemToDictionaryPath(
              encodeURIComponent(debouncedQuery)
            )}
            className="fixed bottom-4 w-full px-4"
          >
            <Button
              intent="primary"
              className="flex h-20 w-full items-center justify-between gap-4 rounded-lg px-8 text-clgm"
            >
              <FaPlus className="h-8 w-8 font-semibold text-white" />
              <span className="text-white">Add a new item</span>
              <div></div>
            </Button>
          </Link>
        )}
    </div>
  );
}
