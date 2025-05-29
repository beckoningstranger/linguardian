"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import useUserOnClient from "@/lib/hooks/useUserOnClient";
import { ContextItem } from "@/lib/types";
import { FormErrors } from "../../ui/FormErrors";
import EnterContextItemsField from "./EnterContextItemField";

interface EnterContextItemsProps {
  setValue: Function;
  initialValue?: ContextItem[];
  errors: FieldErrors<FieldValues>;
}

export default function EnterContextItems({
  setValue,
  initialValue,
  errors,
}: EnterContextItemsProps) {
  const [contextItems, setContextItems] = useState(
    initialValue ? initialValue : []
  );
  const [activeField, setActiveField] = useState<number | null>(null);

  useEffect(() => {
    setValue("context", contextItems, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [contextItems, setValue]);

  const userId = useUserOnClient().id;

  return (
    <>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <>
          <Button
            className="flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              const indexOfEmptyItem = contextItems.findIndex(
                (item) => item.text === ""
              );
              if (~indexOfEmptyItem) {
                setActiveField(indexOfEmptyItem);
                setContextItems(contextItems);
                return;
              } else {
                setContextItems([
                  ...contextItems,
                  { text: "", author: userId, takenFrom: "" },
                ]);
              }
            }}
          >
            <>
              <p className="flex h-full items-center font-semibold capitalize">
                Used in context
              </p>
              <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
            </>
          </Button>
          <div className="flex w-full flex-col flex-wrap gap-2">
            {contextItems.map((value, index) => (
              <EnterContextItemsField
                key={value.text + index}
                index={index}
                contextItems={contextItems}
                setContextItems={setContextItems}
                activeField={activeField}
                setActiveField={setActiveField}
              />
            ))}
          </div>
          <FormErrors field="context" errors={errors} />
        </>
      </div>
    </>
  );
}
