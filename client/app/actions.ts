"use server";

import {
  FullyPopulatedList,
  Item,
  LanguageFeatures,
  LearnedLanguageWithPopulatedLists,
  List,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";
import axios from "axios";
import { revalidatePath } from "next/cache";

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

export async function getAllLanguageFeatures() {
  try {
    const response = await axios.get<LanguageFeatures[]>(
      `http://localhost:8000/settings/allLanguageFeatures`
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting all language features: ${err}`);
  }
}

export async function getUserById(userId: number) {
  try {
    const response = await axios.get<User>(
      `http://localhost:8000/users/get/${userId}`
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

export async function getLearnedLanguageData(
  userId: number,
  language: SupportedLanguage
) {
  try {
    const response = await axios.get<LearnedLanguageWithPopulatedLists>(
      `http://localhost:8000/users/getLearnedLanguageData/${language}/${userId}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error fetching learned lists for language ${language} for user ${userId}: ${err}`
    );
  }
}

export async function addListToDashboard(userId: number, listId: number) {
  try {
    await axios.post(
      `http://localhost:8000/users/addListToDashboard/${userId}/${listId}`
    );
    revalidatePath("/dashboard");
    revalidatePath(`/lists/${listId}`);
  } catch (err) {
    console.error(
      `Error adding list number ${listId} user ${userId}'s dashboard.}`
    );
  }
}

export async function addNewLanguageToLearn(
  userId: number,
  language: SupportedLanguage
) {
  try {
    await axios.post(
      `http://localhost:8000/users/addNewLanguage/${userId}/${language}`
    );
    revalidatePath("/dashboard");
    revalidatePath("/dictionary");
    revalidatePath("/lists");
    revalidatePath("/languages/new");
  } catch (err) {
    console.error(
      `Error adding ${language} as a new language for user ${userId}: ${err}`
    );
  }
}

export async function checkPassedLanguageAsync(
  passedLanguage: string | undefined,
) {
  const supportedLanguages = await getSupportedLanguages()
  if (
    !passedLanguage ||
    !supportedLanguages ||
    !supportedLanguages.includes(passedLanguage as SupportedLanguage)
  ) {
    return false;
  }
  return passedLanguage as SupportedLanguage;
}