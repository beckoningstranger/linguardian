import { z } from "zod";

import {
  emailSchema,
  languageWithFlagAndNameSchema,
  objectIdStringSchema,
  supportedLanguageSchema,
} from "../contracts/common";
import { regexRules } from "../constants/regexRules";
import { allUserRoles } from "../constants/siteSettings";

const isTakenModeOptions = ["email", "username", "usernameSlug"] as const;
export const isTakenModeSchema = z.enum(isTakenModeOptions);
export const isTakenParamsSchema = z.object({
  mode: isTakenModeSchema,
  value: z.string(),
});

/** ----------- User Schema ----------- */
export const learnedItemSchema = z.object({
  id: objectIdStringSchema,
  level: z.number(),
  nextReview: z.number(),
});

export const SRSettingsSchema = z.object({
  reviewTimes: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
    5: z.number(),
    6: z.number(),
    7: z.number(),
    8: z.number(),
    9: z.number(),
    10: z.number(),
  }),
  itemsPerSession: z.object({
    learning: z.number(),
    reviewing: z.number(),
  }),
});

export const learnedListsSchema = z.record(
  supportedLanguageSchema,
  z.array(z.number())
);

export const learnedItemsSchema = z.record(
  supportedLanguageSchema,
  z.array(learnedItemSchema)
);

export const ignoredItemsSchema = z.record(
  supportedLanguageSchema,
  z.array(objectIdStringSchema)
);

export const customSRSettingsSchema = z.record(
  supportedLanguageSchema,
  SRSettingsSchema
);

export const usernameSchema = z
  .string()
  .max(24, "Usernames can be at most 24 characters")
  .min(5, "Usernames must be at least 5 characters long")
  .regex(regexRules.username.pattern, regexRules.username.message);

export const userRoleSchema = z.array(z.enum(allUserRoles));

export const recentDictionarySearchSchema = z.object({
  itemId: objectIdStringSchema,
  dateSearched: z.string().datetime(),
});

export const userSchema = z.object({
  id: objectIdStringSchema,
  username: usernameSchema,
  usernameSlug: z.string(),
  completedOnboarding: z.boolean(),
  image: z.string(),
  native: languageWithFlagAndNameSchema,
  learnedLanguages: z.array(languageWithFlagAndNameSchema),
  learnedLists: learnedListsSchema,
  learnedItems: learnedItemsSchema,
  ignoredItems: ignoredItemsSchema,
  customSRSettings: customSRSettingsSchema,
  recentDictionarySearches: z.array(recentDictionarySearchSchema),
  activeLanguageAndFlag: languageWithFlagAndNameSchema,
  roles: userRoleSchema,
});

export const sessionUserSchema = userSchema.pick({
  id: true,
});

export const userSchemaWithEmail = userSchema.extend({
  email: emailSchema,
});

export const updateUserSchema = userSchema
  .partial()
  .extend({ id: objectIdStringSchema });

/** ----------- Profile Page ----------- */
export const ProfileDataParamsSchema = z.object({});
export const ProfileDataSchema = z.object({});

/** ----------- Types ----------- */
export type LearnedItem = z.infer<typeof learnedItemSchema>;
export type SRSettings = z.infer<typeof SRSettingsSchema>;

export type RecentDictionarySearch = z.infer<
  typeof recentDictionarySearchSchema
>;
export type LearnedLists = z.infer<typeof learnedListsSchema>;
export type LearnedItems = z.infer<typeof learnedItemsSchema>;
export type IgnoredItems = z.infer<typeof ignoredItemsSchema>;
export type CustomSRSettings = z.infer<typeof customSRSettingsSchema>;
export type UserWithEmail = z.infer<typeof userSchemaWithEmail>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Email = z.infer<typeof emailSchema>;
export type IsTakenMode = z.infer<typeof isTakenModeSchema>;
export type IsTakenParams = z.infer<typeof isTakenParamsSchema>;
export type ProfileData = z.infer<typeof ProfileDataSchema>;
export type ProfileDataParamsSchema = z.infer<typeof ProfileDataParamsSchema>;

/** ----------- Additional Types that are not inferred----------- */
