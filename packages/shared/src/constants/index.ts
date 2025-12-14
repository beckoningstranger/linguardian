// Shared constants
export * from "./siteSettings";
export * from "./regexRules";

// Explicitly re-export commonly used exports to ensure they're available via module resolution
export {
    supportedLanguageCodes,
    allSupportedLanguages,
    allLanguageFeatures,
    defaultSRSettings,
    allLearningModes,
} from "./siteSettings";
