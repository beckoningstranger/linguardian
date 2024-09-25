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
  dictionaryItemPath(slug: string) {
    return `/dictionary/${slug}`;
  },
  editDictionaryItemPath(slug: string) {
    return `/dictionary/edit/${slug}`;
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
  listDetailsPath(listNumber: number) {
    return `/lists/${listNumber}`;
  },
  newListPath(language: SupportedLanguage) {
    return `/${language}/lists/new`;
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
