"use client";

import { Label, StringOrPickOne } from "@/lib/types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useCallback, useEffect, useState } from "react";

interface PickMultipleOptionsProps {
  array: StringOrPickOne[];
  arrayIndexNumber: number;
  setArray: Function;
  options: string[];
  label: Label;
}

export default function PickMultipleOptions({
  array,
  arrayIndexNumber,
  setArray,
  options,
  label,
}: PickMultipleOptionsProps) {
  const placeholder = `Pick a ${label.singular}`;
  const [value, setValue] = useState<StringOrPickOne>(
    array[arrayIndexNumber] || placeholder
  );

  useEffect(() => {
    if (value === placeholder) return;
    if (value !== array[arrayIndexNumber]) {
      const newArray = [...array];
      newArray[arrayIndexNumber] = value;
      const uniqueArray = Array.from(new Set(newArray));
      setArray(uniqueArray);
    }
  }, [value, array, arrayIndexNumber, setArray, placeholder]);

  const removeItemFromArray = useCallback(() => {
    const newArray = [...array];
    const index = array.indexOf(value);
    if (index > -1) {
      newArray.splice(index, 1);
      setArray(newArray);
    }
  }, [value, array, setArray]);

  return (
    <Listbox value={value} onChange={setValue}>
      <div className="flex flex-col gap-y-2">
        <ListboxButton className="relative mb-2 flex w-32 rounded-md border px-3 py-2 shadow-md">
          {value}
          <MinusCircleIcon
            className="absolute right-1 h-5 w-5 text-red-500"
            onClick={removeItemFromArray}
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="relative mt-1 rounded-md border bg-white"
        >
          {options.map((option, index) => (
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
}
