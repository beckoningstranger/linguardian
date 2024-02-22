import mongoose from "mongoose";
import { Lemma } from "../types.js";

const lemmaSchema = new mongoose.Schema<Lemma>({
  name: { type: String, required: true, unique: true },
  language: {
    type: String,
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
    },
  ],
});

const Lemmas = mongoose.model("Lemmas", lemmaSchema);

export default Lemmas;
