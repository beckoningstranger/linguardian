import { LearningMode, SupportedLanguage } from "./types";

const paths = {
  landingPagePath() {
    return "/";
  },
  dashboardPath() {
    return "/dashboard";
  },
  dashboardLanguagePath(language: SupportedLanguage) {
    return `/dashboard?lang=${language}`;
  },
  dictionaryPath() {},
  dictionaryLanguagePath(language: SupportedLanguage) {
    return `/dictionary/${language}`;
  },
  learnPath(mode: LearningMode | "spinner", listId: number) {
    return `/learn/${mode}/${listId}`;
  },
  listsLanguagePath(language: SupportedLanguage) {
    return `/lists?lang=${language}`;
  },
  listsPath() {
    return `/lists`;
  },

  listDetailsPath(listNumber: number) {
    return `/lists/${listNumber}`;
  },
  unitDetailsPath(listNumber: number, unitNumber: number) {
    return `/lists/${listNumber}/${unitNumber}`;
  },
  uploadListPath() {
    return "/lists/new";
  },
  socialPath() {
    return `/social`;
  },
  aboutPath() {
    return `/about`;
  },
  newLanguagePath() {
    return `/languages/new`;
  },
  profilePath() {
    return `/profile`;
  },
  settingsPath() {
    return `/settings`;
  },
};

export default paths;
