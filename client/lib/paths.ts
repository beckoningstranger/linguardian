import { LearningMode, SupportedLanguage } from "./types";

const paths = {
  rootPath: () => "/",
  welcomePath: () => "/welcome",
  dashboardLanguagePath: (language: SupportedLanguage) =>
    `/${language}/dashboard`,
  dictionaryPath: () => `/dictionary`,
  dictionaryItemPath: (slug: string) => `/dictionary/${slug}`,
  editDictionaryItemPath: (slug: string) => `/dictionary/edit/${slug}`,
  learnListPath: (mode: LearningMode, listId: number) =>
    `/learn/${mode}/${listId}`,
  learnUnitPath: (mode: LearningMode, listId: number, unitNumber: number) =>
    `/learn/${mode}/${listId}/${unitNumber}`,
  listsLanguagePath: (language: SupportedLanguage) => `/${language}/lists`,
  listDetailsPath: (listNumber: number) => `/lists/${listNumber}`,
  newListPath: (language: SupportedLanguage) => `/${language}/lists/new`,
  unitDetailsPath: (listNumber: number, unitNumber: number) =>
    `/lists/${listNumber}/${unitNumber}`,
  uploadListPath: () => "/lists/new",
  socialPath: () => `/social`,
  aboutPath: () => `/about`,
  learnNewLanguagePath: () => `/newLanguage`,
  profilePath: (usernameSlug: string) => `/profile/${usernameSlug}`,
  settingsPath: () => `/settings`,
  signInPath: () => `/signIn`,
  registerPath: () => `/register`,
};

export default paths;
