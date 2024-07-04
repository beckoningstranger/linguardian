"use client";

import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import EnterMultipleField from "./EnterMultipleField";

interface EnterMultipleProps {
  setFormValue: Function;
  formField: string;
  initialValue: string[] | undefined;
}

export default function EnterMultiple({
  setFormValue,
  formField,
  initialValue,
}: EnterMultipleProps) {
  const [array, setArray] = useState(initialValue ? initialValue : []);

  return (
    <div className="flex items-center gap-1">
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
      <div
        onClick={() => {
          setArray([...array, ""]);
        }}
      >
        <PlusCircleIcon className="h-5 w-5 text-green-400" />
      </div>
    </div>
  );
}
