import Link from "next/link";
import { DictionarySearchResult, SupportedLanguage } from "@/types";
import paths from "@/paths";

interface SearchResultsProps {
  results: DictionarySearchResult[];
  language: SupportedLanguage;
}

export default function SearchResults({
  results,
  language,
}: SearchResultsProps) {
  return (
    <div className="mx-1 mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {results.map((result) => (
        <Link
          href={paths.dictionaryItemPath(language, result.slug)}
          key={result.slug}
          className="flex flex-col gap-1 bg-white"
        >
          <div
            className={`mb-2 flex h-20 flex-col justify-center truncate rounded-md border border-slate-200 px-6 text-xl`}
          >
            <div>{result.name} </div>
            <div className="text-sm text-slate-300">
              {result.IPA && result.IPA.length > 0 ? `/${result.IPA}/` : null}
            </div>
            <div className="text-sm">{result.definition}</div>
            <div className="text-sm">{result.partOfSpeech}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
