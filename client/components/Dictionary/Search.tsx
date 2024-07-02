"use client";

import { useState } from "react";
import {
  DictionarySearchResult,
  LanguageWithFlag,
  SupportedLanguage,
} from "@/lib/types";
import SearchResults from "./SearchResults";
import { findItems } from "@/lib/actions";
import SearchBox from "./SearchBox";

interface SearchProps {
  userLanguagesWithFlags: LanguageWithFlag[];
}
export default function Search({ userLanguagesWithFlags }: SearchProps) {
  const [searchResults, setSearchResults] = useState<DictionarySearchResult[]>(
    []
  );

  const getFlag = (langCode: SupportedLanguage) => {
    return userLanguagesWithFlags.reduce((a, curr) => {
      if (curr.name === langCode) a = curr.flag;
      return a;
    }, "" as string);
  };

  return (
    <div className="md:mx-12">
      <SearchBox
        findItems={findItems}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        userLanguagesWithFlags={userLanguagesWithFlags}
        getFlag={getFlag}
      />
      {searchResults && (
        <SearchResults results={searchResults} getFlag={getFlag} />
      )}
    </div>
  );
}
