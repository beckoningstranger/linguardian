import Flag from "react-world-flags";

import { DictionarySearchResult } from "@/lib/types";

interface SearchResultItemProps {
  getFlagCode: Function;
  result: DictionarySearchResult;
}

export default function SearchResultItem({
  getFlagCode,
  result,
}: SearchResultItemProps) {
  return (
    <div
      className="rounded-md bg-white/90 px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
      id={"SearchResult-" + result.name + "-" + result.partOfSpeech}
    >
      <div className="relative flex w-full justify-between gap-1">
        <div className="grid gap-1">
          <p className="font-serif text-hmd leading-tight">{result.name}</p>
          {result.IPA && (
            <p className="font-IPA text-cmdr text-grey-700">
              {result.IPA.length > 0 ? `/${result.IPA.join("/ /")}/` : null}
            </p>
          )}
          <p className="text-cmdr">
            {result.gender} {result.partOfSpeech}
          </p>
        </div>
        <Flag
          code={getFlagCode(result.language)}
          className="size-16 rounded-full object-cover"
        />
      </div>
      <p>{result.definition}</p>
    </div>
  );
}
