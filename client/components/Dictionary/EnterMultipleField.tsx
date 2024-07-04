"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { RefObject, useState } from "react";

interface EnterMultipleFieldProps {
  identifier: number;
  array: string[];
  formField: string;
  setFormValue: Function;
  setArray: Function;
  initialValue: string;
}

export default function EnterMultipleField({
  array,
  setFormValue,
  formField,
  setArray,
  identifier,
  initialValue,
}: EnterMultipleFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [changedValue, setChangedValue] = useState(value);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const ref = useOutsideClick(mouseBlur, inputIsFocused);

  return (
    <div className="relative flex items-center">
      <input
        ref={ref as RefObject<HTMLInputElement>}
        type="text"
        className="w-full rounded-md border px-2 py-2 shadow-md sm:w-48"
        spellCheck={false}
        onChange={(e) => setChangedValue(e.target.value)}
        placeholder="Plural form"
        value={changedValue}
        onFocus={() => setInputIsFocused(true)}
        autoFocus={initialValue === "" ? true : false}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Escape":
              setChangedValue(value);
              array[identifier] = value;
              blurAndUpdate(array);
              break;
            case "Enter":
              setValue(changedValue);
              array[identifier] = changedValue;
              blurAndUpdate(array);
              break;
            case "Tab":
              setValue(changedValue);
              array[identifier] = changedValue;
              blurAndUpdate(array);
          }
        }}
      />
      <MinusCircleIcon
        className="absolute right-1 h-5 w-5 text-red-500"
        onClick={() => {
          const index = array.indexOf(value);
          const newArray = [
            ...array.slice(0, index),
            ...array.slice(index + 1),
          ];
          updateState(newArray);
        }}
      />
    </div>
  );

  function blurAndUpdate(array: string[]) {
    setInputIsFocused(false);
    const newArray = getUniqueNonEmptyArray(array);
    updateState(newArray);
    if (ref.current) ref.current.blur();
  }

  function mouseBlur() {
    setValue(changedValue);
    array[identifier] = changedValue;
    blurAndUpdate(array);
  }

  function getUniqueNonEmptyArray(array: string[]) {
    const set = new Set();
    const nonEmptyValuesArray = array.filter(
      (value) => value !== undefined && value !== ""
    );
    nonEmptyValuesArray.forEach((item) => set.add(item));
    return [...set] as string[];
  }

  function updateState(newArray: string[]) {
    setArray(newArray);
    setFormValue(formField, newArray, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }
}
