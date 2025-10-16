import { TabPanel } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

import { IPAKeys } from "@/components";
import { IPA } from "@/lib/contracts";

interface PanelWithIPAKeysProps {
  IPASetOfKeys: "vowels" | "consonants" | "rare" | "helperSymbols";
  IPA: IPA;
  activeField: number;
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
}

export default function PanelWithIPAKeys({
  IPASetOfKeys,
  IPA,
  activeField,
  array,
  setArray,
}: PanelWithIPAKeysProps) {
  return (
    <TabPanel>
      <IPAKeys
        keys={IPA[IPASetOfKeys]}
        arrayIndex={activeField}
        array={array}
        setArray={setArray}
      />
    </TabPanel>
  );
}
