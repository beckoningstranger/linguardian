"use client";

import { useFormContext } from "react-hook-form";

import StyledTextArea from "@/components/Forms/StyledTextArea";

export default function ListDescriptionTextarea() {
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext();
  return (
    <>
      <StyledTextArea
        label="Enter a short description for your list"
        {...register("description")}
        minusButtonAction={reset}
        id="description"
      />
      {errors.listDescription && (
        <p className="text-sm text-red-500">{`${errors.listDescription.message}`}</p>
      )}
    </>
  );
}
