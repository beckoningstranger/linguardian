import { TabPanel } from "@headlessui/react";
import IPAKeys from "./IPAKeys";
import { IPA } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

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
