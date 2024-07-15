"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import EnterMultipleField from "./EnterMultipleField";
import { MobileMenuContextProvider } from "../Menus/MobileMenu/MobileMenuContext";
import { IPA } from "@/lib/types";

interface EnterMultipleProps {
  setFormValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: { singular: string; plural: string };
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  mode: "IPA" | "strings";
  IPA?: IPA;
}

export default function EnterMultiple({
  setFormValue,
  formField,
  initialValue,
  label,
  errors,
  mode,
  IPA,
}: EnterMultipleProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);

  return (
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
          <MobileMenuContextProvider>
            <div className="flex flex-wrap gap-2">
              {array.map((value, index) => (
                <EnterMultipleField
                  key={value + index}
                  identifier={index}
                  array={array}
                  setArray={setArray}
                  formField={formField}
                  setFormValue={setFormValue}
                  initialValue={value}
                  placeholder={label.singular}
                  mode={mode}
                  IPA={IPA}
                />
              ))}
            </div>
          </MobileMenuContextProvider>
        </div>
      </>
      {errors && (
        <p className="mt-1 text-sm text-red-500">{`${errors.message}`}</p>
      )}
    </div>
  );
}
