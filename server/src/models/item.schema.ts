import { model, Schema } from "mongoose";
import { Item } from "../lib/types.js";

const itemSchema = new Schema<Item>({
  name: {
    type: String,
    required: true,
  },
  normalizedName: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  language: {
    type: String,
    required: true,
  },
  languageName: {
    type: String,
    required: true,
  },
  flagCode: {
    type: String,
    required: true,
  },
  partOfSpeech: {
    type: String,
    required: true,
  },
  lemmas: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lemma",
      required: true,
    },
  ],
  definition: {
    type: [String],
  },
  translations: {
    DE: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    EN: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    FR: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    CN: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  gender: {
    type: String,
  },
  pluralForm: {
    type: [String],
  },
  case: {
    type: String,
  },
  audio: {
    type: [String],
  },
  pics: {
    type: [String],
  },
  vids: {
    type: [String],
  },
  IPA: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  relevance: {
    type: [Schema.Types.ObjectId],
  },
  collocations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

export default model<Item>("Item", itemSchema);
