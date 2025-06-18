import { allUsernameSlugs, nextListNumber } from "@/dataForBuild";
import {
  FullyPopulatedList,
  ItemFE,
  ItemWithPopulatedTranslationsFE,
  LearningDataForLanguage,
  LearningMode,
  List,
  PopulatedList,
  SlugLanguageObject,
  SupportedLanguage,
  User,
} from "@/lib/types";
import { notFound } from "next/navigation";
import { getUserOnServer } from "./helperFunctionsServer";

const server = process.env.SERVER_URL;
const environment = process.env.NODE_ENV;

export async function getListNumbers() {
  if (environment === "production")
    return [...Array(nextListNumber - 1).keys()].map((i) => String(i + 1));
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

export async function getUserById(userId: string) {
  try {
    const response = await fetch(`${server}/users/get/${userId}`);
    if (!response.ok) throw new Error(await response.json());
    const user: User = await response.json();
    return user;
  } catch (err) {
    console.error(`Error getting user by id ${userId}: ${err}`);
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
    console.error(`Error getting user by username slug: ${err}`);
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

export async function getPopulatedList(listNumber: number) {
  try {
    const response = await fetch(
      `${server}/lists/getPopulatedList/${listNumber}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const list: PopulatedList = await response.json();
    return list;
  } catch (err) {
    console.error(`Error fetching populated list number ${listNumber}: ${err}`);
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

export async function getPopulatedItemBySlug(
  slug: string,
  userLanguages?: SupportedLanguage[]
) {
  try {
    const response = await fetch(
      `${server}/items/getPopulatedItemBySlug/${slug}/${userLanguages?.join(
        ","
      )}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const responseData = await response.json();
    return responseData as ItemWithPopulatedTranslationsFE;
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
    const slugLanguageObjects: SlugLanguageObject[] = await response.json();
    return slugLanguageObjects;
  } catch (err) {
    console.error(`Error looking up all slugs for ${language}: ${err}`);
  }
}

export async function getListName(listNumber: number) {
  try {
    const response = await fetch(`${server}/lists/getListName/${listNumber}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as string;
  } catch (err) {
    console.error(`Error fetching list name for list #${listNumber}: ${err}`);
  }
}

export async function getAllUsernameSlugs() {
  if (environment === "production") return allUsernameSlugs;

  try {
    const response = await fetch(`${server}/users/getAllUsernameSlugs`, {
      next: { revalidate: 60 * 60 },
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
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

export async function getLearningDataForUser(userId: string) {
  try {
    const response = await fetch(
      `${server}/users/getLearningDataForUser/${userId}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (err) {
    console.error(
      `Error fetching learning data for user with id ${userId}: ${err}`
    );
  }
}

export async function getLearningDataForLanguage(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const response = await fetch(
      `${server}/users/getLearningDataForLanguage/${userId}/${language}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as LearningDataForLanguage;
  } catch (err) {
    console.error(
      `Failed to get learning data for ${language} for ${userId}: ${err}`
    );
  }
}

export async function getRecentDictionarySearches() {
  const [user] = await Promise.all([getUserOnServer()]);

  const response = await fetch(
    `${server}/users/getRecentDictionarySearches/${user.id}`
  );
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData?.error);
  }
  return (await response.json()) as ItemFE[];
}

export async function getUserByEmail(email: string) {
  const response = await fetch(`${server}/users/getByEmail/${email}`);
  const responseData = await response.json();
  if (response.ok) return responseData;
  throw new Error("Could not get user by email.");
}

export async function getDefaultSRSettings() {
  const response = await fetch(`${server}/settings/defaultSRSettings`);
  return await response.json();
}

export async function getDashboardDataForUser(
  userId: string,
  language: SupportedLanguage
) {
  const response = await fetch(
    `${server}/users/getDashboardDataForUserId/${userId}/${language}`
  );
  return await response.json();
}

export async function getLearningSessionForList(
  listNumber: number,
  mode: LearningMode,
  unitNumber?: number
) {
  const user = await getUserOnServer();
  const response = await fetch(
    `${server}/users/getLearningSessionForList/${
      user.id
    }/${listNumber}/${mode}/${unitNumber || ""}`
  );
  return await response.json();
}
