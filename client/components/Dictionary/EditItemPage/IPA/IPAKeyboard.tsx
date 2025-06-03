"use client";

import MobileMenu from "@/components/Menus/MobileMenu/MobileMenu";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { IPA } from "@/lib/types";
import { TabGroup, TabList, TabPanels } from "@headlessui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import PanelWithIPAKeys from "./PanetWithIPAKeys";
import StyledTab from "./StyledIPATab";

interface IPAKeyboardProps {
  IPA: IPA;
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
  activeField: number | null;
}

export default function IPAKeyboard({
  IPA,
  array,
  setArray,
  activeField,
}: IPAKeyboardProps) {
  const { toggleMobileMenu, showMobileMenu } = useMobileMenu();
  if (typeof toggleMobileMenu !== "function")
    throw new Error("Can't toggle mobile menu");

  useEffect(() => {
    if (typeof activeField === "number") {
      toggleMobileMenu(true);
    } else {
      toggleMobileMenu(false);
    }
  }, [activeField, toggleMobileMenu, showMobileMenu]);

  if (activeField === null) return null;

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
          <PanelWithIPAKeys
            IPASetOfKeys="consonants"
            array={array}
            setArray={setArray}
            activeField={activeField}
            IPA={IPA}
          />
          <PanelWithIPAKeys
            IPASetOfKeys="vowels"
            array={array}
            setArray={setArray}
            activeField={activeField}
            IPA={IPA}
          />
          {IPA?.rare && IPA.rare.length > 0 && (
            <PanelWithIPAKeys
              IPASetOfKeys="rare"
              array={array}
              setArray={setArray}
              activeField={activeField}
              IPA={IPA}
            />
          )}
          <PanelWithIPAKeys
            IPASetOfKeys="helperSymbols"
            array={array}
            setArray={setArray}
            activeField={activeField}
            IPA={IPA}
          />
        </TabPanels>
      </TabGroup>
    </MobileMenu>
  );
}
