import { ItemToLearn, User } from "@/lib/types";
import { Button } from "@headlessui/react";
import ItemDetails from "../Dictionary/ItemPage/ItemDetails";

interface ItemPresentationProps {
  item: ItemToLearn;
  endPresentationFunction: Function;
  wrongSolution: string;
  user: User;
}

export default function ItemPresentation({
  item,
  endPresentationFunction,
  wrongSolution,
  user,
}: ItemPresentationProps) {
  const allUserLanguages = [...user.learnedLanguages, user.native];
  return (
    <div className="absolute inset-x-0 top-0">
      <div className="my-1 grid justify-center gap-2 rounded-md bg-white/80 py-3 text-center">
        {wrongSolution.length > 0 && (
          <p className="text-clgb text-red-500">Your solution was</p>
        )}
        {wrongSolution === "" && (
          <p className="text-clgb">Take a moment to memorize this item</p>
        )}
        <Button
          onClick={() => endPresentationFunction("correct", "")}
          className="fixed inset-x-0 bottom-0 w-full rounded-t-md bg-green-400 py-5 text-clgb text-white outline-none desktop:static desktop:w-[500px] desktop:rounded-md desktop:py-3 desktop:hover:bg-green-500"
          autoFocus
        >
          Continue
        </Button>
      </div>

      <ItemDetails
        item={item}
        allUserLanguages={allUserLanguages}
        forItemPresentation
      />

      {wrongSolution.length > 0 && (
        <div className="bg-slate-200 p-3 text-center">
          <div className="mb-1">Your solution was</div>
          <div>{wrongSolution}</div>
        </div>
      )}
    </div>
  );
}
