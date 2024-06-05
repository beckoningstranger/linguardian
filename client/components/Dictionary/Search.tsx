"use client";

import { DictionarySearchResult, SupportedLanguage } from "@/types";
import SearchBox from "./SearchBox";
import { useState } from "react";
import SearchResults from "./SearchResults";

interface SearchProps {
  validPassedLanguage: SupportedLanguage;
  findItems: Function;
  languageName: string;
}

export default function Search({
  validPassedLanguage,
  findItems,
  languageName,
}: SearchProps) {
  const [searchResults, setSearchResults] = useState<DictionarySearchResult[]>(
    []
  );

  return (
    <div className="md:mx-12">
      <SearchBox
        language={validPassedLanguage}
        findItems={findItems}
        languageName={languageName}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      {searchResults && (
        <SearchResults results={searchResults} language={validPassedLanguage} />
      )}
    </div>
  );
}
