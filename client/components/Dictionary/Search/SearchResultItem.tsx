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
    <div className="relative flex min-h-[110px] w-full flex-col gap-1 rounded-md bg-white/90 px-6 py-4 transition-colors duration-500 hover:bg-white">
      <p className="max-w-[340px] font-serif text-hmd leading-tight">
        {result.name}
      </p>
      <p className="font-IPA text-cmdr text-grey-700">
        {result.IPA && result.IPA.length > 0
          ? `/${result.IPA.join("/ /")}/`
          : null}
      </p>
      <p className="text-cmdr">
        {result.gender} {result.partOfSpeech}
      </p>
      <Flag
        code={getFlagCode(result.language)}
        className="absolute right-2 top-4 size-16 rounded-full object-cover"
      />
      <p className="pt-2">{result.definition}</p>
    </div>
  );
}
