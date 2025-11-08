"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { EnterIPAField, FormErrors } from "@/components";
import { IPA, ItemWithPopulatedTranslations } from "@/lib/contracts";
import { Label } from "@/lib/types";

interface EnterIPAProps {
  setValue: Function;
  initialValue: string[] | undefined;
  label: Label;
  IPA: IPA;
}

export default function EnterIPA({ initialValue, label, IPA }: EnterIPAProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ItemWithPopulatedTranslations>();

  const { field } = useController({
    name: "IPA",
    control,
    defaultValue: initialValue,
  });

  const ipaValue = field.value || [];
  const setIpaValue = useMemo(() => field.onChange, [field.onChange]);
  const [activeField, setActiveField] = useState<number | null>(null);

  const faultyFields: number[] = [];
  if (Array.isArray(errors["IPA"])) {
    errors["IPA"].map((item, index) => {
      if (item && typeof item.message === "string") faultyFields.push(index);
    });
  }

  const renderFields = () =>
    ipaValue.map((value, index) => (
      <EnterIPAField
        array={ipaValue}
        setArray={setIpaValue}
        key={value + index}
        index={index}
        placeholder={label.singular}
        hasErrors={faultyFields.includes(index)}
        activeField={activeField}
        setActiveField={setActiveField}
        IPA={IPA}
      />
    ));

  return (
    <div id="IPA">
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <Button
          className="IPAPlusButton flex w-32 items-center gap-1 text-cmdb"
          onClick={(e) => {
            e.preventDefault();
            if (!ipaValue.includes("")) setIpaValue([...ipaValue, ""]);
          }}
        >
          <>
            IPA
            <PlusCircleIcon className="flex size-5 items-center text-green-400" />
          </>
        </Button>
        <div className="flex w-full flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
          {renderFields()}
        </div>
        <FormErrors field={"IPA"} errors={errors} />
      </div>
    </div>
  );
}
