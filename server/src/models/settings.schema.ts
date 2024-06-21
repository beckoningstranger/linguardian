import { GlobalSettings } from "../types.js";
import { model, Schema } from "mongoose";

const settingsSchema = new Schema<GlobalSettings>({
  supportedLanguages: {
    type: [String],
  },
  learningModes: {
    type: [String],
  },
  languageFeatures: [
    {
      langCode: { type: String },
      langName: { type: String },
      flagCode: { type: String },
      requiresHelperKeys: { type: [String] },
      hasGender: { type: [String] },
      hasCases: { type: [String] },
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
