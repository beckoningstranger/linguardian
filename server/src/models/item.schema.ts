import { model, Schema } from "mongoose";

import { ItemWithTranslationsAndLemmas } from "@/lib/schemas";
import { supportedLanguageCodes } from "@/lib/siteSettings";

const translationFields = supportedLanguageCodes.reduce((acc, lang) => {
  acc[lang] = [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ];
  return acc;
}, {} as Record<string, any>);

const mongooseItemSchema = new Schema<ItemWithTranslationsAndLemmas>(
  {
    id: { type: String, required: true, unique: true },
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
      type: String,
    },
    translations: translationFields,
    context: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
        takenFrom: { type: String },
      },
    ],
    gender: {
      type: String,
    },
    pluralForm: {
      type: [String],
    },
    grammaticalCase: {
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
    flags: { type: [String] },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

export default model<ItemWithTranslationsAndLemmas>("Item", mongooseItemSchema);
