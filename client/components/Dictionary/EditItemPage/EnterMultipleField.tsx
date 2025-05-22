"use client";

import { useOutsideInputAndKeyboardClick } from "@/lib/hooks";
import { Input } from "@headlessui/react";
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { RefObject, useEffect, useState } from "react";

interface EnterMultipleFieldProps {
  array: string[];
  setArray: Function;
  identifier: string;
  placeholder: string;
  activeField: string | null;
  setActiveField: Function;
}

export default function EnterMultipleField({
  array,
  setArray,
  identifier,
  placeholder,
  activeField,
  setActiveField,
}: EnterMultipleFieldProps) {
  const ref = useOutsideInputAndKeyboardClick(blur);
  const [value, setValue] = useState(array[parseInt(identifier.slice(-1))]);

  useEffect(() => {
    if (activeField && identifier) {
      if (parseInt(activeField.slice(-1)) === parseInt(identifier.slice(-1)))
        ref.current?.focus();
    }
  }, [activeField, identifier, ref]);

  useEffect(() => {
    if (value !== array[parseInt(identifier.slice(-1))]) {
      const newArray = array.slice();
      newArray[parseInt(identifier.slice(-1))] = value;
      const uniqueArray = Array.from(new Set(newArray));
      setArray(uniqueArray);
    }
  }, [value, identifier, array, setArray]);

  return (
    <div className="relative flex items-center">
      <Input
        ref={ref as RefObject<HTMLInputElement>}
        type="text"
        className="w-full rounded-md border px-2 py-2 font-voces shadow-md"
        spellCheck={false}
        id={identifier}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          setActiveField("field" + identifier);
        }}
        autoFocus={value === "" ? true : false}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Escape":
            case "Enter":
            case "Tab":
              blur();
              break;
          }
        }}
      />
      <MinusCircleIcon
        className="absolute right-1 h-5 w-5 text-red-500"
        onClick={() => {
          setValue("");
        }}
      />
    </div>
  );

  function blur() {
    setActiveField(null);
    if (value === "") {
      const noEmptyStringsArray = getArrayWithNoEmptyStrings(array);
      setArray(noEmptyStringsArray);
      if (ref.current) ref.current.blur();
      return;
    }
    if (array.includes(value)) {
      const uniqueArray = Array.from(new Set(array));
      setArray(uniqueArray);
      if (ref.current) ref.current.blur();
      return;
    }
  }

  function getArrayWithNoEmptyStrings(array: string[]) {
    return array.filter((string) => string !== undefined && string !== "");
  }
}
