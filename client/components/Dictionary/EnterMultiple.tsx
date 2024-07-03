"use client";

import { useState } from "react";
import EnterMultipleField from "./EnterMultipleField";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

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
  const [numberOfFields, setNumberOfFields] = useState(1);

  const renderedFields = [];
  for (let i = 0; i < numberOfFields; i++) {
    renderedFields.push(
      <EnterMultipleField
        key={i}
        identifier={i}
        array={array}
        setArray={setArray}
        formField={formField}
        setFormValue={setFormValue}
        numberOfFields={numberOfFields}
        setNumberOfFields={setNumberOfFields}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-wrap gap-2">{renderedFields}</div>
      <div onClick={() => setNumberOfFields(numberOfFields + 1)}>
        <PlusCircleIcon className="h-6 w-6 text-green-400" />
      </div>
    </div>
  );
}
