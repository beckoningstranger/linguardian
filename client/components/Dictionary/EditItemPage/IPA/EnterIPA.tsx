"use client";

import { useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

import { IPA, Label } from "@/lib/types";
import EnterIPAField from "./EnterIPAField";
import { FormErrors } from "@/components/ui/FormErrors";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import IPAKeyboard from "./IPAKeyboard";

interface EnterIPAProps {
  setValue: Function;
  initialValue: string[] | undefined;
  label: Label;
  errors: FieldErrors<FieldValues>;
  IPA: IPA;
}

export default function EnterIPA({
  setValue,
  initialValue,
  label,
  errors,
  IPA,
}: EnterIPAProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);
  const [activeField, setActiveField] = useState<number | null>(null);

  useEffect(() => {
    setValue("IPA", array, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [array, setValue]);

  const faultyFields: number[] = [];
  if (Array.isArray(errors["IPA"])) {
    errors["IPA"].map((item, index) => {
      if (item && typeof item.message === "string") faultyFields.push(index);
    });
  }

  const renderFields = () =>
    array.map((value, index) => (
      <EnterIPAField
        key={value + index}
        index={index}
        array={array}
        setArray={setArray}
        placeholder={label.singular}
        hasErrors={faultyFields.includes(index)}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    ));

  return (
    <>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <Button
          className="IPAPlusButton flex w-32 items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            if (!array.includes("")) setArray([...array, ""]);
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
            <PlusCircleIcon className="flex size-5 items-center text-green-400" />
          </>
        </Button>
        <div className="flex w-full flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
          {renderFields()}
        </div>
        <FormErrors field={"IPA"} errors={errors} />
      </div>
      <MobileMenuContextProvider>
        <IPAKeyboard
          IPA={IPA}
          array={array}
          setArray={setArray}
          activeField={activeField}
        />
      </MobileMenuContextProvider>
    </>
  );
}
