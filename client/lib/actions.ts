"use server";

import paths from "@/paths";
import {
  DictionarySearchResult,
  ItemForServer,
  LearningMode,
  SupportedLanguage,
} from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addNewLanguageToLearn } from "./fetchData";

const server = process.env.SERVER_URL;

export async function setNativeLanguage({
  language,
  userId,
}: {
  language: SupportedLanguage;
  userId: string;
}) {
  try {
    const response = await fetch(
      `${server}/users/setNativeLanguage/${userId}/${language}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error setting native language for user ${userId}: ${err}`);
  }
  redirect(paths.signInPath());
}

export async function uploadCSV(
  formState: { message: string },
  formData: FormData
) {
  let newListNumber = 0;
  let newListLanguage;
  try {
    const response = await fetch(`${server}/lists/uploadCSV`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    newListNumber = data.message.listNumber;
    newListLanguage = data.message.listLanguage;
  } catch (err) {
    console.error(`Error uploading a csv file to create new list: ${err}`);
    return { message: "Something went wrong" };
  }
  revalidatePath(paths.listsLanguagePath(newListLanguage));
  redirect(
    paths.listDetailsPath(newListNumber, newListLanguage as SupportedLanguage)
  );
}

export async function updateLearnedItems(
  items: ItemForServer[],
  language: SupportedLanguage,
  userId: string,
  mode: LearningMode
) {
  try {
    const response = await fetch(
      `${server}/users/updateLearnedItems/${userId}/${language}/${mode}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      }
    );

    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error passing items to server: ${err}`);
  }
  revalidatePath(paths.dashboardLanguagePath(language));
}

export async function removeListFromDashboard(
  listNumber: number,
  language: SupportedLanguage,
  userId: string
) {
  try {
    const response = await fetch(
      `${server}/users/removeListFromDashboard/${userId}/${listNumber}`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error removing ${language} list 
  #${listNumber} for user ${userId}: ${err}`);
  }
  revalidatePath(paths.dashboardLanguagePath(language));
  redirect(paths.dashboardLanguagePath(language));
}

export async function addListToDashboard(
  listNumber: number,
  language: SupportedLanguage,
  userId: string
) {
  try {
    const response = await fetch(
      `${server}/users/addListToDashboard/${userId}/${listNumber}`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(
      `Error adding list number ${listNumber} user ${userId}'s dashboard: ${err}`
    );
  }
  revalidatePath(paths.dashboardLanguagePath(language));
  revalidatePath(paths.listDetailsPath(listNumber, language));
}

export async function addListForNewLanguage(
  userId: string,
  language: SupportedLanguage,
  listNumber: number
) {
  addNewLanguageToLearn(userId, language);
  addListToDashboard(listNumber, language, userId);
}

export async function findItems(languages: SupportedLanguage[], query: string) {
  try {
    const response = await fetch(
      `${server}/items/findItems/${languages}/${query}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const foundItems: DictionarySearchResult[] = await response.json();
    return foundItems;
  } catch (err) {
    console.error(`Error looking up items for query ${query}: ${err}`);
  }
}
