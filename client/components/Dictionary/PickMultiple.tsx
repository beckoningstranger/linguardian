"use client";

import { Label, StringOrPickOne } from "@/lib/types";
import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import PickMultipleOptions from "./PickMultipleOptions";

interface PickMultipleProps {
  setValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: Label;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  options: string[];
}

export default function PickMultiple({
  setValue,
  formField,
  initialValue,
  label,
  errors,
  options,
}: PickMultipleProps) {
  const placeholder = `Pick a ${label.singular}`;
  const [array, setArray] = useState<StringOrPickOne[]>(
    initialValue ? initialValue : []
  );

  useEffect(() => {
    if (array.filter((item) => item === placeholder).length > 1) {
      const newArray = array.slice();
      const index = newArray.indexOf(placeholder);
      newArray.splice(index, 1);
      setArray(newArray);
    }
    if (!array.includes(placeholder))
      setValue(formField, array, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
  }, [array, setValue, formField, placeholder]);

  return (
    <div>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <>
          <Button
            className="flex w-32 items-center gap-1 pb-2"
            onClick={(e) => {
              e.preventDefault();
              setArray([...array, placeholder]);
            }}
          >
            <>
              <p className="flex h-full items-center font-semibold capitalize">
                <span>{label.plural}</span>
              </p>
              <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
            </>
          </Button>
          <div className={`flex w-full flex-wrap gap-x-2 sm:items-center`}>
            {array.map((option, index) => (
              <PickMultipleOptions
                key={label.singular + "-" + option + index}
                arrayIndexNumber={index}
                array={array}
                setArray={setArray}
                options={options}
                label={label}
              />
            ))}
          </div>
        </>
      </div>
      {errors && (
        <div>
          {Array.isArray(errors) ? (
            errors.map((error, index) => (
              <div key={index} className="mt-1 text-sm text-red-500">
                {error?.message}
              </div>
            ))
          ) : (
            <div className="mt-1 text-sm text-red-500">{errors.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
