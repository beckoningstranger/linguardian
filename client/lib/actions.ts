"use server";

import paths from "@/lib/paths";
import {
  DictionarySearchResult,
  ItemForServer,
  ItemWithPopulatedTranslations,
  LearningMode,
  SupportedLanguage,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupportedLanguages } from "./fetchData";
import getUserOnServer from "./helperFunctions";

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
  redirect(paths.listsLanguagePath(language));
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

export async function addNewLanguageToLearn(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const response = await fetch(
      `${server}/users/addNewLanguage/${userId}/${language}`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(
      `Error adding ${language} as a new language for user ${userId}: ${err}`
    );
  }
}

export async function finishOnboarding(
  userNative: SupportedLanguage,
  languageToLearn: SupportedLanguage
) {
  const [sessionUser, supportedLanguages] = await Promise.all([
    getUserOnServer(),
    getSupportedLanguages(),
  ]);

  // Validation
  if (languageToLearn === userNative)
    throw new Error(
      "Your native language and the one you want to learn can not be the same."
    );
  if (
    !supportedLanguages?.includes(languageToLearn) ||
    !supportedLanguages?.includes(userNative)
  )
    throw new Error("Language is not supported");
  if (!sessionUser) throw new Error("Please log in to do this.");

  const nativeResponse = await fetch(
    `${server}/users/setNativeLanguage/${sessionUser.id}/${userNative}`,
    {
      method: "POST",
    }
  );
  if (!nativeResponse.ok) throw new Error("Could not set native language");
  addNewLanguageToLearn(sessionUser.id, languageToLearn);
  redirect(paths.listsLanguagePath(languageToLearn));
}

export async function submitItemEdit(
  slug: string,
  item: ItemWithPopulatedTranslations
) {
  console.log("actions.ts", item);
  const response = await fetch(`${server}/items/editBySlug/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData?.error);
  }
  const updatedItem = await response.json();
  revalidatePath(paths.editDictionaryItemPath(item.language, item.slug));
  revalidatePath(paths.editDictionaryItemPath(item.language, item.slug));
  revalidatePath(
    paths.dictionaryItemPath(updatedItem.language, updatedItem.slug)
  );
  revalidatePath(
    paths.dictionaryItemPath(updatedItem.language, updatedItem.slug)
  );
  redirect(
    paths.editDictionaryItemPath(updatedItem.language, updatedItem.slug)
  );
}
