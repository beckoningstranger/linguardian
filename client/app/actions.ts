"use server";

import { LanguageFeatures, PopulatedList, SupportedLanguage } from "@/types";
import axios from "axios";

export async function getSupportedLanguages() {
  try {
    const response = await axios.get(
      "http://localhost:8000/settings/supportedLanguages"
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting supported languages: ${err}`);
  }
}

export async function getLanguageFeaturesForLanguage(
  language: SupportedLanguage
) {
  try {
    const response = await axios.get(
      `http://localhost:8000/settings/languageFeatures/${language}`
    );
    return response.data as LanguageFeatures;
  } catch (err) {
    console.error(
      `Error getting language features for language ${language}: ${err}`
    );
  }
}

export async function getUser() {
  try {
    const response = await axios.get(`http://localhost:8000/settings/user`);
    return response.data;
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function getOnePopulatedListByListNumber(listNumber: number) {
  try {
    const response = await axios.get(
      `http://localhost:8000/lists/get/${listNumber}`
    );
    return response.data as PopulatedList;
  } catch (err) {
    console.error(
      `Error gettin list data for list number ${listNumber}: ${err}`
    );
  }
}
