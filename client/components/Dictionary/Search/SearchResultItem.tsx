import { Item } from "@/lib/contracts";
import Flag from "react-world-flags";

interface SearchResultItemProps {
  result: Item;
}

export default function SearchResultItem({ result }: SearchResultItemProps) {
  const { name, partOfSpeech, IPA, gender, definition, flagCode } = result;

  return (
    <div
      className="rounded-md bg-white/90 px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
      id={"SearchResult-" + name + "-" + partOfSpeech}
    >
      <div className="relative flex w-full justify-between gap-1">
        <div className="grid gap-1">
          <p className="font-serif text-hmd leading-tight">{name}</p>
          {IPA && (
            <p className="font-IPA text-cmdr text-grey-700">
              {IPA.length > 0 ? `/${IPA.join("/ /")}/` : null}
            </p>
          )}
          <p className="text-cmdr">
            {gender} {partOfSpeech}
          </p>
        </div>
        <Flag code={flagCode} className="size-16 rounded-full object-cover" />
      </div>
      <p>{definition}</p>
    </div>
  );
}
