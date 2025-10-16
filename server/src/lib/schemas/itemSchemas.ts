import { z } from "zod";

import {
  objectIdStringArraySchema,
  supportedLanguageSchema,
  translationsSchema,
} from "@/lib/contracts";
import {
  coreItemSchema,
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

// This is what we validate before we write to the db...
export const itemToSubmitSchema = coreItemSchema.extend({
  _id: objectIdSchema,
  lemmas: objectIdArraySchema,
  translations: translationsAsObjectIdsSchema,
});

// ...when we then pull it out again, it looks like this:
export const itemSchemaWithTranslationsAndLemmas = coreItemSchema.extend({
  lemmas: objectIdStringArraySchema,
  translations: translationsSchema,
});

export const parsedItemSpecificSchema = z.object({
  lemmas: objectIdArraySchema.optional(),
  translations: parsedTranslationsSchema,
  unit: z
    .string()
    .max(50, "Unit names cannot be longer than 50 characters")
    .optional(),
});

export const parsedItemSchema = coreItemSchema
  .omit({ id: true, normalizedName: true, slug: true })
  .merge(parsedItemSpecificSchema);

/** ----------- Types ----------- */

export type ParsedItem = z.infer<typeof parsedItemSchema>;
export type ItemWithTranslationsAndLemmas = z.infer<
  typeof itemSchemaWithTranslationsAndLemmas
>;
export type ItemToSubmit = z.infer<typeof itemToSubmitSchema>;
export type TranslationsAsObjectIds = z.infer<
  typeof translationsAsObjectIdsSchema
>;
