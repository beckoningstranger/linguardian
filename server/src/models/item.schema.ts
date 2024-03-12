import { model, Schema } from "mongoose";
import { Item } from "../types.js";

const itemSchema = new Schema<Item>({
  name: {
    type: String,
    required: true,
  },
  language: {
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
    type: String,
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
    type: [String],
  },
  pluralForm: {
    type: [String],
  },
  case: {
    type: [String],
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
  tags: [
    {
      type: [String],
    },
  ],
  frequency: {
    type: String,
  },
  collocations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ],
});

export default model<Item>("Item", itemSchema);
