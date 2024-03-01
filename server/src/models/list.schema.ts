import { List } from "../types.js";
import { model, Schema } from "mongoose";

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
  },
  language: {
    type: String,
    required: true,
  },
  // authors: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: "User",
  //   },
  // ],
  authors: {
    type: [String],
  },
  private: {
    type: Boolean,
  },
  units: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
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
