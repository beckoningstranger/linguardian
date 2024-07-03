import { GlobalSettings, SupportedLanguage } from "../lib/types.js";
import Settings from "./settings.schema.js";

export async function setSiteSettings(siteSettings: GlobalSettings) {
  try {
    await Settings.collection.drop();
    return await Settings.create(siteSettings);
  } catch (err) {
    console.error(`Error updating settings: ${err}`);
  }
}

export async function getAllSettings() {
  try {
    return await Settings.findOne({}, { _id: 0, __v: 0, id: 0 });
  } catch (err) {
    console.error(`Error getting all settings: ${err}`);
  }
}

export async function getSupportedLanguages() {
  try {
    const response = await Settings.findOne<GlobalSettings>(
      {},
      { supportedLanguages: 1, _id: 0 }
    );
    if (response) {
      return response.supportedLanguages;
    }
  } catch (err) {
    console.error(`Error getting supported Languages: ${err}`);
  }
}

export async function getLanguageFeatures() {
  try {
    const response = await Settings.findOne<GlobalSettings>(
      {},
      { languageFeatures: 1, _id: 0 }
    );
    if (response) {
      return response.languageFeatures;
    }
  } catch (err) {
    console.error(`Error getting language features: ${err}`);
  }
}

export async function getLearningModes() {
  try {
    return (await Settings.findOne({}, { learningModes: 1, _id: 0 }))
      ?.learningModes;
  } catch (err) {
    console.error(`Error updating settings: ${err}`);
  }
}

export async function getLanguageFeaturesForLanguage(
  language: SupportedLanguage
) {
  const allLanguageFeatures = await getLanguageFeatures();
  if (allLanguageFeatures) {
    const [featuresForLanguage] = allLanguageFeatures.filter(
      (lang) => lang.langCode === language
    );
    return featuresForLanguage;
  }
}
