"use client";

import { PartOfSpeech, sortedTags, StringOrPickOne } from "@/lib/types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

interface PickMultipleOptionsProps {
  array: StringOrPickOne[];
  arrayIndexNumber: number;
  setArray: Function;
  options: sortedTags;
  partOfSpeech: PartOfSpeech;
}

export default function PickMultipleOptions({
  array,
  arrayIndexNumber,
  setArray,
  options,
  partOfSpeech,
}: PickMultipleOptionsProps) {
  const optionsForThisWord = options.forAll.concat(
    options[partOfSpeech] ? options[partOfSpeech] : []
  );

  const [tag, setTag] = useState<StringOrPickOne>(
    array[arrayIndexNumber] ? array[arrayIndexNumber] : "Pick a tag"
  );

  useEffect(() => {
    if (tag === "Pick a tag") return;
    if (tag !== array[arrayIndexNumber]) {
      const newArray = array.slice();
      newArray[arrayIndexNumber] = tag;
      const uniqueArray = new Set<string>();
      newArray.forEach((item) => uniqueArray.add(item));
      setArray([...uniqueArray]);
    }
  }, [tag, array, arrayIndexNumber, setArray]);

  return (
    <Listbox value={tag} onChange={setTag}>
      <div className="flex flex-col gap-y-2">
        <ListboxButton className="relative mb-2 flex w-32 rounded-md border px-3 py-2 shadow-md">
          {tag}
          <MinusCircleIcon
            className="absolute right-1 h-5 w-5 text-red-500"
            onClick={removeTagFromArray}
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="relative mt-1 rounded-md border bg-white"
        >
          {optionsForThisWord.map((option, index) => (
            <ListboxOption key={option + index} value={option} as={Fragment}>
              <div className="group flex w-32 gap-2 bg-white px-2 py-2 text-sm data-[focus]:bg-orange-600 data-[focus]:font-bold data-[focus]:text-white group-data-[selected]:font-bold">
                <CheckIcon className="invisible size-5 group-data-[selected]:visible group-data-[focus]:text-orange-50 group-data-[selected]:text-orange-600" />
                {option}
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );

  function removeTagFromArray() {
    const newArray = array.slice();
    const index = array.indexOf(tag);
    newArray.splice(index, 1);
    setArray(newArray);
  }
}
