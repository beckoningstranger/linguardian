"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  DictionarySearchResult,
  Item,
  LanguageWithFlag,
  SupportedLanguage,
} from "@/lib/types";
import SearchResults from "./SearchResults";
import { findItems } from "@/lib/actions";
import SearchBox from "./SearchBox";

interface SearchProps {
  searchLanguagesWithFlags: LanguageWithFlag[];
  mode: "returnLinkToItem" | "returnItem";
  addTranslation?: Function;
}
export default function Search({
  searchLanguagesWithFlags,
  mode,
  addTranslation,
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
          mode={mode}
          addTranslation={addTranslation}
        />
      )}
    </>
  );
}
