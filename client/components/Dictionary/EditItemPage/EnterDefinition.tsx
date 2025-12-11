"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { RefObject, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import FormErrors from "@/components/Forms/FormErrors";
import StyledTextArea from "@/components/Forms/StyledTextArea";
import { ItemWithPopulatedTranslations } from "@/lib/contracts";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface EnterDefinitionProps {
  initialValue: string | undefined;
}

export default function EnterDefinition({
  initialValue,
}: EnterDefinitionProps) {
  const {
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<ItemWithPopulatedTranslations>();

  const [showInputField, setShowInputField] = useState<boolean>(
    (initialValue && initialValue?.length > 0) || false
  );
  const { field } = useController({
    name: "definition",
    control,
    defaultValue: initialValue,
  });

  const definition = field.value;
  const setDefinition: (value: string | undefined) => void = field.onChange;

  const deleteDefinition = () => {
    setDefinition(undefined);
    clearErrors("definition");
    setShowInputField(false);
  };

  const handleOutSideClick = () => {
    if (!definition || definition.trim().length < 25) {
      deleteDefinition();
    }
  };
  const definitionRef = useOutsideClick(handleOutSideClick);

  return (
    <div id="definition" className="flex flex-col gap-x-1 phone:gap-2">
      <>
        <Button
          className="flex w-32 items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            clearErrors("definition");
            setDefinition(undefined);
            setShowInputField(true);
          }}
        >
          <>
            <p className="flex h-full items-center text-cmdb font-semibold capitalize">
              Definition
            </p>
            <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
          </>
        </Button>
        {showInputField && (
          <div
            className="relative flex w-full flex-wrap items-center"
            ref={definitionRef as RefObject<HTMLDivElement>}
          >
            <StyledTextArea
              noFloatingLabel
              label="Definition"
              id="definition"
              spellCheck={false}
              onChange={(e) => {
                setDefinition(e.target.value);
              }}
              placeholder="Enter a definition"
              value={definition}
              autoFocus={definition === undefined ? true : false}
              onKeyDown={(e) => {
                if (e.key === "Escape") deleteDefinition();
              }}
              minusButtonAction={deleteDefinition}
              hasErrors={!!errors["definition"]}
            />
          </div>
        )}
        <FormErrors field="definition" errors={errors} />
      </>
    </div>
  );
}
