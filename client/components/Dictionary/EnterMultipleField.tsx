"use client";

import { useState } from "react";

interface EnterMultipleFieldProps {
  identifier: number;
  array: string[];
  formField: string;
  setFormValue: Function;
  setArray: Function;
  numberOfFields: number;
  setNumberOfFields: Function;
}

export default function EnterMultipleField({
  array,
  setFormValue,
  formField,
  setArray,
  numberOfFields,
  setNumberOfFields,
  identifier,
}: EnterMultipleFieldProps) {
  const [value, setValue] = useState("");

  return (
    <input
      type="text"
      className="w-48 rounded-md border px-2 py-1 shadow-md"
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      autoFocus={identifier === 0 ? false : true}
    />
  );
  function getArray(array: string[], newValue: string) {
    const set = new Set().add(newValue);
    array.forEach((item) => set.add(item));
    setArray([...set]);
    return [...set];
  }

  function onBlur() {
    if (!(value.length > 0) || array.includes(value)) {
      setNumberOfFields(numberOfFields - 1);
      array.pop();
      setArray(array);
      return;
    }
    setFormValue(formField, getArray(array, value), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }
}
