"use client";

import StyledTextarea from "@/components/ui/StyledTextArea";
import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { RefObject, useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { useOutsideInputAndKeyboardClick } from "@/lib/hooks";
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
  const ref = useOutsideInputAndKeyboardClick(handleBlur);

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
              <StyledTextarea
                noFloatingLabel
                label="Definition"
                id="definition"
                ref={ref as RefObject<HTMLTextAreaElement>}
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
                errors={errors}
                minusButtonAction={() => {
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
