"use client";

import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

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

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        className="w-full rounded-md border px-2 py-2 shadow-md sm:w-48"
        spellCheck={false}
        onChange={(e) => setChangedValue(e.target.value)}
        placeholder="Plural form"
        value={changedValue}
        onBlur={() => onBlur()}
        autoFocus={initialValue === "" ? true : false}
        onKeyDown={(e) => {
          const target = e.target as HTMLInputElement;
          switch (e.key) {
            case "Escape":
              setChangedValue(value);
              target.blur();
              break;
            case "Enter":
              setValue(changedValue);
              target.blur();
              break;
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

  function getUniqueNonEmptyArray(array: string[]) {
    const set = new Set();
    const nonEmptyValuesArray = array.filter(
      (value) => value !== undefined && value !== ""
    );
    nonEmptyValuesArray.forEach((item) => set.add(item));
    return [...set] as string[];
  }

  function onBlur() {
    array[identifier] = value;
    const newArray = getUniqueNonEmptyArray(array);
    updateState(newArray);
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
