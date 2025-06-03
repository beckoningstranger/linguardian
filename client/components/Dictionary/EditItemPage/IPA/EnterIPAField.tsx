"use client";

import StyledInput from "@/components/ui/StyledInput";
import { useOutsideClickWithExceptions } from "@/lib/hooks";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface EnterIPAFieldProps {
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  index: number;
  placeholder: string;
  hasErrors: boolean;
  activeField: number | null;
  setActiveField: Dispatch<SetStateAction<number | null>>;
}

export default function EnterIPAField({
  array,
  setArray,
  index,
  placeholder,
  hasErrors,
  activeField,
  setActiveField,
}: EnterIPAFieldProps) {
  const ref = useOutsideClickWithExceptions(handleBlur, true, [
    ".IPAKeyboard",
    ".IPAInputField",
    ".IPAPlusButton",
  ]);
  const [value, setValue] = useState(array[index]);

  useEffect(() => {
    if (activeField && index === activeField) ref.current?.focus();
  });

  function handleBlur() {
    setActiveField(null);
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
        id={"IPA-" + value}
        label={placeholder}
        noFloatingLabel
        hasErrors={hasErrors}
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        className="IPAInputField"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        autoFocus={value === ""}
        onFocus={() => setActiveField(index)}
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
