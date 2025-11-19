import { z } from "zod";

import { supportedLanguageSchema } from "@/lib/contracts";
import {
  coreItemSchema,
  itemSchemaWithPopulatedTranslations,
  parsedTranslationsSchema,
} from "@/lib/contracts/items";
import {
  objectIdArraySchema,
  objectIdSchema,
} from "@/lib/schemas/commonSchemas";

export const translationsAsObjectIdsSchema = z.record(
  supportedLanguageSchema,
  objectIdArraySchema
);

// This is what we validate and write to the db
export const dbItemSchema = coreItemSchema.extend({
  _id: objectIdSchema,
  lemmas: objectIdArraySchema,
  translations: translationsAsObjectIdsSchema,
  importBatch: z.string().nullable().optional(),
});

// This is the data we parse from CSV files
export const parsedItemSpecificSchema = z.object({
  lemmas: objectIdArraySchema.optional(),
  translations: parsedTranslationsSchema,
  unit: z.string().max(50, "Unit names cannot be longer than 50 characters"),
});

// We need this because at the time when we receive this, we don't have id, normalizedName and slug yet
export const newItemSchema = itemSchemaWithPopulatedTranslations.omit({
  id: true,
  normalizedName: true,
  slug: true,
});

export const parsedItemSchema = coreItemSchema
  .omit({ id: true, normalizedName: true, slug: true })
  .merge(parsedItemSpecificSchema);

/** ----------- Types ----------- */

export type ParsedItem = z.infer<typeof parsedItemSchema>;
export type DbItem = z.infer<typeof dbItemSchema>;
export type TranslationsAsObjectIds = z.infer<
  typeof translationsAsObjectIdsSchema
>;
export type NewItem = z.infer<typeof newItemSchema>;
