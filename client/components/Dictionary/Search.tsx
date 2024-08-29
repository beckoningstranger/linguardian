"use client";

import { findItems } from "@/lib/actions";
import {
  DictionarySearchResult,
  LanguageWithFlag,
  SupportedLanguage,
} from "@/lib/types";
import { useState } from "react";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";
import RecentSearches from "./RecentSearches";

interface SearchProps {
  searchLanguagesWithFlags: LanguageWithFlag[];
  mode: "returnLinkToItem" | "returnItem";
  addTranslation?: Function;
  recentSearches?: DictionarySearchResult[];
}
export default function Search({
  searchLanguagesWithFlags,
  mode,
  addTranslation,
  recentSearches = [],
}: SearchProps) {
  const [searchResults, setSearchResults] = useState<DictionarySearchResult[]>(
    []
  );

  const getFlag = (langCode: SupportedLanguage) => {
    return searchLanguagesWithFlags.reduce((a, curr) => {
      if (curr.name === langCode) a = curr.flag;
      return a;
    }, "" as string);
  };

  return (
    <>
      <SearchBox
        findItems={findItems}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchLanguagesWithFlags={searchLanguagesWithFlags}
        getFlag={getFlag}
      />
      {searchResults && (
        <SearchResults
          results={searchResults}
          getFlag={getFlag}
          addTranslation={addTranslation}
          mode={mode}
        />
      )}
      {recentSearches.length > 0 &&
        searchResults.length === 0 &&
        mode === "returnLinkToItem" && (
          <RecentSearches recentSearches={recentSearches} getFlag={getFlag} />
        )}
    </>
  );
}
