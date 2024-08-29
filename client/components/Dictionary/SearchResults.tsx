"use client";

import { updateRecentDictionarySearches } from "@/lib/actions";
import paths from "@/lib/paths";
import { DictionarySearchResult } from "@/lib/types";
import Link from "next/link";
import Flag from "react-world-flags";

interface SearchResultsProps {
  results: DictionarySearchResult[];
  getFlag: Function;
  mode: "returnItem" | "returnLinkToItem";
  addTranslation?: Function;
}

export default function SearchResults({
  results,
  getFlag,
  mode,
  addTranslation,
}: SearchResultsProps) {
  return (
    <div className="mx-1 mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {results.map((result) =>
        mode === "returnLinkToItem" ? (
          <Link
            href={paths.dictionaryItemPath(result.language, result.slug)}
            key={result.slug}
            onClick={async () =>
              await updateRecentDictionarySearches(result.slug)
            }
          >
            <ItemElement getFlag={getFlag} result={result} />
          </Link>
        ) : (
          <div
            key={result.slug}
            onClick={() => (addTranslation ? addTranslation(result) : () => {})}
          >
            <ItemElement getFlag={getFlag} result={result} />
          </div>
        )
      )}
    </div>
  );
}

interface ItemElementProps {
  getFlag: Function;
  result: DictionarySearchResult;
}

function ItemElement({ getFlag, result }: ItemElementProps) {
  return (
    <div
      className={`flex items-center gap-1 truncate rounded-md border border-slate-200 px-2 py-2 text-xl`}
    >
      <Flag
        code={getFlag(result.language)}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="ml-2 flex flex-col gap-1">
        <div className="text-wrap text-sm">{result.name}</div>
        <div className="text-xs text-slate-300">
          {result.IPA && result.IPA.length > 0 ? `/${result.IPA}/` : null}
        </div>
        <div className="text-xs text-slate-700">{result.partOfSpeech}</div>
        <div className="text-wrap text-xs">{result.definition}</div>
      </div>
    </div>
  );
}
