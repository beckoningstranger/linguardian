"use client";

import { PartOfSpeech, SupportedLanguage } from "@/types";
import SearchBox from "./SearchBox";
import { useState } from "react";
import SearchResults from "./SearchResults";

interface SearchProps {
  validPassedLanguage: SupportedLanguage;
  findItems: Function;
  languageName: string;
}

export interface Result {
  name: string;
  slug: string;
  partOfSpeech: PartOfSpeech;
  IPA?: string;
}

export default function Search({
  validPassedLanguage,
  findItems,
  languageName,
}: SearchProps) {
  const [searchResults, setSearchResults] = useState<Result[]>([]);

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
