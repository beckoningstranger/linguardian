"use client";

import { Dispatch, RefObject, SetStateAction, useState } from "react";

import StyledInput from "@/components/ui/StyledInput";
import { useOutsideClickWithExceptions } from "@/lib/hooks";

interface EnterMultipleStringsFieldProps {
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  index: number;
  placeholder: string;
  hasErrors?: boolean;
  formField: string;
}

export default function EnterMultipleStringsField({
  array,
  setArray,
  index,
  placeholder,
  hasErrors = false,
  formField,
}: EnterMultipleStringsFieldProps) {
  const ref = useOutsideClickWithExceptions(handleBlur);
  const [value, setValue] = useState(array[index]);

  function handleBlur() {
    const newArray = [...array];
    newArray[index] = value;
    setTimeout(() => {
      const filteredArray = newArray.filter(
        (item, i) => newArray.indexOf(item) === i && item.trim() !== ""
      );
      setArray(filteredArray);
    }, 0);
  }

  const deleteValue = () => {
    const newArray = array.slice(0, index).concat(array.slice(index + 1));
    setArray(newArray);
  };

  return (
    <div className="relative w-[45ch]">
      <StyledInput
        ref={ref as RefObject<HTMLInputElement>}
        minusButtonAction={deleteValue}
        label={placeholder}
        noFloatingLabel
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        id={formField}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        autoFocus={value === ""}
        hasErrors={hasErrors}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Escape":
            case "Enter":
            case "Tab":
              handleBlur();
          }
        }}
      />
    </div>
  );
}
