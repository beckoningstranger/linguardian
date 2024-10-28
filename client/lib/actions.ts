"use server";

import paths from "@/lib/paths";
import {
  DictionarySearchResult,
  ItemForServer,
  ItemWithPopulatedTranslations,
  LanguageWithFlagAndName,
  LearningMode,
  ListAndUnitData,
  ListDetails,
  RegisterSchema,
  SupportedLanguage,
} from "@/lib/types";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getList } from "./fetchData";
import {
  getUserAndVerifyUserIsLoggedIn,
  getUserOnServer,
  verifyUserIsAuthorAndGetList,
} from "./helperFunctionsServer";

const server = process.env.SERVER_URL;

export async function setNativeLanguage(
  nativeLanguage: LanguageWithFlagAndName
) {
  const user = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to do this!"
  );
  try {
    const response = await fetch(`${server}/users/setNativeLanguageForUserId`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, nativeLanguage }),
    });
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error setting native language for user ${user.id}: ${err}`);
  }
}

export async function createList(formData: FormData) {
  await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to create lists!"
  );
  let newListNumber = 0;
  let newListLanguage;
  try {
    const response = await fetch(`${server}/lists/createNewList`, {
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
  redirect(paths.listDetailsPath(newListNumber));
}

export async function updateLearnedItems(
  items: ItemForServer[],
  language: SupportedLanguage,
  userId: string,
  mode: LearningMode
) {
  await getUserAndVerifyUserIsLoggedIn("You need to be logged in to do this!");
  try {
    const response = await fetch(`${server}/users/updateLearnedItems`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, userId, language, mode }),
    });

    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error passing items to server: ${err}`);
  }
  revalidatePath(paths.dashboardLanguagePath(language));
  redirect(paths.dashboardLanguagePath(language));
}

export async function setLearnedLists(
  listNumber: number,
  learnedLists: Partial<Record<SupportedLanguage, number[]>>,
  listLanguage: SupportedLanguage
) {
  const user = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to remove a list from your dashboard!"
  );
  try {
    const response = await fetch(`${server}/users/setLearnedListsForUserId`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, learnedLists }),
    });
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(`Error setting learned lists for user ${user.id}: ${err}`);
    throw err;
  }
  revalidatePath(paths.listDetailsPath(listNumber));
  revalidatePath(paths.dashboardLanguagePath(listLanguage));
}

export async function findItems(languages: SupportedLanguage[], query: string) {
  try {
    const response = await fetch(
      `${server}/items/findItems/${languages}/${query}`
    );
    if (!response.ok) throw new Error(response.statusText);
    return (await response.json()) as DictionarySearchResult[];
  } catch (err) {
    console.error(`Error looking up items for query ${query}: ${err}`);
  }
}

export async function submitItemCreateOrEdit(
  item: ItemWithPopulatedTranslations,
  slug: string,
  addToThisList?: ListAndUnitData
) {
  await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to create or edit items!"
  );

  const response = await fetch(`${server}/items/editOrCreateBySlug/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  const responseData = await response.json();

  if (!response.ok) {
    return {
      success: false,
      errors: responseData.errors || "Failed to edit/create item",
    };
  }

  let redirectPath = "";
  if (addToThisList) {
    redirectPath = paths.unitDetailsPath(
      addToThisList.listNumber,
      addToThisList.unitNumber
    );
    await addItemToList(addToThisList, responseData);
  }

  revalidatePath(paths.editDictionaryItemPath(item.slug));
  revalidatePath(paths.editDictionaryItemPath(responseData.slug));
  revalidatePath(paths.dictionaryItemPath(item.slug));
  revalidatePath(paths.dictionaryItemPath(responseData.slug));
  redirect(
    redirectPath
      ? paths.dictionaryItemPath(responseData.slug) +
          `?comingFrom=${redirectPath}`
      : paths.dictionaryItemPath(responseData.slug)
  );
}

export async function updateRecentDictionarySearches(slug: string) {
  const user = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to do this!"
  );
  const response = await fetch(`${server}/users/addRecentDictionarySearches/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug, userId: user.id }),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData?.error);
  }
}

export async function addItemToList(
  listData: ListAndUnitData,
  clickeditem: ItemWithPopulatedTranslations
) {
  await verifyUserIsAuthorAndGetList(
    listData.listNumber,
    "Only list authors can add items to their lists!"
  );

  const response = await fetch(
    `${server}/lists/addItemToList/${listData.listNumber}/${listData.unitName}/${clickeditem._id}`,
    {
      method: "POST",
    }
  );
  if (response.ok) {
    revalidatePath(
      paths.unitDetailsPath(listData.listNumber, listData.unitNumber)
    );
    return await response.json();
  }

  if (response.status === 409) {
    return await response.json();
  }
  throw new Error("An error occurred while adding the item to the list.");
}

