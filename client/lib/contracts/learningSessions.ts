import { z } from "zod";

import {
  languageFeaturesSchema,
  learningModeSchema,
  objectIdStringSchema,
  supportedLanguageSchema,
} from "@/lib/contracts/common";
import { itemSchemaWithPopulatedTranslations } from "@/lib/contracts/items";
import { allSecondaryReviewModes } from "@/lib/siteSettings";

export const itemForServerSchema = z.object({
  id: objectIdStringSchema,
  increaseLevel: z.boolean(),
});

export const itemToLearnSchema = itemSchemaWithPopulatedTranslations.extend({
  learningStep: z.number(),
  increaseLevel: z.boolean(),
});

export const puzzlePieceObjectSchema = z.object({
  position: z.number(),
  content: z.string(),
  first: z.boolean(),
  last: z.boolean(),
  used: z.boolean(),
});

export const secondaryReviewModeSchema = z.enum(allSecondaryReviewModes);
export const itemPlusLearningInfoSchema =
  itemSchemaWithPopulatedTranslations.extend({
    learned: z.boolean(),
    nextReview: z.number().optional(),
    level: z.number().optional(),
  });

export const fetchLearningSessionParamsSchema = z.object({
  listNumber: z.number(),
  unitNumber: z.number().optional(),
  mode: learningModeSchema,
});

export const learningSessionDataSchema = z.object({
  targetLanguageFeatures: languageFeaturesSchema,
  listName: z.string(),
  allItemStringsInList: z.array(z.string()),
  items: z.array(itemToLearnSchema),
});

export const learningDataUpdateSchema = z.object({
  items: z.array(itemForServerSchema),
  mode: learningModeSchema,
  language: supportedLanguageSchema,
});

/** ----------- Types ----------- */
export type ItemForServer = z.infer<typeof itemForServerSchema>;
export type ItemToLearn = z.infer<typeof itemToLearnSchema>;
export type PuzzlePieceObject = z.infer<typeof puzzlePieceObjectSchema>;
export type SecondaryReviewMode = z.infer<typeof secondaryReviewModeSchema>;
export type ItemPlusLearningInfo = z.infer<typeof itemPlusLearningInfoSchema>;
export type FetchLearningSessionParams = z.infer<
  typeof fetchLearningSessionParamsSchema
>;
export type LearningSessionData = z.infer<typeof learningSessionDataSchema>;
export type LearningDataUpdate = z.infer<typeof learningDataUpdateSchema>;
