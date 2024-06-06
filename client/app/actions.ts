"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  DictionarySearchResult,
  FullyPopulatedList,
  ItemForServer,
  LanguageFeatures,
  LearnedLanguageWithPopulatedLists,
  LearningMode,
  List,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";
import paths from "@/paths";

const server = process.env.SERVER_URL;

export async function getSupportedLanguages() {
  try {
    const response = await fetch(`${server}/settings/supportedLanguages`);
    if (!response.ok) throw new Error(response.statusText);
    const supportedLanguages: SupportedLanguage[] = await response.json();
    return supportedLanguages;
  } catch (err) {
    console.error(`Error getting supported languages: ${err}`);
  }
}

export async function getLanguageFeaturesForLanguage(
  language: SupportedLanguage
) {
  try {
    const response = await fetch(
      `${server}/settings/languageFeatures/${language}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const languageFeatures: LanguageFeatures = await response.json();
    return languageFeatures;
  } catch (err) {
    console.error(
      `Error getting language features for language ${language}: ${err}`
    );
  }
}

export async function getAllLanguageFeatures() {
  try {
    const response = await fetch(`${server}/settings/allLanguageFeatures`);
    if (!response.ok) throw new Error(response.statusText);
    const allLanguageFeatures: LanguageFeatures[] = await response.json();
    return allLanguageFeatures;
  } catch (err) {
    console.error(`Error getting all language features: ${err}`);
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await fetch(`${server}/users/get/${userId}`);
    if (!response.ok) throw new Error(response.statusText);
    const user: User = await response.json();
    return user;
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function getFullyPopulatedListByListNumber(
  userNative: SupportedLanguage,
  listNumber: number
) {
  try {
    const response = await fetch(
      `${server}/lists/getFullyPopulatedList/${userNative}/${listNumber}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const list: FullyPopulatedList = await response.json();
    return list;
  } catch (err) {
    console.error(
      `Error fetching fully populated list number ${listNumber}: ${err}`
    );
  }
}

export async function getPopulatedList(lNumber: number) {
  try {
    const response = await fetch(`${server}/lists/getPopulatedList/${lNumber}`);
    if (!response.ok) throw new Error(response.statusText);
    const list: PopulatedList = await response.json();
    return list;
  } catch (err) {
    console.error(`Error fetching populated list number ${lNumber}: ${err}`);
  }
}

export async function getList(lNumber: number) {
  try {
    const response = await fetch(`${server}/lists/getList/${lNumber}`);
    if (!response.ok) throw new Error(response.statusText);
    const list: List = await response.json();
    return list;
  } catch (err) {
    console.error(`Error fetching list number ${lNumber}: ${err}}`);
  }
}

export async function getListsByLanguage(language: SupportedLanguage) {
  try {
    const response = await fetch(`${server}/lists/getAllLists/${language}`);
    if (!response.ok) throw new Error(response.statusText);
    const lists: PopulatedList[] = await response.json();
    return lists;
  } catch (err) {
    console.error(`Error fetching all lists for language ${language}`);
  }
}

export async function getLearnedLanguageData(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const response = await fetch(
      `${server}/users/getLearnedLanguageData/${language}/${userId}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const learnedLanguageData: LearnedLanguageWithPopulatedLists =
      await response.json();
    return learnedLanguageData;
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

export async function addListForNewLanguage(
  userId: string,
  language: SupportedLanguage,
  listNumber: number
) {
  addNewLanguageToLearn(userId, language);
  addListToDashboard(listNumber, language, userId);
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
    return null;
  }
  return passedLanguage as SupportedLanguage;
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

export async function getNextUserId() {
  try {
    const response = await fetch(`${server}/users/nextUserId`);
    if (!response.ok) throw new Error(response.statusText);
    const nextUserId = await response.json();
    return nextUserId;
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

// export async function getNativeLanguage(userId: string) {
//   try {
//     const response = await fetch(`${server}/users/getNativeLanguage/${userId}`);

//     if (!response.ok) throw new Error(response.statusText);
//     const nativeLanguage: SupportedLanguage = await response.json();
//     return nativeLanguage;
//   } catch (err) {
//     console.error(`Error getting native language for user ${userId}: ${err}`);
//   }
// }

export async function fetchAuthors(authors: string[]) {
  const authorDataPromises = authors.map(
    async (author) => await getUserById(author)
  );
  const authorData = await Promise.all(authorDataPromises);
  return authorData.map((author) => author?.username).join(" & ");
}

export async function lookUpItemBySlug(
  language: SupportedLanguage,
  slug: string,
  userNative: SupportedLanguage
) {
  try {
    const response = await fetch(
      `${server}/items/getBySlug/${language}/${slug}/${userNative}`,
      { method: "GET" }
    );
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (err) {
    console.error(`Error looking up item with slug ${slug}: ${err}`);
  }
}

export async function getAllSlugsForLanguage(language: SupportedLanguage) {
  try {
    const response = await fetch(
      `${server}/items/getAllSlugsForLanguage/${language}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const slugLanguageObjects: {
      language: SupportedLanguage;
      slug: string;
    }[] = await response.json();
    return slugLanguageObjects;
  } catch (err) {
    console.error(`Error looking up all slugs for ${language}: ${err}`);
  }
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
