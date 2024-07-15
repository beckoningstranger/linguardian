import { model, Schema } from "mongoose";
import { GlobalSettings } from "../lib/types.js";

const settingsSchema = new Schema<GlobalSettings>({
  supportedLanguages: {
    type: [String],
  },
  learningModes: {
    type: [String],
  },
  languageFeatures: [
    {
      langName: String,
      langCode: String,
      flagCode: String,
      requiresHelperKeys: [String],
      hasGender: [String],
      hasCases: [String],
      ipa: {
        help: String,
        consonants: [String],
        vowels: [String],
        dipthongs: [String],
        rare: [String],
        helperSymbols: [String],
      },
      hasRomanization: Boolean,
      hasTones: Boolean,
      partsOfSpeech: [String],
    },
  ],
  defaultSRSettings: {
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
});

export default model<GlobalSettings>("Settings", settingsSchema);
