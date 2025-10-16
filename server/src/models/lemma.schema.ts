import { model, Schema } from "mongoose";

import { Lemma } from "@/lib/schemas/lemmas";
import Item from "@/models/item.schema";

const lemmaSchema = new Schema<Lemma>(
  {
    name: { type: String, required: true },
    language: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: Item,
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model<Lemma>("Lemma", lemmaSchema);
