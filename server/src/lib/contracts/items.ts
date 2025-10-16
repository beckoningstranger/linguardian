import { z } from "zod";

import {
  flagSchema,
  genderSchema,
  grammaticalCaseSchema,
  objectIdStringArraySchema,
  objectIdStringSchema,
  partOfSpeechSchema,
  supportedLanguageSchema,
  tagSchema,
  unitNameSchema,
} from "@/lib/contracts/common";
import { regexRules } from "@/lib/regexRules";

export const contextItemSchema = z.object({
  text: z
    .string()
    .regex(
      regexRules.sentence.pattern,
      regexRules.sentence.message + " for context items"
    )
    .min(25, "Context items should be at least 25 characters long")
    .max(150, "Context items can be no longer than 150 characters"),
  author: z.string(),
  takenFrom: z
    .string()
    .regex(
      new RegExp(
        regexRules.sentence.pattern.source.replace("+", "*"),
        regexRules.sentence.pattern.flags
      ), // the above to allow empty string
      regexRules.sentence.message + " for context sources"
    )
    .max(50, "If you provide a source, make it 50 characters or shorter")
    .optional(),
});

export const parsedTranslationsSchema = z.record(
  supportedLanguageSchema,
  z.array(z.string())
);

export const translationsSchema = z.record(
  supportedLanguageSchema,
  objectIdStringArraySchema
);

export const coreItemSchema = z.object({
  id: z.union([objectIdStringSchema, z.literal("newItem")]),
  name: z
    .string()
    .nonempty("Please enter an item name")
    .regex(regexRules.sentence.pattern, regexRules.sentence.message)
    .max(60, "Item names can be no longer than 60 characters"),
  normalizedName: z.string().max(60),
  language: supportedLanguageSchema,
  languageName: z.string(),
  flagCode: z.string(),
  partOfSpeech: partOfSpeechSchema,
  definition: z
    .string()
    .regex(regexRules.sentence.pattern, regexRules.sentence.message)
    .max(300, "Item definitions can be no longer than 250 characters")
    .optional()
    .refine((val) => val === undefined || val.length >= 25, {
      message: "Item definitions should be at least 25 characters long",
    }),
  gender: genderSchema.optional(),
  pluralForm: z
    .array(
      z
        .string()
        .max(65, "Plural forms can be no longer than 65 characters")
        .regex(regexRules.sentence.pattern, regexRules.sentence.message)
    )
    .max(2, "There can be no more than 2 different plural forms")
    .optional(),
  slug: z.string().max(65),
  grammaticalCase: grammaticalCaseSchema.optional(),
  audio: z
    .array(
      z
        .string()
        .max(80, "URLs to audio files can be no longer than 80 characters")
    )
    .optional(),
  pics: z
    .array(
      z
        .string()
        .max(80, "URLs to image files can be no longer than 80 characters")
    )
    .optional(),
  vids: z
    .array(
      z
        .string()
        .max(80, "URLs to video files can be no longer than 80 characters")
    )
    .optional(),
  IPA: z
    .array(
      z
        .string()
        .regex(regexRules.ipa.pattern, regexRules.ipa.message)
        .max(50, "IPA transcriptions can be no longer than 50 characters")
    )
    .optional(),
  tags: tagSchema
    .array()
    .max(5, "Each item can receive a maximum of 5 tags")
    .optional(),
  context: z.array(contextItemSchema).optional(),
  flags: z.array(flagSchema).optional(),
});

export const itemSchemaWithTranslations = coreItemSchema.extend({
  translations: translationsSchema,
});

export const populatedTranslationsSchema = z.record(
  supportedLanguageSchema,
  z.array(itemSchemaWithTranslations)
);

export const itemSchemaWithPopulatedTranslations = coreItemSchema.extend({
  translations: populatedTranslationsSchema,
});

export const newItemSchema = itemSchemaWithPopulatedTranslations.omit({
  id: true,
  normalizedName: true,
  slug: true,
});

/** ----------- Fetching Items ----------- */

export const fetchItemIdBySlugParamsSchema = z.object({ itemSlug: z.string() });
export const fetchItemByIdParamsSchema = z.object({ id: objectIdStringSchema });

export const itemIdResponseSchema = z.string();
export const itemDataSchema = itemSchemaWithPopulatedTranslations;

/** ----------- Creating and Editing Items ----------- */
export const createItemParamsSchema = z.object({
  item: itemSchemaWithPopulatedTranslations,
  listNumber: z.number().optional(),
  unitName: unitNameSchema.optional(),
});

export const itemUpdateSchema = z.object({
  info: z.object({
    name: z.string(),
    partOfSpeech: partOfSpeechSchema,
    language: supportedLanguageSchema,
  }),
  set: itemSchemaWithPopulatedTranslations.partial(),
  unset: z.array(z.string()),
});

/** ----------- Searching the dictionary ----------- */
export const searchDictionaryParamsSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
  languages: z
    .array(supportedLanguageSchema)
    .nonempty("At least one valid language must be provided"),
});

/** ----------- Learning Session Item Page ----------- */

/** ----------- Types ----------- */
export type Item = z.infer<typeof itemSchemaWithTranslations>;
export type ItemWithPopulatedTranslations = z.infer<
  typeof itemSchemaWithPopulatedTranslations
>;
export type ItemData = z.infer<typeof itemDataSchema>;
export type ItemIdResponse = z.infer<typeof itemIdResponseSchema>;

export type FetchItemIdBySlugParams = z.infer<
  typeof fetchItemIdBySlugParamsSchema
>;
export type FetchItemByIdParams = z.infer<typeof fetchItemByIdParamsSchema>;
export type CreateItemParams = z.infer<typeof createItemParamsSchema>;
export type ItemUpdate = z.infer<typeof itemUpdateSchema>;
export type PopulatedTranslations = z.infer<typeof populatedTranslationsSchema>;
export type ContextItem = z.infer<typeof contextItemSchema>;
export type ParsedTranslations = z.infer<typeof parsedTranslationsSchema>;
export type Translations = z.infer<typeof translationsSchema>;
export type SearchDictionaryParams = z.infer<
  typeof searchDictionaryParamsSchema
>;
export type NewItem = z.infer<typeof newItemSchema>;
