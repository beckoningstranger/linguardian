"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Controller, useFormContext } from "react-hook-form";

interface DropdownProps {
  options: string[] | readonly string[];
  formValue: string;
  label: string;
}

export default function Dropdown({ options, formValue, label }: DropdownProps) {
  const { control } = useFormContext();

  return (
    <div className="w-full">
      <label className="flex w-full px-1">{label}</label>
      <Controller
        name={formValue}
        control={control}
        defaultValue={options[0]}
        rules={{ required: "Please select a option" }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <div>
            <Listbox value={value} onChange={onChange}>
              <div className="relative mt-1">
                <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left text-lg font-medium shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <span className="block truncate">{value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {options.map((option, index) => (
                    <ListboxOption
                      key={index}
                      value={option}
                      className={({ focus }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 z-10 ${
                          focus ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
