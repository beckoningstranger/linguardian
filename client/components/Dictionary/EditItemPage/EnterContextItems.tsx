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

  useEffect(() => {
    setValue("context", contextItems, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [contextItems, setValue]);

  const userId = useUserOnClient().id;

  const contextErrors = errors["context"];
  const faultyFields: { index: number; text?: string; takenFrom?: string }[] =
    [];
  if (Array.isArray(contextErrors)) {
    contextErrors.forEach((errorObject, i) => {
      faultyFields.push({
        index: i,
        text: errorObject?.text?.message,
        takenFrom: errorObject?.takenFrom?.message,
      });
    });
  }

  return (
    <div id="context" className="flex flex-col gap-2 text-sm sm:gap-x-1">
      <>
        <Button
          className="flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            const indexOfEmptyItem = contextItems.findIndex(
              (item) => item.text === ""
            );
            if (indexOfEmptyItem !== -1) {
              // setActiveField(indexOfEmptyItem);
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

        <div className="flex w-full flex-col flex-wrap gap-8">
          {contextItems.map((value, index) => (
            <EnterContextItemsField
              key={value.text + index}
              index={index}
              contextItems={contextItems}
              setContextItems={setContextItems}
              faultyFields={faultyFields}
            />
          ))}
        </div>
        <FormErrors
          field="context"
          errors={errors}
          nested={["takenFrom", "text"]}
        />
      </>
    </div>
  );
}
