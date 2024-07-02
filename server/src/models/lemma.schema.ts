import { model, Schema } from "mongoose";
import { Lemma } from "../lib/types.js";
import Item from "./item.schema.js";

const lemmaSchema = new Schema<Lemma>({
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
});

export default model<Lemma>("Lemma", lemmaSchema);
