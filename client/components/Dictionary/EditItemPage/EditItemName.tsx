"use client";

import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

import { FormErrors, StyledInput } from "@/components";
import { ItemWithPopulatedTranslations } from "@/lib/contracts";

interface EditItemNameProps {
  control: Control<
    ItemWithPopulatedTranslations,
    any,
    ItemWithPopulatedTranslations
  >;
  itemName: string;
  isNewItem: boolean;
  errors: FieldErrors<FieldValues>;
}
export default function EditItemName({
  control,
  itemName,
  isNewItem,
  errors,
}: EditItemNameProps) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, onBlur } }) => (
          <div id="itemName" className="grid gap-2">
            <StyledInput
              label="Item name"
              onChange={onChange}
              onBlur={onBlur}
              name="name"
              id="name"
              defaultValue={itemName}
              placeholder="Item name"
              autoFocus={isNewItem}
              hasErrors={!!errors["name"]}
            />
            <FormErrors field="name" errors={errors} />
          </div>
        )}
      />
    </>
  );
}
