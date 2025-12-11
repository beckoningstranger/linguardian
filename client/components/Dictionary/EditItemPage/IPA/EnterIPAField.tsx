"use client";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import IPAKeyboard from "@/components/Dictionary/EditItemPage/IPA/IPAKeyboard";
import StyledInput from "@/components/Forms/StyledInput";
import { useKeyboard } from "@/context/KeyboardContext";
import { IPA } from "@/lib/contracts";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface EnterIPAFieldProps {
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  index: number;
  placeholder: string;
  hasErrors: boolean;
  activeField: number | null;
  setActiveField: Dispatch<SetStateAction<number | null>>;
  IPA: IPA;
}

export default function EnterIPAField({
  array,
  setArray,
  index,
  placeholder,
  hasErrors,
  activeField,
  setActiveField,
  IPA,
}: EnterIPAFieldProps) {
  const ref = useOutsideClick(handleBlur, true, [
    ".IPAKeyboard",
    ".IPAInputField",
    ".IPAPlusButton",
  ]);

  const [value, setValue] = useState(array[index]);
  const { openKeyboard, closeKeyboard } = useKeyboard();

  useEffect(() => {
    if (activeField !== null && index === activeField) {
      ref.current?.focus();
    }
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
      closeKeyboard();
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
        id={"IPA-" + index}
        name={"IPA-" + index}
        label={placeholder}
        noFloatingLabel
        hasErrors={hasErrors}
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        className="IPAInputField"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        autoFocus={array[index] === ""}
        onFocus={() => {
          setActiveField(index);
          openKeyboard(
            <IPAKeyboard
              IPA={IPA}
              array={array}
              setArray={setArray}
              activeField={index}
            />
          );
        }}
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
