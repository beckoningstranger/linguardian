import { z } from "zod";

import { regexRules } from "@/lib/regexRules";
import {
  allCases,
  allFlags,
  allGenders,
  allLearningModes,
  allPartsOfSpeech,
  allTags,
  supportedLanguageCodes,
} from "@/lib/siteSettings";

/** ----------- Shared between lists and items ----------- */
export const unitNameSchema = z
  .string()
  .min(1, "Unit names can not be empty")
  .max(50, "Unit names can be no longer than 50 characters");

/** ----------- Shared between user and auth ----------- */
export const emailSchema = z
  .string()
  .email("A valid email is e.g. johndoe@email.com")
  .min(7, "Emails must have at least 7 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number");
// .regex(
//   /[^a-zA-Z0-9]/,
//   "Password must contain at least one special character"
// );

export const learningModeSchema = z.enum(allLearningModes);
/** ----------- Shared between items and lists ----------- */
export const flagSchema = z.enum(allFlags);

/** ----------- Shared language related schemas ----------- */
export const supportedLanguageSchema = z.enum(supportedLanguageCodes);

export const languageWithFlagAndNameSchema = z.object({
  code: supportedLanguageSchema,
  flag: z.string(),
  name: z.string(),
});

export const tagSchema = z.enum(allTags);
export const genderSchema = z.enum(allGenders);
export const partOfSpeechSchema = z.enum(allPartsOfSpeech);
export const grammaticalCaseSchema = z.enum(allCases);

export const IPASchema = z.object({
  help: z.string(),
  consonants: z.array(z.string()),
  vowels: z.array(z.string()),
  rare: z.array(z.string()).optional(),
  helperSymbols: z.array(z.string()),
});

export const sortedTagsSchema = z
  .object({
    forAll: z.array(tagSchema),
  })
  .catchall(z.array(tagSchema));

export const languageFeaturesSchema = z.object({
  langName: z.string(),
  langCode: supportedLanguageSchema,
  flagCode: z.string(),
  requiresHelperKeys: z.array(z.string()),
  hasGender: z.boolean(),
  genders: z.array(genderSchema),
  hasCases: z.boolean(),
  cases: z.array(grammaticalCaseSchema),
  hasRomanization: z.boolean(),
  hasTones: z.boolean(),
  tones: z.array(z.string()),
  ipa: IPASchema,
  partsOfSpeech: z.array(partOfSpeechSchema).readonly(),
  tags: sortedTagsSchema,
});

export const objectIdStringSchema = z
  .string()
  .regex(regexRules.hexString24.pattern, regexRules.hexString24.message);

/* This is used to validate data coming from the database. 
Since we always use .lean(), these objectIds will be plain strings. */
export const objectIdStringArraySchema = z.array(objectIdStringSchema);

/** ----------- Types ----------- */

export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;
export type LanguageWithFlagAndName = z.infer<
  typeof languageWithFlagAndNameSchema
>;
export type Tag = z.infer<typeof tagSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>;
export type GrammaticalCase = z.infer<typeof grammaticalCaseSchema>;
export type IPA = z.infer<typeof IPASchema>;
export type SortedTags = z.infer<typeof sortedTagsSchema>;
export type LanguageFeatures = z.infer<typeof languageFeaturesSchema>;
export type Flag = z.infer<typeof flagSchema>;
export type ObjectIdStringArray = z.infer<typeof objectIdStringArraySchema>;
