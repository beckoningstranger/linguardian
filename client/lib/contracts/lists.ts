import { z } from "zod";

import {
  flagSchema,
  languageWithFlagAndNameSchema,
  learningModeSchema,
  objectIdStringSchema,
  supportedLanguageSchema,
  unitNameSchema,
} from "@/lib/contracts/common";
import {
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithTranslations,
} from "@/lib/contracts/items";
import { itemPlusLearningInfoSchema } from "@/lib/contracts/learningSessions";
import { learnedItemSchema } from "@/lib/contracts/users";
import { allListDifficulties, allListStatuses } from "@/lib/siteSettings";

/** ----------- List Schemas ----------- */
export const listDifficultySchema = z.enum(allListDifficulties);

export const populatedUnitSchema = z.object({
  unitName: unitNameSchema,
  item: itemSchemaWithTranslations,
});

export const fullyPopulatedUnitSchema = z.object({
  unitName: unitNameSchema,
  item: itemSchemaWithPopulatedTranslations,
});

export const authorDataSchema = z.object({
  username: z.string(),
  usernameSlug: z.string(),
});

export const learningModeWithInfoSchema = z.object({
  mode: learningModeSchema,
  info: z.string(),
  overstudy: z.boolean(),
  number: z.number(),
});

export const learningStatsSchema = z.object({
  readyToLearn: z.number(),
  readyForReview: z.number(), // due items
  learned: z.number(),
  learning: z.number(),
  ignored: z.number(),
  availableModesWithInfo: z.array(learningModeWithInfoSchema),
  recommendedModeWithInfo: learningModeWithInfoSchema,
  nextReviewDueMessage: z.string(),
});

export const unitItemSchema = z.object({
  unitName: unitNameSchema,
  item: objectIdStringSchema,
});

export const populatedUnitItemSchema = z.object({
  unitName: unitNameSchema,
  item: itemSchemaWithTranslations,
});

const listNameSchema = z
  .string()
  .min(8, "Please provide a descriptive list name")
  .max(55, "List names can be no longer than 55 characters");

const listDescriptionSchema = z
  .string()
  .max(500, "List descriptions can be no longer than 500 characters")
  .optional();

export const listAuthorsSchema = z.array(z.string()); // Array of user ids

export const listSchema = z.object({
  id: objectIdStringSchema,
  name: listNameSchema,
  listNumber: z.number(),
  language: languageWithFlagAndNameSchema,
  description: listDescriptionSchema,
  image: z.string().optional(),
  difficulty: listDifficultySchema,
  authors: listAuthorsSchema,
  private: z.boolean(),
  units: z.array(unitItemSchema),
  unitOrder: z.array(unitNameSchema), // Array of unit names
  learners: z.array(z.string()), // Array of user ids
  flags: z.array(flagSchema).optional(),
});

export const populatedListSchema = listSchema.extend({
  units: z.array(populatedUnitSchema),
});

export const fullyPopulatedListSchema = listSchema.extend({
  units: z.array(fullyPopulatedUnitSchema),
});

export const listForDashboardSchema = populatedListSchema.extend({
  learningStatsForUser: learningStatsSchema,
});

export const listForListStoreSchema = listSchema.extend({
  authorData: z.array(authorDataSchema),
});

export const unitOrderUpdateSchema = listSchema.pick({
  unitOrder: true,
});

export const unitNameUpdateSchema = z.object({
  oldName: z.string(),
  newName: z.string(),
});

export const addUnitUpdateSchema = z.object({
  unitName: unitNameSchema,
});

export const addItemToUnitUpdateSchema = z.object({
  unitName: unitNameSchema,
  itemId: objectIdStringSchema,
});

export const createNewListFormSchema = listSchema
  .pick({
    name: true,
    description: true,
    private: true,
    language: true,
    difficulty: true,
    authors: true,
  })
  .extend({
    csvfile: z
      .any()
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          (files[0] instanceof File && files[0].type === "text/csv"),
        "Please upload a valid CSV file"
      )
      .optional(),
  });

export const expandListFormSchema = z
  .object({ listNumber: z.number() })
  .extend({
    csvfile: z
      .any()
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          (files[0] instanceof File && files[0].type === "text/csv"),
        "Please upload a valid CSV file"
      )
      .optional(),
  });

export const listStatusSchema = z.enum(allListStatuses);

export const unitInformationSchema = z.array(
  z.object({
    unitName: unitNameSchema,
    noOfItems: z.number(),
    fillWidth: z.string(),
  })
);

/** ----------- CRUD functionality ----------- */

export const listDetailsUpdateSchema = listSchema.pick({
  name: true,
  description: true,
});

export const listUpdateSchema = listSchema.partial();

/** ----------- ListOverView Page ----------- */
export const listOverviewDataParamsSchema = z.object({
  listNumber: z.coerce.number(),
});

export const listOverviewDataSchema = z.object({
  listImage: z.string().optional(),
  listLanguage: languageWithFlagAndNameSchema,
  listDescription: listDescriptionSchema,
  listName: listNameSchema,
  learningStats: learningStatsSchema,
  userIsAuthor: z.boolean(),
  userIsLearningThisList: z.boolean(),
  userIsLearningListLanguage: z.boolean(),
  authorData: z.array(authorDataSchema),
  learnedItemIds: z.array(z.string()),
  ignoredItemIds: z.array(z.string()),
  unitInformation: unitInformationSchema,
  listStatus: listStatusSchema,
});

