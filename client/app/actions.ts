"use server";

import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  FullyPopulatedList,
  Item,
  ItemForServer,
  LanguageFeatures,
  LearnedLanguageWithPopulatedLists,
  LearningMode,
  List,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";

const server = process.env.SERVER_URL;

export async function getSupportedLanguages() {
  try {
    const response = await axios.get<SupportedLanguage[]>(
      `${server}/settings/supportedLanguages`
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
      `${server}/settings/languageFeatures/${language}`
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
      `${server}/settings/allLanguageFeatures`
    );
    return response.data;
  } catch (err) {
    console.error(`Error getting all language features: ${err}`);
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await axios.get<User>(`${server}/users/get/${userId}`);
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
      `${server}/lists/getFullyPopulatedList/${userNative}/${listNumber}`
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
    const response = await axios.get<PopulatedList>(
      `${server}/lists/getPopulatedList/${lNumber}`
    );
    return response.data;
  } catch (err) {
    console.error(`Error fetching populated list number ${lNumber}: ${err}`);
  }
}

export async function getList(lNumber: number) {
  try {
    return await axios.get<List>(`${server}/lists/getList/${lNumber}`);
  } catch (err) {
    console.error(`Error getching list number ${lNumber}: ${err}}`);
  }
}

export async function getUnitItems(lNumber: number, unitNumber: number) {
  try {
    const response = await axios.get<Item[]>(
      `${server}/lists/getUnitItems/${lNumber}/${unitNumber}`
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
        `${server}/lists/getAllLists/${language}`
      )
    ).data;
  } catch (err) {
    console.error(`Error fetching all lists for language ${language}`);
  }
}

export async function getLearnedLanguageData(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const response = await axios.get<LearnedLanguageWithPopulatedLists>(
      `${server}/users/getLearnedLanguageData/${language}/${userId}`
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error fetching learned lists for language ${language} for user ${userId}: ${err}`
    );
  }
}

export async function addListToDashboard(
  listNumber: number,
  language: SupportedLanguage,
  userId: string
) {
  try {
    await axios.post(
      `${server}/users/addListToDashboard/${userId}/${listNumber}`
    );
    revalidatePath(`/dashboard?lang=${language}`);
    revalidatePath(`/lists/${listNumber}`);
  } catch (err) {
    console.error(
      `Error adding list number ${listNumber} user ${userId}'s dashboard.}`
    );
  }
}

export async function removeListFromDashboard(
  listNumber: number,
  language: SupportedLanguage,
  userId: string
) {
  try {
    await axios.post(
      `${server}/users/removeListFromDashboard/${userId}/${listNumber}`
    );
  } catch (err) {
    console.error(`Error removing ${language} list 
  #${listNumber} for user ${userId}`);
  }
  revalidatePath(`/dashboard?lang=${language}`);
  redirect("/");
}

export async function addNewLanguageToLearn(
  userId: string,
  language: SupportedLanguage
) {
  try {
    await axios.post(`${server}/users/addNewLanguage/${userId}/${language}`);
    revalidatePath(`/dashboard?lang=${language}`);
    revalidatePath(`/dictionary?lang=${language}`);
    revalidatePath(`/lists?lang=${language}`);
    revalidatePath(`/languages/new`);
  } catch (err) {
    console.error(
      `Error adding ${language} as a new language for user ${userId}: ${err}`
    );
  }
}

export async function addListForNewLanguage(
  userId: string,
  language: SupportedLanguage,
  listNumber: number
) {
  try {
    addNewLanguageToLearn(userId, language);
    addListToDashboard(listNumber, language, userId);
  } catch (err) {
    console.error(
      `Error adding list ${listNumber} for new language ${language} for user ${userId}.`
    );
  }
}

export async function checkPassedLanguageAsync(
  passedLanguage: string | undefined
) {
  const supportedLanguages = await getSupportedLanguages();
  if (
    !passedLanguage ||
    !supportedLanguages ||
    !supportedLanguages.includes(passedLanguage as SupportedLanguage)
  ) {
    return false;
  }
  return passedLanguage as SupportedLanguage;
}

export async function uploadCSV(
  formState: { message: string },
  formData: FormData
) {
  let newListNumber = 0;
  try {
    const { data } = await axios.post(`${server}/lists/uploadCSV`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newListNumber = data.message as number;
  } catch (err) {
    if (err instanceof AxiosError) {
      return { message: err.response?.data.message };
    } else return { message: "Something went wrong" };
  }
  revalidatePath(`/lists/${newListNumber}`);
  redirect(`/lists/${newListNumber}`);
}

export async function updateLearnedItems(
  items: ItemForServer[],
  language: SupportedLanguage,
  userId: string,
  mode: LearningMode
) {
  try {
    const { data } = await axios.post(
      `${server}/users/updateLearnedItems/${userId}/${language}/${mode}`,
      items,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`Error passing items to server: ${err}`);
  }
  revalidatePath(`/dashboard?lang=${language}`);
}

export async function getNextUserId() {
  try {
    const { data } = await axios.get(`${server}/users/nextUserId`);
    return data;
  } catch (err) {
    console.error("Error getting latest user id", err);
  }
}

export async function setNativeLanguage({
  language,
  userId,
}: {
  language: SupportedLanguage;
  userId: string;
}) {
  try {
    await axios.post(
      `${server}/users/setNativeLanguage/${userId}/${language}`,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`Error setting native language for user ${userId}: ${err}`);
  }
  revalidatePath("/dashboard");
  redirect("/");
}

export async function getNativeLanguage(userId: string) {
  try {
    const response = await axios.get(
      `${server}/users/getNativeLanguage/${userId}`
    );
    return response.data as SupportedLanguage;
  } catch (err) {
    console.error(`Error getting native language for user ${userId}: ${err}`);
  }
}
