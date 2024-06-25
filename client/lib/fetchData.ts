import {
  FullyPopulatedList,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
  LearnedItem,
  LearnedLanguageWithPopulatedLists,
  LearningMode,
  List,
  PopulatedList,
  SupportedLanguage,
  User,
} from "@/types";
import { Types } from "mongoose";
import { notFound } from "next/navigation";

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

export async function getLearningModes() {
  try {
    const response = await fetch(`${server}/settings/learningModes`);
    if (!response.ok) throw new Error(response.statusText);
    const learningModes: LearningMode[] = await response.json();
    return learningModes;
  } catch (err) {
    console.error(`Error getting learning modes: ${err}`);
  }
}

export async function getListNumbers() {
  try {
    const response = await fetch(`${server}/lists/nextListNumber`);
    if (!response.ok) throw new Error(response.statusText);
    const nextListNumber = (await response.json()) as number;
    const listNumbers = [...Array(nextListNumber - 1).keys()].map((i) =>
      String(i + 1)
    );
    return listNumbers;
  } catch (err) {
    console.error(`Error getting latest list number: ${err}`);
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

export async function getUserByUsernameSlug(usernameSlug: string) {
  try {
    const response = await fetch(
      `${server}/users/getByUsernameSlug/${usernameSlug}`
    );
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

export async function getLearningDataForList(
  userId: string,
  language: SupportedLanguage,
  listNumber: number
) {
  try {
    const response = await fetch(
      `${server}/users/getLearnedList/${language}/${userId}/${listNumber}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as {
      learnedList: List;
      learnedItems: LearnedItem[];
      ignoredItems: Types.ObjectId[];
    };
  } catch (err) {
    console.error(
      `Error fetching learned list ${listNumber} for language ${language} for user ${userId}: ${err}`
    );
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

export async function fetchAuthors(authors: string[]) {
  const authorDataPromises = authors.map(
    async (author) => await getUserById(author)
  );
  const authorData = (await Promise.all(authorDataPromises)).filter(
    (author): author is User => !!author
  );

  return authorData.map((author) => {
    return {
      username: author.username,
      usernameSlug: author.usernameSlug,
    };
  });
}

export async function lookUpItemBySlug(
  queryItemLanguage: SupportedLanguage,
  slug: string,
  userLanguages: SupportedLanguage[]
) {
  try {
    const response = await fetch(
      `${server}/items/getBySlug/${queryItemLanguage}/${slug}/${userLanguages.join(
        ","
      )}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as ItemPopulatedWithTranslations;
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

export async function getListName(listNumber: number) {
  try {
    const response = await fetch(`${server}/lists/getListName/${listNumber}`);
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as string;
  } catch (err) {
    console.error(`Error fetching list name for list #${listNumber}: ${err}`);
  }
}

export async function getAllUserIds() {
  try {
    const response = await fetch(`${server}/users/getAllUserIds`);
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as string[];
  } catch (err) {
    console.error(`Error fetching all user ids: ${err}`);
    return [];
  }
}

export async function getListDataForMetadata(
  listNumber: number,
  unitNumber: number
) {
  try {
    const response = await fetch(
      `${server}/lists/getListDataForMetadata/${listNumber}/${unitNumber}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (err) {
    console.error(
      `Error fetching list and unit name for list #${listNumber}: ${err}`
    );
    notFound();
  }
}

export async function getUnitNumbers(listNumber: number) {
  try {
    const response = await fetch(`${server}/lists/amountOfUnits/${listNumber}`);
    if (!response.ok) throw new Error(response.statusText);
    const amountOfUnits = (await response.json()) as number;
    const unitNumbers = [...Array(amountOfUnits - 1).keys()].map((i) => i + 1);
    return unitNumbers;
  } catch (err) {
    console.error(
      `Error fetching amount of units for listNumber ${listNumber}: ${err}`
    );
    return [];
  }
}

export async function getAllLearnedListsForUser(userId: string) {
  try {
    const response = await fetch(`${server}/users/getLearnedLists/${userId}`);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (err) {
    console.error(
      `Error fetching learned lists for user with id ${userId}: ${err}`
    );
    return [];
  }
}
