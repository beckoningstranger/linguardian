"use client";

import { IPA, Label } from "@/lib/types";
import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import { MobileMenuContextProvider } from "../../context/MobileMenuContext";
import EnterMultipleField from "./EnterMultipleField";
import FormErrors from "./FormErrors";
import IPAKeyboard from "./IPAKeyboard";

interface EnterMultipleProps {
  setValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: Label;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  mode: "IPA" | "strings" | "longstrings";
  IPA?: IPA;
}

export default function EnterMultiple({
  setValue,
  formField,
  initialValue,
  label,
  errors,
  mode,
  IPA,
}: EnterMultipleProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    setValue(formField, array, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [array, setValue, formField]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <>
          <Button
            className="flex w-32 items-center gap-1"
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
          <div
            className={`flex w-full flex-col flex-wrap gap-2 ${
              mode === "longstrings" ? "" : "sm:flex-row sm:items-center"
            }`}
          >
            {array.map((value, index) => (
              <EnterMultipleField
                key={value + index}
                identifier={mode + index}
                array={array}
                setArray={setArray}
                placeholder={label.singular}
                activeField={activeField}
                setActiveField={setActiveField}
              />
            ))}
          </div>
          <FormErrors errors={errors} />
        </>
        {mode === "IPA" && IPA && (
          <MobileMenuContextProvider>
            <IPAKeyboard
              IPA={IPA}
              array={array}
              setArray={setArray}
              activeField={activeField}
            />
          </MobileMenuContextProvider>
        )}
      </div>
    </>
  );
}
