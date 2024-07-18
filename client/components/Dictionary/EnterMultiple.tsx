"use client";

import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { IPA } from "@/lib/types";
import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import EnterMultipleField from "./EnterMultipleField";
import IPAKeys from "./IPAKeys";

interface EnterMultipleProps {
  setValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: { singular: string; plural: string };
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  mode: "IPA" | "strings";
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
    if (!activeField) {
      toggleMobileMenu(false);
    } else {
      toggleMobileMenu(true);
    }
  }, [activeField, toggleMobileMenu]);

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
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
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
          </div>
        </>
        {errors && (
          <p className="mt-1 text-sm text-red-500">{`${errors.message}`}</p>
        )}
      </div>
      {activeField && (
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
              <TabPanel>
                <IPAKeys
                  arrayIndex={parseInt(activeField.slice(-1))}
                  array={array}
                  setArray={setArray}
                  keys={IPA?.dipthongs}
                />
              </TabPanel>
              <TabPanel>
                <IPAKeys
                  arrayIndex={parseInt(activeField.slice(-1))}
                  array={array}
                  setArray={setArray}
                  keys={IPA?.rare}
                />
              </TabPanel>
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
    </>
  );
}
