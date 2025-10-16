import { Button } from "@headlessui/react";

import { ItemDetails } from "@/components";
import { ItemToLearn, User } from "@/lib/contracts";

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
  const allUserLanguageCodes = [
    ...user.learnedLanguages.map((lang) => lang.code),
    user.native.code,
  ];
  return (
    <>
      <div
        className="my-1 grid justify-center gap-2 bg-white/90 py-3 text-center"
        id="ItemPresentation"
      >
        {wrongSolution.length > 0 && (
          <div className="py-4 leading-tight">
            <p className="text-clgb text-red-500">Your solution was</p>
            <p className="font-serif text-hmd">{wrongSolution}</p>
          </div>
        )}
        {wrongSolution === "" && (
          <p className="flex h-16 items-center justify-center text-clgb">
            Take a moment to memorize the item below
          </p>
        )}
        <Button
          onClick={() => endPresentationFunction("correct", "")}
          className="fixed inset-x-0 bottom-0 w-full rounded-t-md bg-green-400 py-6 text-cxlb text-white outline-none desktop:static desktop:w-[500px] desktop:rounded-md desktop:py-3 desktop:hover:bg-green-500"
          autoFocus
        >
          Continue
        </Button>
      </div>
      <ItemDetails
        item={item}
        allUserLanguageCodes={allUserLanguageCodes}
        forItemPresentation
      />
    </>
  );
}
