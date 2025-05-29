"use client";

import StyledInput from "@/components/ui/StyledInput";
import { useOutsideInputAndKeyboardClick } from "@/lib/hooks";
import { RefObject, useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

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
    <div className="relative w-[45ch]">
      <StyledInput
        minusButtonAction={() => setValue("")}
        label={placeholder}
        noFloatingLabel
        errors={{} as FieldErrors<FieldValues>} // LOOK HERE, WE NEED TO PASS ERRORS
        ref={ref as RefObject<HTMLInputElement>}
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        id={identifier}
        onChange={(e) => {
          setValue(e.target.value);
        }}
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
