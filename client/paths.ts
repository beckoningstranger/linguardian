import { setNativeLanguage } from "./app/actions";
import { LearningMode, SupportedLanguage } from "./types";

const paths = {
  rootPath() {
    return "/";
  },
  dashboardLanguagePath(language: SupportedLanguage) {
    return `/${language}/dashboard`;
  },
  dictionaryLanguagePath(language: SupportedLanguage) {
    return `/${language}/dictionary`;
  },
  dictionaryItemPath(language: SupportedLanguage, slug: string) {
    return `/${language}/dictionary/${slug}`;
  },
  learnPath(mode: LearningMode | "spinner", listId: number) {
    return `/learn/${mode}/${listId}`;
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
    return `/languages/new`;
  },
  setNativeLanguagePath() {
    return `/setNativeLanguage`;
  },
  profilePath() {
    return `/profile`;
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