export async function removeItemFromList(
  listData: ListAndUnitData,
  itemId: Types.ObjectId
) {
  const list = await getList(listData.listNumber);
  const [user] = await Promise.all([getUserOnServer()]);
  if (!list?.authors.includes(user.id))
    throw new Error("Only list authors can delete items from their lists");
  const response = await fetch(
    `${server}/lists/removeItemFromList/${listData.listNumber}/${itemId}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    revalidatePath(
      paths.unitDetailsPath(listData.listNumber, listData.unitNumber)
    );
    return await response.json();
  }
  throw new Error("An error occurred while removing the item from the list.");
}

export async function addUnitToList(unitName: string, listNumber: number) {
  await verifyUserIsAuthorAndGetList(
    listNumber,
    "Only list authors can add units to their lists!"
  );

  const response = await fetch(
    `${server}/lists/addUnitToList/${listNumber}/${unitName}`,
    {
      method: "POST",
    }
  );
  if (response.ok) {
    revalidatePath(paths.listDetailsPath(listNumber));
    return await response.json();
  }
  throw new Error("An error occurred while adding the new unit.");
}

export async function removeUnitFromList(unitName: string, listNumber: number) {
  await verifyUserIsAuthorAndGetList(
    listNumber,
    "Only list authors can remove units from their lists!"
  );
  const response = await fetch(
    `${server}/lists/removeUnitFromList/${listNumber}/${unitName}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    revalidatePath(paths.listDetailsPath(listNumber));
    return await response.json();
  }
  throw new Error("An error occurred while removing the new unit.");
}

export async function removeList(listNumber: number) {
  const list = await verifyUserIsAuthorAndGetList(
    listNumber,
    "Only list authors can remove their lists!"
  );
  const response = await fetch(`${server}/lists/removeList/${listNumber}`, {
    method: "DELETE",
  });
  if (response.ok) {
    revalidatePath(paths.listDetailsPath(listNumber));
    revalidatePath(paths.listsLanguagePath(list.language.code));
    revalidatePath(paths.dashboardLanguagePath(list.language.code));
    return await response.json();
  }
  throw new Error("An error occurred while removing the list.");
}

export async function changeListDetails(listDetails: ListDetails) {
  const list = await verifyUserIsAuthorAndGetList(
    listDetails.listNumber,
    "Only list authors can edit list details!"
  );
  const response = await fetch(`${server}/lists/editListDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listDetails),
  });
  if (response.ok) {
    if (listDetails.unitOrder)
      listDetails.unitOrder.forEach((unitName) =>
        revalidatePath(
          paths.unitDetailsPath(
            listDetails.listNumber,
            list.unitOrder.indexOf(unitName)
          )
        )
      );
    revalidatePath(paths.listDetailsPath(listDetails.listNumber));
    revalidatePath(paths.listsLanguagePath(list.language.code));
    revalidatePath(paths.dashboardLanguagePath(list.language.code));
    redirect(paths.listDetailsPath(listDetails.listNumber));
  }
  throw new Error(await response.json());
}

export async function setLearnedLanguages(
  learnedLanguages: LanguageWithFlagAndName[]
) {
  const user = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to do this!"
  );
  const response = await fetch(`${server}/users/setLearnedLanguagesForUserId`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, learnedLanguages }),
  });
  if (response.ok) {
    revalidatePath(paths.dictionaryPath());
    if (user.learnedLanguages)
      learnedLanguages.forEach((languageObject) => {
        revalidatePath(paths.dashboardLanguagePath(languageObject.code));
        revalidatePath(paths.listsLanguagePath(languageObject.code));
      });
    revalidatePath(paths.settingsPath());
    revalidatePath(paths.profilePath(user.usernameSlug));
  }
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const response = await fetch(`${server}/users/isEmailTaken/${email}`);
  const responseData = await response.json();
  if (response.ok) return responseData;
  throw new Error("Could not verify whether user email is taken.");
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const encodedUsername = encodeURIComponent(username);

  const response = await fetch(
    `${server}/users/isUsernameTaken/${encodedUsername}`
  );
  const responseData = await response.json();
  if (response.ok) return responseData;
  throw new Error("Could not verify whether username is taken.");
}

export async function createUser(userData: RegisterSchema) {
  const username = userData.username.split(" ").join("");
  const response = await fetch(`${server}/users/createUser/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...userData, username }),
  });
  const responseData = await response.json();

  if (response.ok) {
    return { success: true };
  } else {
    return {
      success: false,
      errors: responseData.errors || "Failed to create user",
    };
  }
}
