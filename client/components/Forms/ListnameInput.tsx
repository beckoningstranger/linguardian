"use client";

import { useFormContext } from "react-hook-form";

import { FormErrors } from "@/components";
import StyledInput from "@/components/Forms/StyledInput";

interface ListnameInputProps {
  label: string;
  formField: string;
}
export default function ListnameInput({
  label,
  formField,
}: ListnameInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <StyledInput
        label={label}
        {...register(formField)}
        type="text"
        id={formField}
        name={formField}
        hasErrors={!!errors[formField]}
      />
      <FormErrors errors={errors} field={formField} />
      {errors.listName && (
        <p className="text-sm text-red-500">{`${errors[formField]?.message}`}</p>
      )}
    </>
  );
}
