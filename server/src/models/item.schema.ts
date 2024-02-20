import mongoose from "mongoose";
import { Item } from "../types";

const itemsSchema = new mongoose.Schema<Item>({
  name: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  partOfSpeech: {
    type: String,
    required: true,
  },
  lemma: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lemmas",
      required: true,
    },
  ],
  definition: {
    DE: {
      type: String,
    },
    EN: {
      type: String,
    },
    CN: {
      type: String,
    },
    FR: {
      type: String,
    },
  },
  translation: {
    DE: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Items",
    },
    EN: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Items",
    },
    FR: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Items",
    },
    CN: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Items",
    },
  },
  gender: {
    type: String,
  },
  pluralForm: {
    type: String,
  },
  case: {
    type: String,
  },
  audio: {
    type: String,
  },
  pics: {
    type: String,
  },
  vids: {
    type: String,
  },
  IPA: {
    type: String,
  },
  tags: {
    type: String,
  },
  frequency: {
    type: String,
  },
  featuresInList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lists",
      required: true,
    },
  ],
  collocations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
      required: true,
    },
  ],
});

const Items = mongoose.model("Items", itemsSchema);

export default Items;
