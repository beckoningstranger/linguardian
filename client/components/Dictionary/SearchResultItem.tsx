import { DictionarySearchResult } from "@/lib/types";
import Flag from "react-world-flags";

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
      className={`flex items-center gap-1 rounded-md border border-slate-200 px-2 py-2 text-xl`}
    >
      <Flag
        code={getFlagCode(result.language)}
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
