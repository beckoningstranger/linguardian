"use client";

import { Types } from "mongoose";
import { useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import FormErrors from "./FormErrors";

interface ManageTranslationsProps {
  setValue: Function;
  initialValue: Types.ObjectId[] | undefined;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
}

export default function ManageTranslations({
  setValue,
  initialValue,
  errors,
}: ManageTranslationsProps) {
  const label = { singular: "Translation", plural: "Translations" };
  const [translationsArray, setTranslationsArray] = useState<Types.ObjectId[]>(
    initialValue || []
  );
  console.log("translations", translationsArray);
  return (
    <>
      <div>
        <div className="text-sm font-semibold">Manage Translations</div>
      </div>
      <FormErrors errors={errors} />
    </>
  );
}
