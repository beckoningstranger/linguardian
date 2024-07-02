import { LearningMode, SupportedLanguage } from "./types";

const paths = {
  rootPath() {
    return "/";
  },
  welcomePath() {
    return "/welcome";
  },
  dashboardLanguagePath(language: SupportedLanguage) {
    return `/${language}/dashboard`;
  },
  dictionaryPath() {
    return `/dictionary`;
  },
  dictionaryItemPath(language: SupportedLanguage, slug: string) {
    return `/dictionary/${language}/${slug}`;
  },
  editDictionaryItemPath(language: SupportedLanguage, slug: string) {
    return `/dictionary/${language}/edit/${slug}`;
  },
  learnPath(
    language: SupportedLanguage,
    mode: LearningMode | "spinner",
    listId: number
  ) {
    return `/${language}/${mode}/${listId}`;
  },
  listsLanguagePath(language: SupportedLanguage) {
    return `/${language}/lists`;
  },
  listDetailsPath(listNumber: number, listLanguage: SupportedLanguage) {
    return `/${listLanguage}/lists/${listNumber}`;
  },
  newListPath(language: SupportedLanguage) {
    return `/${language}/lists/new`;
  },
  unitDetailsPath(
    listNumber: number,
    unitNumber: number,
    language: SupportedLanguage
  ) {
    return `/${language}/lists/${listNumber}/${unitNumber}`;
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
  learnNewLanguagePath() {
    return `/newLanguage`;
  },
  profilePath(usernameSlug: string) {
    return `/profile/${usernameSlug}`;
  },
  settingsPath() {
    return `/settings`;
  },
  signInPath() {
    return `/signIn`;
  },
  registerPath() {
    return `/register`;
  },
};

export default paths;
