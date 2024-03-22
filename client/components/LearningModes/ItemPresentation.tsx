import { ItemPopulatedWithTranslations } from "@/types";
import { RefObject } from "react";

interface ItemPresentationProps {
  item: ItemPopulatedWithTranslations;
  itemPresentation: boolean | undefined;
  endPresentation: Function;
  userSolution: string;
  setSolution: Function;
}

export default function ItemPresentation({
  item,
  endPresentation,
  itemPresentation,
  userSolution,
  setSolution,
}: ItemPresentationProps) {
  function handleGotItClick() {
    endPresentation();
    setSolution("");
  }

  if (itemPresentation) {
    return (
      <>
        <div className="flex flex-col gap-y-1.5 rounded-md bg-slate-200 p-3 text-center">
          <div className="text-sm text-red-500">We were looking for</div>
          <div className="text-2xl">{item.name}</div>
          {item.IPA && <div className="">{item.IPA}</div>}
          <div className="">{item.partOfSpeech}</div>
          {item.gender && <div>{item.gender}</div>}
          {item.case && <div>{item.case}</div>}
        </div>

        {userSolution.length > 0 && (
          <div className="bg-slate-200 p-3 text-center text-sm">
            <div className="mb-1">Your solution was</div>
            <div>{userSolution}</div>
          </div>
        )}

        <button
          onClick={handleGotItClick}
          className="rounded-md border-2 bg-green-300 p-2 outline-none focus:border-green-400 focus:outline-none focus:ring-0"
          autoFocus
        >
          Got it!
        </button>
      </>
    );
  } else return null;
}
