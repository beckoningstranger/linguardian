import { LearningMode, SupportedLanguage } from "@linguardian/shared/contracts";

const paths = {
  aboutPath: () => `/about`,
  dashboardLanguagePath: (language: SupportedLanguage) =>
    `/dashboard/${language}`,
  dictionaryPath: () => `/dictionary`,
  dictionaryItemPath: (slug: string) => `/dictionary/${slug}`,
  addItemToDictionaryPath: (
    initialName: string,
    listNumber?: number,
    unitNumber?: number,
    unitName?: string,
    listLanguage?: SupportedLanguage
  ) => {
    return listNumber && unitNumber && listLanguage && unitName
      ? `/dictionary/addNewItemToList?initialName=${initialName}&addToList=${listNumber}&addToUnit=${unitNumber}&unitName=${unitName}&listLanguage=${listLanguage}`
      : `/dictionary/new?initialName=${initialName}`;
  },
  editDictionaryItemPath: (slug: string) => `/dictionary/edit/${slug}`,
  editListPath: (listNumber: number) => `/lists/${listNumber}/edit`,
  editUnitPath: (listNumber: number, unitNumber: number) =>
    `/lists/${listNumber}/${unitNumber}/edit`,
  learnListPath: (mode: LearningMode, listId: number) =>
    `/learningSession/${mode}/${listId}`,
  learnNewLanguagePath: () => `/newLanguage`,
  learnUnitPath: (mode: LearningMode, listId: number, unitNumber: number) =>
    `/learningSession/${mode}/${listId}/${unitNumber}`,
  reviewLanguagePath: (mode: LearningMode, langCode: SupportedLanguage) =>
    `/learningSession/${mode}/all/${langCode}`,
  listStorePath: (language: SupportedLanguage) => `/listStore/${language}`,
  listDetailsPath: (listNumber: number) => `/lists/${listNumber}`,
  newListPath: (language: SupportedLanguage) => `/listStore/${language}/new`,
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
