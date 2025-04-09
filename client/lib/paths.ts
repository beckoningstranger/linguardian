import { LearningMode, SupportedLanguage } from "./types";

const paths = {
  aboutPath: () => `/about`,
  dashboardLanguagePath: (language: SupportedLanguage) =>
    `/${language}/dashboard`,
  dictionaryPath: () => `/dictionary`,
  dictionaryItemPath: (slug: string) => `/dictionary/${slug}`,
  editDictionaryItemPath: (slug: string) => `/dictionary/edit/${slug}`,
  editListPath: (listNumber: number) => `/lists/${listNumber}/edit`,
  editUnitPath: (listNumber: number, unitNumber: number) =>
    `/lists/${listNumber}/${unitNumber}/edit`,
  learnListPath: (mode: LearningMode, listId: number) =>
    `/learn/${mode}/${listId}`,
  learnNewLanguagePath: () => `/newLanguage`,
  learnUnitPath: (mode: LearningMode, listId: number, unitNumber: number) =>
    `/learn/${mode}/${listId}/${unitNumber}`,
  listsLanguagePath: (language: SupportedLanguage) => `/${language}/lists`,
  listDetailsPath: (listNumber: number) => `/lists/${listNumber}`,
  newListPath: (language: SupportedLanguage) => `/${language}/lists/new`,
  profilePath: (usernameSlug: string) => `/profile/${usernameSlug}`,
  registerPath: () => `/register`,
  rootPath: () => "/",
  settingsPath: () => `/settings`,
  signInPath: () => `/signIn`,
  socialPath: () => `/social`,
  unitDetailsPath: (listNumber: number, unitNumber: number) =>
    `/lists/${listNumber}/${unitNumber}`,
  uploadListPath: () => "/lists/new",
  welcomePath: () => "/welcome",
};

export default paths;
