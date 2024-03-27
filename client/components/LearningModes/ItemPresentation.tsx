import { ItemPopulatedWithTranslations, SupportedLanguage } from "@/types";
import { MouseEventHandler } from "react";

interface ItemPresentationProps {
  item: ItemPopulatedWithTranslations;
  endPresentation: Function;
  userSolution: string;
  firstPresentation: Boolean;
  userNative: SupportedLanguage;
}

export default function ItemPresentation({
  item,
  endPresentation,
  userSolution,
  firstPresentation,
  userNative,
}: ItemPresentationProps) {
  return (
    <>
      <div className="flex flex-col gap-y-1.5 rounded-md bg-slate-200 p-3 text-center">
        {!firstPresentation && (
          <div className="text-sm text-red-500">We were looking for</div>
        )}
        {firstPresentation && (
          <div className="text-md font-semibold text-green-500">
            Your next item:
          </div>
        )}
        <div className="text-2xl">{item.name}</div>
        {item.IPA && <div className="">{item.IPA}</div>}
        <div className="">{item.partOfSpeech}</div>
        {item.gender && <div>{item.gender}</div>}
        {item.case && <div>{item.case}</div>}
        {firstPresentation && (
          <div className="text-2xl">
            {item.translations[userNative]
              .map((transl) => transl.name)
              .join(", ")}
          </div>
        )}
      </div>

      {userSolution.length > 0 && (
        <div className="bg-slate-200 p-3 text-center text-sm">
          <div className="mb-1">Your solution was</div>
          <div>{userSolution}</div>
        </div>
      )}

      <button
        onClick={endPresentation as MouseEventHandler}
        className="rounded-md border-2 bg-green-300 p-2 outline-none focus:border-green-400 focus:outline-none focus:ring-0"
        autoFocus
      >
        Got it!
      </button>
    </>
  );
}