/** ----------- Edit List Page ----------- */
export const editListPageDataParamsSchema = z.object({
  listNumber: z.coerce.number(),
});

export const editListPageDataSchema = z.object({
  listImage: z.string().optional(),
  listLanguage: languageWithFlagAndNameSchema,
  listDescription: listDescriptionSchema,
  listName: listNameSchema,
  userIsAuthor: z.boolean(),
  authorData: z.array(authorDataSchema),
  learnedItemIds: z.array(z.string()),
  unitOrder: z.array(z.string()),
  unitInformation: unitInformationSchema,
});

/** ----------- UnitOverview and Edit Unit Page----------- */
export const unitDataParamsSchema = z.object({
  listNumber: z.coerce.number(),
  unitNumber: z.coerce.number(),
});
export const unitOverviewDataSchema = z.object({
  listName: listNameSchema,
  listLanguage: languageWithFlagAndNameSchema,
  unitItems: z.array(itemSchemaWithPopulatedTranslations),
  itemsPlusLearningInfo: z.array(itemPlusLearningInfoSchema),
  userNativeCode: supportedLanguageSchema,
  userIsLearningThisList: z.boolean(),
  userIsAuthor: z.boolean(),
  unitName: unitNameSchema,
  learnedItems: z.array(learnedItemSchema),
  ignoredItemIds: z.array(z.string()),
  learningStats: learningStatsSchema,
  unitOrder: z.array(z.string()),
});

export const editUnitDataSchema = z.object({
  unitOrder: z.array(z.string()),
  unitName: unitNameSchema,
  unitItems: z.array(itemSchemaWithPopulatedTranslations),
  itemsPlusLearningInfo: z.array(itemPlusLearningInfoSchema),
  userNativeCode: supportedLanguageSchema,
  userIsLearningThisList: z.boolean(),
  userIsAuthor: z.boolean(),
  listName: z.string(),
  listLanguage: languageWithFlagAndNameSchema,
});

/** ----------- List Store ----------- */
export const listStoreDataParamsSchema = z.object({
  language: supportedLanguageSchema,
});

export const listStoreDataSchema = z.object({
  allListsForLanguage: z.array(listForListStoreSchema),
});

/** ----------- New List Page ----------- */
export const parseResultSchema = z.object({
  row: z.number(),
  name: z.string(),
  status: z.union([
    z.literal("success"),
    z.literal("error"),
    z.literal("duplicate"),
    z.literal("addedExisting"),
  ]),
  message: z.string(),
});

export const createListSuccessResponseSchema = z.object({
  listNumber: z.number(),
  listLanguage: supportedLanguageSchema,
  results: z.array(parseResultSchema),
  message: z.string(),
});

/** ----------- Types ----------- */
export type ListOverviewDataParams = z.infer<
  typeof listOverviewDataParamsSchema
>;
export type ListOverviewData = z.infer<typeof listOverviewDataSchema>;
export type EditListPageDataParams = z.infer<
  typeof editListPageDataParamsSchema
>;
export type EditListPageData = z.infer<typeof editListPageDataSchema>;
export type UnitOverviewData = z.infer<typeof unitOverviewDataSchema>;
export type UnitDataParams = z.infer<typeof unitDataParamsSchema>;
export type EditUnitData = z.infer<typeof editUnitDataSchema>;
export type ListStoreDataParams = z.infer<typeof listStoreDataParamsSchema>;
export type ListStoreData = z.infer<typeof listStoreDataSchema>;
export type CreateListSuccessResponse = z.infer<
  typeof createListSuccessResponseSchema
>;
export type LearningMode = z.infer<typeof learningModeSchema>;
export type ListDifficulty = z.infer<typeof listDifficultySchema>;
export type List = z.infer<typeof listSchema>;
export type PopulatedList = z.infer<typeof populatedListSchema>;
export type FullyPopulatedList = z.infer<typeof fullyPopulatedListSchema>;
export type CreateNewListForm = z.infer<typeof createNewListFormSchema>;
export type ExpandListForm = z.infer<typeof expandListFormSchema>;
export type LearningModeWithInfo = z.infer<typeof learningModeWithInfoSchema>;
export type LearningStats = z.infer<typeof learningStatsSchema>; // used for charts and learning buttons
export type ListStatus = z.infer<typeof listStatusSchema>; // for recommending learning modes to users
export type AuthorData = z.infer<typeof authorDataSchema>; // one author's username and usernameSlug
export type ListForDashboard = z.infer<typeof listForDashboardSchema>;
export type ListForListStore = z.infer<typeof listForListStoreSchema>;
export type ListDetailsUpdate = z.infer<typeof listDetailsUpdateSchema>;
export type UnitItem = z.infer<typeof unitItemSchema>;
export type PopulatedUnitItem = z.infer<typeof populatedUnitItemSchema>;
export type UnitInformation = z.infer<typeof unitInformationSchema>;
export type UnitOrderUpdate = z.infer<typeof unitOrderUpdateSchema>;
export type UnitNameUpdate = z.infer<typeof unitNameUpdateSchema>;
export type AddUnitUpdate = z.infer<typeof addUnitUpdateSchema>;
export type AddItemToUnitUpdate = z.infer<typeof addItemToUnitUpdateSchema>;
export type ListUpdate = z.infer<typeof listUpdateSchema>;
export type ListAuthors = z.infer<typeof listAuthorsSchema>;
export type ParseResult = z.infer<typeof parseResultSchema>;
