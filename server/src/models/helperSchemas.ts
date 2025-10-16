import { Schema } from "mongoose";

import { LanguageWithFlagAndName } from "@/lib/contracts";
import { UnitItemWithObjectId } from "@/lib/schemas";

export const mongooseLanguageWithFlagAndNameSchema =
  new Schema<LanguageWithFlagAndName>(
    {
      code: { type: String, required: true },
      flag: { type: String, required: true },
      name: { type: String, required: true },
    },
    { _id: false }
  );

export const mongooseUnitItemSchema = new Schema<UnitItemWithObjectId>(
  {
    unitName: { type: String },
    item: { type: Schema.Types.ObjectId, ref: "Item" },
  },
  { _id: false }
);
