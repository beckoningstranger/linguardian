// These are shared contracts between frontend and backend.

export * from "./auth";
export * from "./common";
export * from "./dashboard";
export * from "./items";
export * from "./learningSessions";
export * from "./lists";
export * from "./users";
export * from "./api";

export type * from "./auth";
export type * from "./common";
export type * from "./dashboard";
export type * from "./items";
export type * from "./learningSessions";
export type * from "./lists";
export type * from "./users";
export type * from "./api";

// Explicitly re-export commonly used exports to ensure they're available via module resolution
// This is needed because export * doesn't work reliably in Docker/Node.js runtime environments
export {
    oAuthProviders,
    OAuthProviderSchema,
    LoginMethodSchema,
    signinWithEmailSchema,
    registrationDataSchema,
    jwtPayLoadSchema,
    loginUserParamsSchema,
} from "./auth";
export {
    supportedLanguageSchema,
    languageWithFlagAndNameSchema,
    emailSchema,
    passwordSchema,
    learningModeSchema,
    tagSchema,
    flagSchema,
    objectIdStringSchema,
    objectIdStringArraySchema,
    partOfSpeechSchema,
    grammaticalCaseSchema,
    genderSchema,
    unitNameSchema,
} from "./common";
export {
    contextItemSchema,
    parsedTranslationsSchema,
    translationsSchema,
    promptHelpersSchema,
    alternativeAnswersSchema,
    coreItemSchema,
    itemSchemaWithTranslations,
    itemSchemaWithPopulatedTranslations,
} from "./items";
export {
    usernameSchema,
    userRoleSchema,
    learnedListsSchema,
    learnedItemsSchema,
    ignoredItemsSchema,
    customSRSettingsSchema,
    userSchema,
    sessionUserSchema,
    userSchemaWithEmail,
    updateUserSchema,
    recentDictionarySearchSchema,
} from "./users";
export {
    listDifficultySchema,
    listAuthorsSchema,
    listSchema,
    populatedListSchema,
    fullyPopulatedListSchema,
    listForDashboardSchema,
    listForListStoreSchema,
    unitOrderUpdateSchema,
    unitNameUpdateSchema,
    addUnitUpdateSchema,
    addItemToUnitUpdateSchema,
    createNewListFormSchema,
    expandListFormSchema,
    listStatusSchema,
    unitInformationSchema,
    listOverviewDataParamsSchema,
    listOverviewDataSchema,
    editListPageDataParamsSchema,
    editListPageDataSchema,
    unitDataParamsSchema,
    unitOverviewDataSchema,
    editUnitDataSchema,
    listStoreDataParamsSchema,
    listStoreDataSchema,
    parseResultSchema,
    createListSuccessResponseSchema,
} from "./lists";
export {
    itemToLearnSchema,
    fetchLearningSessionForListOrUnitParamsSchema,
    fetchLearningSessionForLanguageParamsSchema,
    learningSessionDataSchema,
    learningDataUpdateSchema,
} from "./learningSessions";
export { dashboardDataParamsSchema, dashboardDataSchema } from "./dashboard";
export {
    apiErrorSchema,
    messageResponseSchema,
    messageWithItemInfoResponseSchema,
    messageWithSlugResponseSchema,
} from "./api";
