import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

import StyledInput from "@/components/ui/StyledInput";
import { ItemWithPopulatedTranslations } from "@/lib/types";
import { FormErrors } from "@/components/ui/FormErrors";

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
