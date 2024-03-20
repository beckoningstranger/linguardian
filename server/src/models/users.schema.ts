import { User } from "../types.js";
import { model, Schema } from "mongoose";

const userSchema = new Schema<User>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  native: {
    type: String,
  },
  languages: [
    {
      name: { type: String },
      code: { type: String },
      flag: { type: String },
      learnedItems: [
        {
          id: { type: Schema.Types.ObjectId, ref: "Item" },
          level: { type: Number },
          nextReview: { type: Date },
        },
      ],
      ignoredItems: [{type: Schema.Types.ObjectId, ref: "Item"}],
      learnedLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
      customSRSettings: {
        reviewTimes: {
          1: { type: Number },
          2: { type: Number },
          3: { type: Number },
          4: { type: Number },
          5: { type: Number },
          6: { type: Number },
          7: { type: Number },
          8: { type: Number },
          9: { type: Number },
          10: { type: Number },
        },
        itemsPerSession: {
          learning: { type: Number },
          reviewing: { type: Number },
        },
      },
    },
  ],
});

export default model<User>("User", userSchema);
