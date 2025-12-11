"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import FormErrors from "@/components/Forms/FormErrors";
import { Label } from "@/lib/types";
import EnterMultipleStringsField from "@/components/Dictionary/EditItemPage/EnterMultipleStringsField";

interface EnterMultipleStringsProps {
  setValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: Label;
  errors: FieldErrors<FieldValues>;
}

export default function EnterMultipleStrings({
  setValue,
  formField,
  initialValue,
  label,
  errors,
}: EnterMultipleStringsProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);

  useEffect(() => {
    setValue(formField, array, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [array, setValue, formField]);

  const faultyFields: number[] = [];
  if (Array.isArray(errors[formField])) {
    errors[formField].map((item, index) => {
      if (item && typeof item.message === "string") faultyFields.push(index);
    });
  }

  const renderFields = () =>
    array.map((value, index) => (
      <EnterMultipleStringsField
        key={value + index}
        index={index}
        array={array}
        setArray={setArray}
        placeholder={label.singular}
        hasErrors={faultyFields.includes(index)}
        formField={formField}
      />
    ));

  return (
    <div id={formField} className="flex flex-col gap-2 text-sm sm:gap-x-1">
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
          <PlusCircleIcon className="flex size-5 items-center text-green-400" />
        </>
      </Button>
      <div className="flex w-full flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
        {renderFields()}
      </div>
      <FormErrors field={formField} errors={errors} />
    </div>
  );
}
