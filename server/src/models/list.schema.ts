import { List } from "../lib/types.js";
import { model, Schema } from "mongoose";
import { languageWithFlagAndNameSchema } from "./helperSchemas";

const listSchema = new Schema<List>({
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
    type: languageWithFlagAndNameSchema,
    required: true,
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
      unitName: { type: String },
      item: { type: Schema.Types.ObjectId, ref: "Item" },
    },
  ],
  unitOrder: [String],
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
});

export default model<List>("List", listSchema);
