import { GlobalSettings, SupportedLanguage } from "../types.js";
import Settings from "./settings.schema.js";

export async function getAllSettings() {
  try {
    return await Settings.findOne({ id: 1 }, { _id: 0, __v: 0, id: 0 });
  } catch (err) {
    console.error(`Error getting all settings: ${err}`);
  }
}

export async function getSupportedLanguages() {
  try {
    const response = await Settings.findOne<GlobalSettings>(
      { id: 1 },
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
      { id: 1 },
      { languageFeatures: 1, _id: 0 }
    );
    if (response) {
      return response.languageFeatures;
    }
  } catch (err) {
    console.error(`Error getting language features: ${err}`);
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

export async function updateSiteSettings(updatedSettings: GlobalSettings) {
  try {
    return await Settings.findOneAndUpdate({ id: 1 }, updatedSettings, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Error updating settings: ${err}`);
  }
}
