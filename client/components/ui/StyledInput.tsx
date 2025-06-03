import React, { forwardRef, MouseEventHandler } from "react";
import { Field, Input, Label } from "@headlessui/react";

import { cn } from "@/lib/helperFunctionsClient";
import MinusIcon from "../Dictionary/EditItemPage/MinusIcon";

type StyledInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  optional?: boolean;
  id: string;
  noFloatingLabel?: boolean;
  hasErrors?: boolean;
  minusButtonAction?: MouseEventHandler;
};

const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(
  (
    {
      label,
      optional,
      id,
      noFloatingLabel = false,
      hasErrors = false,
      minusButtonAction,
      name,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Field
        className={cn(
          "relative flex w-full flex-col items-center rounded-md border border-grey-500 bg-white  focus-within:border-black focus-within:outline-none",
          hasErrors && "border-red-500 focus-within:border-red-500",
          className
        )}
      >
        <Input
          ref={ref}
          id={id}
          name={name || id}
          type="text"
          className={cn(
            "peer h-11 w-full resize-y bg-transparent px-4 pr-12 border-none outline-none",
            !noFloatingLabel && "placeholder-transparent"
          )}
          placeholder={label}
          {...props}
        />

        <Label
          htmlFor={id}
          className={cn(
            "absolute -top-6 left-0 text-base text-grey-800 transition-all duration-75 peer-placeholder-shown:top-3 peer-placeholder-shown:px-4 peer-placeholder-shown:text-cmdr peer-placeholder-shown:text-grey-800",
            noFloatingLabel && "hidden"
          )}
        >
          {label}
        </Label>

        {optional && (
          <div className="absolute -top-6 right-0 text-base text-grey-800">
            Optional
          </div>
        )}
        {minusButtonAction && <MinusIcon onClick={minusButtonAction} />}
      </Field>
    );
  }
);

StyledInput.displayName = "StyledInput";
export default StyledInput;
