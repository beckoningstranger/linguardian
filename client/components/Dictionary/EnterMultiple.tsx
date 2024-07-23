"use client";

import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { IPA, Label } from "@/lib/types";
import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import EnterMultipleField from "./EnterMultipleField";
import IPAKeys from "./IPAKeys";

interface EnterMultipleProps {
  setValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: Label;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  mode: "IPA" | "strings" | "longstrings";
  IPA?: IPA;
}

export default function EnterMultiple({
  setValue,
  formField,
  initialValue,
  label,
  errors,
  mode,
  IPA,
}: EnterMultipleProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);
  const [activeField, setActiveField] = useState<string | null>(null);

  const { toggleMobileMenu } = useMobileMenuContext();
  if (!toggleMobileMenu) throw new Error("No mobile menu context");

  useEffect(() => {
    if (mode === "IPA" && !activeField) {
      toggleMobileMenu(false);
    } else {
      if (mode === "IPA") toggleMobileMenu(true);
    }
  }, [activeField, toggleMobileMenu, mode]);

  useEffect(() => {
    setValue(formField, array, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [array, setValue, formField]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <>
          <Button
            className="flex w-32 items-center gap-1 pb-2"
            onClick={(e) => {
              e.preventDefault();
              setArray([...array, ""]);
            }}
          >
            <>
              <p className="flex h-full items-center font-semibold capitalize">
                {array.length > 1 ? (
                  <span>{label.plural}</span>
                ) : (
                  <span>{label.singular}</span>
                )}
              </p>
              <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
            </>
          </Button>
          <div
            className={`flex w-full flex-col flex-wrap gap-2 ${
              mode === "longstrings" ? "" : "sm:flex-row sm:items-center"
            }`}
          >
            {array.map((value, index) => (
              <EnterMultipleField
                key={value + index}
                identifier={mode + index}
                array={array}
                setArray={setArray}
                placeholder={label.singular}
                activeField={activeField}
                setActiveField={setActiveField}
              />
            ))}
          </div>

          {errors && (
            <div>
              {Array.isArray(errors) ? (
                errors.map((error, index) => (
                  <div key={index} className="mt-1 text-sm text-red-500">
                    {error?.message}
                  </div>
                ))
              ) : (
                <div className="mt-1 text-sm text-red-500">
                  {errors.message}
                </div>
              )}
            </div>
          )}
        </>
        {activeField && (
          <MobileMenu mode="keyboard" fromDirection="animate-from-bottom">
            <TabGroup className="h-full">
              <TabList className="flex h-10 justify-evenly bg-slate-200 font-medium">
                <Tab className="underline-offset-4 data-[selected]:underline">
                  Consonants
                </Tab>
                <Tab className="underline-offset-4 data-[selected]:underline">
                  Vowels
                </Tab>
                {IPA?.rare && IPA.rare.length > 0 && (
                  <Tab className="underline-offset-4 data-[selected]:underline">
                    Rare
                  </Tab>
                )}
                <Tab className="underline-offset-4 data-[selected]:underline">
                  Helpers
                </Tab>
                <Tab onClick={() => setActiveField(null)}>
                  <XCircleIcon className="h-6 w-full rounded-full text-red-500 outline outline-1 hover:scale-105" />
                </Tab>
              </TabList>
              <TabPanels className="h-full px-2">
                <TabPanel className="h-full">
                  <IPAKeys
                    keys={IPA?.consonants}
                    arrayIndex={parseInt(activeField.slice(-1))}
                    array={array}
                    setArray={setArray}
                  />
                </TabPanel>
                <TabPanel>
                  <IPAKeys
                    keys={IPA?.vowels}
                    arrayIndex={parseInt(activeField.slice(-1))}
                    array={array}
                    setArray={setArray}
                  />
                </TabPanel>
                {IPA?.rare && IPA.rare.length > 0 && (
                  <TabPanel>
                    <IPAKeys
                      arrayIndex={parseInt(activeField.slice(-1))}
                      array={array}
                      setArray={setArray}
                      keys={IPA?.rare}
                    />
                  </TabPanel>
                )}
                <TabPanel>
                  <IPAKeys
                    arrayIndex={parseInt(activeField.slice(-1))}
                    array={array}
                    setArray={setArray}
                    keys={IPA?.helperSymbols}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </MobileMenu>
        )}
      </div>
    </>
  );
}
