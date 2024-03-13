"use server";

import {
  FullyPopulatedList,
  Item,
  LanguageFeatures,
  List,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";
import axios from "axios";

export async function getSupportedLanguages() {
  try {
    const response = await axios.get<SupportedLanguage[]>(
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
    const response = await axios.get<LanguageFeatures>(
      `http://localhost:8000/settings/languageFeatures/${language}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error getting language features for language ${language}: ${err}`
    );
  }
}

export async function getUser() {
  try {
    const response = await axios.get<User>(
      `http://localhost:8000/settings/user`
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function getFullyPopulatedListByListNumber(
  userNative: SupportedLanguage,
  listNumber: number
) {
  try {
    const response = await axios.get<FullyPopulatedList>(
      `http://localhost:8000/lists/getFullyPopulatedList/${userNative}/${listNumber}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error fetching fully populated list number ${listNumber}: ${err}`
    );
  }
}

export async function getPopulatedList(lNumber: number) {
  try {
    return await axios.get<PopulatedList>(
      `http://localhost:8000/lists/getPopulatedList/${lNumber}`
    );
  } catch (err) {
    console.error(`Error fetching populated list number ${lNumber}: ${err}`);
  }
}

export async function getList(lNumber: number) {
  try {
    return await axios.get<List>(
      `http:localhost:8000/lists/getList/${lNumber}`
    );
  } catch (err) {
    console.error(`Error getching list number ${lNumber}: ${err}}`);
  }
}

export async function getUnitItems(lNumber: number, unitNumber: number) {
  try {
    const response = await axios.get<Item[]>(
      `http://localhost:8000/lists/getUnitItems/${lNumber}/${unitNumber}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error fetching unit items for list number ${lNumber}: ${err}`
    );
  }
}

export async function getListsByLanguage(language: SupportedLanguage) {
  try {
    return (
      await axios.get<PopulatedList[]>(
        `http://localhost:8000/lists/getAllLists/${language}`
      )
    ).data;
  } catch (err) {
    console.error(`Error fetching all lists for language ${language}`);
  }
}
