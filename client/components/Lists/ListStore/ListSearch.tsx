"use client";

import { useState } from "react";

import SearchInput from "../../ui/SearchInput";

interface ListSearchProps {
  languageName?: string;
}

export default function ListSearch({ languageName }: ListSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 bg-white/80 px-1 py-2 tablet:px-4">
      <SearchInput
        label={`Search ${languageName} lists`}
        query={query}
        setQuery={setQuery}
      />
      <div className="text-center font-serif text-hsm font-semibold">
        Showing Most Popular Textbook Lists for Intermediates
      </div>
    </div>
  );
}
