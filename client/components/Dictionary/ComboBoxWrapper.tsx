import { Fragment, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FieldError } from "react-hook-form";

export type ValueType = string | undefined;

export default function ComboBoxWrapper({
  placeholder,
  value,
  onChange,
  onBlur,
  options,
  error,
}: {
  placeholder: string;
  value: ValueType;
  onChange: any;
  onBlur: any;
  options: string[];
  error: FieldError | undefined;
}) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <>
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <div className="relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md sm:text-sm">
            <ComboboxButton className="flex w-full items-center justify-between pr-2">
              <ComboboxInput
                className={`w-full py-2 pl-3 pr-10 text-sm text-gray-900 sm:w-40`}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(option: string) => option}
                placeholder={placeholder}
                onBlur={onBlur}
              />
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border-b border-b-black bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option}
                    className={({ focus }) =>
                      `relative z-20 cursor-default py-2 pl-10 pr-4 ${
                        focus
                          ? "bg-orange-600 text-white"
                          : "bg-white text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, focus }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              focus ? "text-white" : "text-orange-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </>
  );
}
