"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { FormErrors, EnterIPAField, IPAKeyboard } from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
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

  const ipa = field.value || [];
  const setIPA = field.onChange;

  const [activeField, setActiveField] = useState<number | null>(null);

  const faultyFields: number[] = [];
  if (Array.isArray(errors["IPA"])) {
    errors["IPA"].map((item, index) => {
      if (item && typeof item.message === "string") faultyFields.push(index);
    });
  }

  const renderFields = () =>
    ipa.map((value, index) => (
      <EnterIPAField
        key={value + index}
        index={index}
        array={ipa}
        setArray={setIPA}
        placeholder={label.singular}
        hasErrors={faultyFields.includes(index)}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    ));

  return (
    <div id="IPA">
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <Button
          className="IPAPlusButton flex w-32 items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            if (!ipa.includes("")) setIPA([...ipa, ""]);
          }}
        >
          <>
            <p className="flex h-full items-center font-semibold capitalize">
              {ipa.length > 1 ? (
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
          array={ipa}
          setArray={setIPA}
          activeField={activeField}
        />
      </MobileMenuContextProvider>
    </div>
  );
}
