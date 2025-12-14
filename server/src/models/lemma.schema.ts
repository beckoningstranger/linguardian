import { model, Schema } from "mongoose";

import { Lemma } from "@/schemas";
import { ItemModel } from "@/models";

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
        ref: ItemModel,
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

export const LemmaModel = model<Lemma>("Lemma", lemmaSchema);
