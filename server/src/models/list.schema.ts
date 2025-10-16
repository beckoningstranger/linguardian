import { model, Schema } from "mongoose";

import { List } from "@/lib/contracts";
import {
  mongooseLanguageWithFlagAndNameSchema,
  mongooseUnitItemSchema,
} from "@/models/helperSchemas";

const mongooseListSchema = new Schema<List>(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: true,
    },
    listNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 190,
    },
    image: {
      type: String,
    },
    language: {
      type: mongooseLanguageWithFlagAndNameSchema,
      required: true,
      _id: false,
    },
    difficulty: {
      type: String,
    },
    authors: [
      {
        type: String,
        required: true,
      },
    ],
    private: {
      type: Boolean,
    },
    units: [
      {
        type: mongooseUnitItemSchema,
        _id: false,
      },
    ],
    unitOrder: [{ type: String }],
    unlockedReviewModes: {
      DE: { type: [String] },
      EN: { type: [String] },
      FR: { type: [String] },
      CN: { type: [String] },
    },
    learners: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    flags: { type: [String] },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

export default model<List>("List", mongooseListSchema);
