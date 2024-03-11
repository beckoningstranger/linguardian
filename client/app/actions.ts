"use server";

import {
  FullyPopulatedList,
  Item,
  LanguageFeatures,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";
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
    const response = await axios.get<User>(
      `http://localhost:8000/settings/user`
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function getOnePopulatedListByListNumber(
  userNative: SupportedLanguage,
  listNumber: number
) {
  try {
    const response = await axios.get<FullyPopulatedList>(
      `http://localhost:8000/lists/get/${userNative}/${listNumber}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error getting list data for list number ${listNumber}: ${err}`
    );
  }
}

export async function getBasicListData(lNumber: number) {
  try {
    return await axios.get<PopulatedList>(
      `http://localhost:8000/lists/getBasicListData/${lNumber}`
    );
  } catch (err) {
    console.error(`Error fetching list number ${lNumber}: ${err}`);
  }
}

export async function getUnitData(lNumber: number, unitNumber: number) {
  try {
    const response = await axios.get<Item[]>(
      `http://localhost:8000/lists/getUnitData/${lNumber}/${unitNumber}`
    );
    return response.data;
  } catch (err) {
    console.error(`Error fetching list number ${lNumber}: ${err}`);
  }
}