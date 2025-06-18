import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

import { FormErrors } from "@/components/ui/FormErrors";
import StyledInput from "@/components/ui/StyledInput";
import { ItemWithPopulatedTranslationsFE } from "@/lib/types";

interface EditItemNameProps {
  control: Control<
    ItemWithPopulatedTranslationsFE,
    any,
    ItemWithPopulatedTranslationsFE
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
