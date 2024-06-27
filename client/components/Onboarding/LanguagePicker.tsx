import { LanguageWithFlagAndName } from "@/types";
import { Listbox, ListboxButton, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Flag from "react-world-flags";

interface LanguagePickerProps {
  languageObject: LanguageWithFlagAndName | null;
  allOptions: JSX.Element[];
  initialString: string;
  pickedString: string;
}

export default function LanguagePicker({
  languageObject,
  allOptions,
  initialString,
  pickedString,
}: LanguagePickerProps) {
  return (
    <Listbox>
      <ListboxButton className="relative flex w-full items-center justify-center gap-2 rounded-md bg-green-100 px-3 py-2 text-center shadow-inner shadow-white/10 focus:outline-none">
        <div
          className={`flex w-full items-center gap-4 rounded-md text-center`}
        >
          {languageObject && (
            <div className="flex h-16 items-center">
              <Flag
                code={languageObject?.flag}
                key={languageObject?.name}
                className="my-2 h-12 w-12 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125"
              />
              <div className="pl-4">{pickedString}</div>
            </div>
          )}
          {!languageObject && (
            <div className="grid h-16 w-full place-items-center">
              {initialString}
            </div>
          )}
        </div>
        <ChevronDownIcon className="absolute right-0 mr-6 flex size-4 fill-black/60" />
      </ListboxButton>
      <ListboxOptions
        className="mt-1 flex flex-col rounded-md bg-green-100 text-left"
        transition
      >
        {allOptions}
      </ListboxOptions>
    </Listbox>
  );
}
