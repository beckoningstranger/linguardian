"use client";

import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { RefObject, useEffect, useState } from "react";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import { IPA } from "@/lib/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import IPAKeys from "./IPAKeys";

interface EnterMultipleFieldProps {
  identifier: number;
  array: string[];
  formField: string;
  setFormValue: Function;
  setArray: Function;
  initialValue: string;
  placeholder: string;
  mode: "IPA" | "strings";
  IPA?: IPA;
}

export default function EnterMultipleField({
  array,
  setFormValue,
  formField,
  setArray,
  identifier,
  initialValue,
  placeholder,
  mode,
  IPA,
}: EnterMultipleFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [changedValue, setChangedValue] = useState(value);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const ref = useOutsideClick(mouseBlur);

  const { toggleMobileMenu } = useMobileMenuContext();
  if (!toggleMobileMenu) throw new Error("No mobile menu");

  useEffect(() => {
    if (inputIsFocused && mode === "IPA") {
      toggleMobileMenu(true);
    } else {
      toggleMobileMenu(false);
    }
  });

  return (
    <div className="relative flex items-center">
      <input
        ref={ref as RefObject<HTMLInputElement>}
        type="text"
        className="w-full rounded-md border px-2 py-2 shadow-md sm:w-48"
        spellCheck={false}
        onChange={(e) => setChangedValue(e.target.value)}
        placeholder={placeholder}
        value={changedValue}
        onFocus={() => {
          setInputIsFocused(true);
        }}
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
        onBlur={(e) => {
          if (
            !(e.relatedTarget?.id.slice(0, 7) === "IPAKeys") &&
            !(e.relatedTarget?.role === "tab")
          )
            setInputIsFocused(false);
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
      <MobileMenu mode="keyboard" fromDirection="animate-from-bottom">
        <TabGroup className="h-full">
          <TabList className="mx-5 flex justify-between">
            <Tab>Consonants</Tab>
            <Tab>Vowels</Tab>
            <Tab>Dipthongs</Tab>
            <Tab>Rare</Tab>
            <Tab>Helpers</Tab>
          </TabList>
          <TabPanels className="h-full">
            <TabPanel className="h-full">
              <IPAKeys
                keys={IPA?.consonants}
                inputFieldRef={ref}
                inputFieldValue={changedValue}
                inputFieldValueSetter={setChangedValue}
              />
            </TabPanel>
            <TabPanel>
              <IPAKeys
                keys={IPA?.vowels}
                inputFieldRef={ref}
                inputFieldValue={changedValue}
                inputFieldValueSetter={setChangedValue}
              />
            </TabPanel>
            <TabPanel>
              <IPAKeys
                keys={IPA?.dipthongs}
                inputFieldRef={ref}
                inputFieldValue={changedValue}
                inputFieldValueSetter={setChangedValue}
              />
            </TabPanel>
            <TabPanel>
              <IPAKeys
                keys={IPA?.rare}
                inputFieldRef={ref}
                inputFieldValue={changedValue}
                inputFieldValueSetter={setChangedValue}
              />
            </TabPanel>
            <TabPanel>
              <IPAKeys
                keys={IPA?.helperSymbols}
                inputFieldRef={ref}
                inputFieldValue={changedValue}
                inputFieldValueSetter={setChangedValue}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </MobileMenu>
    </div>
  );

  function blurAndUpdate(array: string[]) {
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
