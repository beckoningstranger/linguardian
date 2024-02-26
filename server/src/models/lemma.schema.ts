import { InferSchemaType, model, Schema } from "mongoose";
import { Lemma } from "../types.js";

const lemmaSchema = new Schema<Lemma>({
  name: { type: String, required: true, unique: true },
  language: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

export default model<Lemma>("Lemma", lemmaSchema);
