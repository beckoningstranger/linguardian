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
import { FieldError, Merge } from "react-hook-form";
import FormErrors from "./FormErrors";

export type ValueType = string | undefined;

interface ComboBoxWrapperProps {
  placeholder: string;
  value: ValueType;
  onChange: any;
  onBlur: any;
  options: string[];
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
}

export default function ComboBoxWrapper({
  placeholder,
  value,
  onChange,
  onBlur,
  options,
  errors,
}: ComboBoxWrapperProps) {
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
        <div className="relative rounded-md border">
          <div className="relative cursor-default rounded-lg bg-white text-left shadow-md sm:text-sm">
            <ComboboxButton className="flex w-full items-center">
              <ComboboxInput
                className={`w-full rounded-l-md py-2 pl-3 pr-10 text-sm text-gray-900 focus:outline-[10px] focus:outline-black sm:w-40`}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(option: string) => option}
                placeholder={placeholder}
                onBlur={onBlur}
              />
              <div className="mx-1">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
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
                <div className="relative cursor-default select-none px-4 py-2 text-red-500">
                  No valid option found
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
      <FormErrors errors={errors} />
    </>
  );
}
