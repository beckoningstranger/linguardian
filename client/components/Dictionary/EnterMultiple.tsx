"use client";

import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import EnterMultipleField from "./EnterMultipleField";
import { Button } from "@headlessui/react";

interface EnterMultipleProps {
  setFormValue: Function;
  formField: string;
  initialValue: string[] | undefined;
  label: string;
}

export default function EnterMultiple({
  setFormValue,
  formField,
  initialValue,
  label,
}: EnterMultipleProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);

  return (
    <div>
      <Button
        className="flex items-center gap-1 pb-2"
        onClick={(e) => {
          e.preventDefault();
          setArray([...array, ""]);
        }}
      >
        <p className="flex h-full items-center font-semibold capitalize">
          {label}
        </p>
        <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
      </Button>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {array.map((value, index) => (
            <EnterMultipleField
              key={value}
              identifier={index}
              array={array}
              setArray={setArray}
              formField={formField}
              setFormValue={setFormValue}
              initialValue={value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
