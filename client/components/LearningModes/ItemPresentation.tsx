import { ItemToLearn, SupportedLanguage } from "@/lib/types";
import { Button } from "@headlessui/react";

interface ItemPresentationProps {
  item: ItemToLearn;
  endPresentation: Function;
  wrongSolution: string;
  userNative: SupportedLanguage;
}

export default function ItemPresentation({
  item,
  endPresentation,
  wrongSolution,
  userNative,
}: ItemPresentationProps) {
  return (
    <>
      <div className="flex flex-col gap-y-1.5 rounded-md bg-slate-200 p-3 text-center">
        {wrongSolution.length > 0 && (
          <div className="text-sm text-red-500">We were looking for</div>
        )}
        {wrongSolution === "" && (
          <div className="text-md font-semibold text-green-500">
            Your next item:
          </div>
        )}
        <div className="text-2xl">{item.name}</div>
        {item.IPA && <div className="">{item.IPA}</div>}
        <div>
          {item.gender && <span>{item.gender} </span>}
          <span>{item.partOfSpeech}</span>
        </div>
        {item.case && <div>{item.case}</div>}
        {item.firstPresentation && (
          <div className="text-2xl">
            {item.translations[userNative]
              ?.map((transl) => transl.name)
              .join(", ")}
          </div>
        )}
      </div>

      {wrongSolution.length > 0 && (
        <div className="bg-slate-200 p-3 text-center">
          <div className="mb-1">Your solution was</div>
          <div>{wrongSolution}</div>
        </div>
      )}

      <Button
        onClick={() => endPresentation("correct", "")}
        className="rounded-md border-2 bg-green-300 p-2 outline-none focus:border-green-400 focus:outline-none focus:ring-0"
        autoFocus
      >
        Got it!
      </Button>
    </>
  );
}
