"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { Label, StringOrPickOne } from "@/lib/types";
import MinusIcon from "./MinusIcon";

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
        <ListboxButton className="relative mb-2 flex h-10 w-44 items-center rounded-md border border-grey-500 bg-white px-3 shadow-md data-[open]:border-black">
          {value}
          <MinusIcon onClick={removeItemFromArray} />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="relative mt-1 rounded-md border bg-white"
        >
          {options.map((option, index) => (
            <ListboxOption key={option + index} value={option} as={Fragment}>
              {({ focus, selected }) => (
                <div
                  className={`group flex w-32 gap-2  px-2 py-2 text-sm ${
                    focus
                      ? "bg-orange-600 text-white font-bold"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {selected ? (
                    <CheckIcon
                      className={`size-5 ${
                        focus
                          ? "bg-orange-600 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    />
                  ) : (
                    <CheckIcon className="invisible size-5" />
                  )}

                  {option}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
