import { Schema } from "mongoose";
import { LanguageWithFlagAndName } from "../lib/types.js";

export const languageWithFlagAndNameSchema =
  new Schema<LanguageWithFlagAndName>({
    code: { type: String, required: true },
    flag: { type: String, required: true },
    name: { type: String, required: true },
  });
