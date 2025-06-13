"use client";

import { useState } from "react";

import SearchInput from "../../ui/SearchInput";

interface ListSearchProps {
  languageName?: string;
}

export default function ListSearch({ languageName }: ListSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full flex-col gap-2 bg-white/80 px-1 pb-2 pt-6 tablet:gap-4 tablet:px-4">
      <SearchInput
        label={`Search ${languageName} lists`}
        query={query}
        setQuery={setQuery}
      />
      <div className="grid h-10 place-items-center text-center font-serif text-hxs font-bold tablet:text-hsm tablet:font-semibold">
        Showing Most Popular Textbook Lists for Intermediates
      </div>
    </div>
  );
}
