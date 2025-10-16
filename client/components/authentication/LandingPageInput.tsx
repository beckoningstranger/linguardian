"use client";

import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import { FormErrors, StyledInput } from "@/components";

type LandingPageInputProps = {
  type: string;
  id: string;
  placeholder:
    | "Enter your email"
    | "Enter your username"
    | "Enter your usernameSlug"
    | "Enter your password"
    | "Enter your password again";
} & React.InputHTMLAttributes<HTMLInputElement>;

const LandingPageInput = forwardRef<HTMLInputElement, LandingPageInputProps>(
  ({ type, placeholder, id, ...props }, ref) => {
    const {
      register,
      trigger,
      formState: { errors },
    } = useFormContext();

    return (
      <div className="flex flex-col gap-y-1">
        <label htmlFor={id} className="sr-only">
          {placeholder}
        </label>
        <StyledInput
          autoFocus={id === "username"}
          label={placeholder}
          type={type}
          id={id}
          placeholder={placeholder}
          hasErrors={Object.keys(errors).includes(id)}
          {...props}
          noFloatingLabel
          {...register(id, { onBlur: () => trigger(id) })}
        />
        <FormErrors errors={errors} field={id} />
      </div>
    );
  }
);
LandingPageInput.displayName = "LandingPageInput";
export default LandingPageInput;
