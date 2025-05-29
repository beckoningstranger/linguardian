"use client";

import { useMobileMenu } from "@/context/MobileMenuContext";
import { IPA } from "@/lib/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import IPAKeys from "./IPAKeys";
import MobileMenu from "@/components/Menus/MobileMenu/MobileMenu";

interface IPAKeyboardProps {
  IPA: IPA;
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  activeField: string | null;
}

export default function IPAKeyboard({
  IPA,
  array,
  setArray,
  activeField,
}: IPAKeyboardProps) {
  const { toggleMobileMenu } = useMobileMenu();
  if (typeof toggleMobileMenu !== "function")
    throw new Error("Can't toggle mobile menu");

  useEffect(() => {
    if (activeField) {
      toggleMobileMenu(true);
    } else {
      toggleMobileMenu(false);
    }
  }, [activeField, toggleMobileMenu]);

  if (!activeField) return null;
  return (
    <MobileMenu mode="keyboard" fromDirection="animate-from-bottom">
      <TabGroup manual className="h-full">
        <TabList className="flex h-10 justify-evenly bg-slate-200 font-medium">
          <StyledTab label="Consonants" />
          <StyledTab label="Vowels" />
          {IPA?.rare && IPA.rare.length > 0 && <StyledTab label="Rare" />}
          <StyledTab label="Helpers" />
        </TabList>
        <TabPanels className="font-voces h-full px-2 font-semibold">
          <PanelWithIPAKeys IPASetOfKeys="consonants" />
          <PanelWithIPAKeys IPASetOfKeys="vowels" />
          {IPA?.rare && IPA.rare.length > 0 && (
            <PanelWithIPAKeys IPASetOfKeys="rare" />
          )}
          <PanelWithIPAKeys IPASetOfKeys="helperSymbols" />
        </TabPanels>
      </TabGroup>
    </MobileMenu>
  );

  function StyledTab({ label }: { label: string }) {
    return (
      <Tab className="underline-offset-4 data-[selected]:underline">
        {label}
      </Tab>
    );
  }

  function PanelWithIPAKeys({
    IPASetOfKeys,
  }: {
    IPASetOfKeys: "vowels" | "consonants" | "rare" | "helperSymbols";
  }) {
    return (
      <TabPanel>
        <IPAKeys
          keys={IPA[IPASetOfKeys]}
          arrayIndex={parseInt(activeField!.slice(-1))}
          array={array}
          setArray={setArray}
        />
      </TabPanel>
    );
  }
}
