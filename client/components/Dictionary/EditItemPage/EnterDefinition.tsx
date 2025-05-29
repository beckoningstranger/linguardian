"use client";

import { useOutsideInputAndKeyboardClick } from "@/lib/hooks";
import { Button, Textarea } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { RefObject, useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { FormErrors } from "../../ui/FormErrors";

interface EnterDefinitionProps {
  setValue: Function;
  initialValue: string | undefined;
  errors: FieldErrors<FieldValues>;
}

export default function EnterDefinition({
  setValue,
  initialValue,
  errors,
}: EnterDefinitionProps) {
  const [definition, setDefinition] = useState(
    initialValue ? initialValue : ""
  );
  const [showInputField, setShowInputField] = useState<boolean>(
    (initialValue && initialValue?.length > 0) || false
  );
  const ref = useOutsideInputAndKeyboardClick(blur);

  useEffect(() => {
    setValue("definition", definition, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [definition, setValue]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm sm:gap-x-1">
        <>
          <Button
            className="flex w-32 items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              setShowInputField(true);
            }}
          >
            <>
              <p className="flex h-full items-center font-semibold capitalize">
                Definition
              </p>
              <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
            </>
          </Button>
          {showInputField && (
            <div className="relative flex w-full flex-wrap items-center">
              <Textarea
                ref={ref as RefObject<HTMLInputElement>}
                className="h-36 w-full resize-none overflow-hidden text-wrap rounded-md border py-2 pl-2 pr-10 shadow-md tablet:h-20 desktop:h-14"
                spellCheck={false}
                onChange={(e) => {
                  setDefinition(e.target.value);
                }}
                placeholder="Enter a definition"
                value={definition}
                autoFocus={definition === "" ? true : false}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "Escape":
                    case "Enter":
                    case "Tab":
                      handleBlur();
                  }
                }}
              />
              <MinusCircleIcon
                className="absolute right-1 h-5 w-5 text-red-500"
                onClick={() => {
                  setDefinition("");
                  setShowInputField(false);
                }}
              />
            </div>
          )}
          <FormErrors field="definition" errors={errors} />
        </>
      </div>
    </>
  );

  function handleBlur() {
    if (definition === "") {
      setDefinition("");
      setShowInputField(false);

      if (ref.current) ref.current.blur();
      return;
    }
    if (ref.current) ref.current.blur();
  }
}
