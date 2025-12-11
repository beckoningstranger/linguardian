"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { RefObject, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import FormErrors from "@/components/Forms/FormErrors";
import PickMultipleOptions from "@/components/Dictionary/EditItemPage/PickMultipleOptions";
import { ItemWithPopulatedTranslations, Tag } from "@/lib/contracts";
import { Label } from "@/lib/types";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface PickMultipleProps {
  formField: string;
  label: Label;
  options: Tag[];
  initialValue?: Tag[];
}

export default function PickMultipleTags({
  formField,
  label,
  options,
  initialValue,
}: PickMultipleProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ItemWithPopulatedTranslations>();
  const [displayAll, setDisplayAll] = useState(false);

  const { field } = useController({
    name: "tags",
    control,
    defaultValue: initialValue,
  });

  const optionsRef = useOutsideClick(() => setDisplayAll(false));

  const tags = field.value || [];
  const setTags = field.onChange;

  const pickedOptions = options.filter((option) => tags.includes(option));
  const otherOptions = options.filter((option) => !tags.includes(option));

  return (
    <div id={formField}>
      <div className="flex flex-col gap-2 text-csmr phone:gap-x-1">
        <>
          <Button
            className="flex w-32 items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              setDisplayAll(true);
            }}
          >
            <>
              <p className="flex h-full items-center font-semibold capitalize">
                <span>{label.plural}</span>
              </p>
              <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
            </>
          </Button>
          <div
            className={`flex w-full flex-wrap gap-x-2 gap-y-2 phone:items-center`}
          >
            <div className="flex flex-wrap gap-2">
              {pickedOptions.map((option, index) => (
                <PickMultipleOptions
                  key={label.singular + "-" + option + index}
                  option={option}
                  displayAll={displayAll}
                  setDisplayAll={setDisplayAll}
                  setTags={setTags}
                  tags={tags}
                />
              ))}
            </div>
            <div
              ref={optionsRef as RefObject<HTMLDivElement>}
              className="flex flex-wrap gap-2"
            >
              {otherOptions.map((option, index) => (
                <PickMultipleOptions
                  key={label.singular + "-" + option + index}
                  option={option}
                  displayAll={displayAll}
                  setDisplayAll={setDisplayAll}
                  setTags={setTags}
                  tags={tags}
                />
              ))}
            </div>
          </div>
        </>
      </div>
      <FormErrors field={formField} errors={errors} />
    </div>
  );
}
