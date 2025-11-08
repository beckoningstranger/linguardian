"use client";

import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

import { IPAKeys, StyledIPATab } from "@/components";
import { IPA } from "@/lib/contracts";

interface IPAKeyboardProps {
  IPA: IPA;
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  activeField: number;
}

export default function IPAKeyboard({
  IPA,
  array,
  setArray,
  activeField,
}: IPAKeyboardProps) {
  return (
    <TabGroup manual className="IPAKeyboard h-full">
      <TabList className="flex h-10 justify-evenly bg-slate-200 font-medium">
        <StyledIPATab label="Consonants" />
        <StyledIPATab label="Vowels" />
        {IPA?.rare && IPA.rare.length > 0 && <StyledIPATab label="Rare" />}
        <StyledIPATab label="Helpers" />
      </TabList>
      <TabPanels className="font-voces h-full px-2 font-semibold">
        <TabPanel>
          <IPAKeys
            keys={IPA["consonants"]}
            arrayIndex={activeField}
            array={array}
            setArray={setArray}
          />
        </TabPanel>
        <TabPanel>
          <IPAKeys
            keys={IPA["vowels"]}
            arrayIndex={activeField}
            array={array}
            setArray={setArray}
          />
        </TabPanel>
        {IPA?.rare && IPA.rare.length > 0 && (
          <TabPanel>
            <IPAKeys
              keys={IPA["rare"]}
              arrayIndex={activeField}
              array={array}
              setArray={setArray}
            />
          </TabPanel>
        )}
        <TabPanel>
          <IPAKeys
            keys={IPA["helperSymbols"]}
            arrayIndex={activeField}
            array={array}
            setArray={setArray}
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
