"use client";

import { DictionarySearchResult, SupportedLanguage } from "@/types";
import SearchBox from "./SearchBox";
import { useState } from "react";
import SearchResults from "./SearchResults";
import { findItems } from "@/app/actions";

interface SearchProps {
  resultLanguages: SupportedLanguage[];
}

export default function Search({ resultLanguages }: SearchProps) {
  const [searchResults, setSearchResults] = useState<DictionarySearchResult[]>(
    []
  );

  return (
    <div className="md:mx-12">
      <SearchBox
        searchLanguages={resultLanguages}
        findItems={findItems}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      {searchResults && <SearchResults results={searchResults} />}
    </div>
  );
}
