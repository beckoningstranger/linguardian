"use server";

import paths from "@/lib/paths";
import {
  DictionarySearchResult,
  ItemForServer,
  ItemWithPopulatedTranslations,
  LearningMode,
  ListAndUnitData,
  ListDetails,
  SupportedLanguage,
} from "@/lib/types";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getList, getSupportedLanguages } from "./fetchData";
import {
  getUserOnServer,
  getUserAndVerifyUserIsLoggedIn,
  verifyUserIsAuthorAndGetList,
} from "./helperFunctions";

const server = process.env.SERVER_URL;

export async function setNativeLanguage({
  language,
  userId,
}: {
  language: SupportedLanguage;
  userId: string;
}) {
  await getUserAndVerifyUserIsLoggedIn("You need to be logged in to do this!");
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
  await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to remove a list from your dashboard!"
  );
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
  await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to add a list to your dashboard!"
  );
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
  revalidatePath(paths.listDetailsPath(listNumber));
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

export async function finishOnboarding(
  userNative: SupportedLanguage,
  languageToLearn: SupportedLanguage
) {
  const [sessionUser, supportedLanguages] = await Promise.all([
    getUserOnServer(),
    getSupportedLanguages(),
  ]);

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

  const response = await fetch(
    `${server}/users/setNativeLanguage/${sessionUser.id}/${userNative}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) throw new Error("Could not set native language");
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
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData?.error);
  }
  const updatedItem = await response.json();

  let redirectPath = "";
  if (addToThisList) {
    redirectPath = paths.unitDetailsPath(
      addToThisList.listNumber,
      addToThisList.unitNumber
    );
    await addItemToList(addToThisList, updatedItem);
  }

  revalidatePath(paths.editDictionaryItemPath(item.slug));
  revalidatePath(paths.editDictionaryItemPath(item.slug));
  revalidatePath(paths.dictionaryItemPath(updatedItem.slug));
  revalidatePath(paths.dictionaryItemPath(updatedItem.slug));
  redirect(
    redirectPath
      ? paths.dictionaryItemPath(updatedItem.slug) +
          `?comingFrom=${redirectPath}`
      : paths.dictionaryItemPath(updatedItem.slug)
  );
}

export async function updateRecentDictionarySearches(slug: string) {
  const [sessionUser] = await Promise.all([getUserOnServer()]);
  const response = await fetch(
    `${server}/users/addRecentDictionarySearches/${sessionUser.id}/${slug}`,
    {
      method: "POST",
    }
  );
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
  const [sessionUser] = await Promise.all([getUserOnServer()]);
  if (!list?.authors.includes(sessionUser.id))
    throw new Error("Only list authors can delete items from their lists");
  const response = await fetch(
    `${server}/lists/removeItemFromList/${listData.listNumber}/${itemId}`,
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
  throw new Error("An error occurred while removing the item from the list.");
}

export async function addUnitToList(unitName: string, listNumber: number) {
  const list = await verifyUserIsAuthorAndGetList(
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
  const list = await verifyUserIsAuthorAndGetList(
    listNumber,
    "Only list authors can remove units from their lists!"
  );
  const response = await fetch(
    `${server}/lists/removeUnitFromList/${listNumber}/${unitName}`,
    {
      method: "POST",
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
    method: "POST",
  });
  if (response.ok) {
    revalidatePath(paths.listDetailsPath(listNumber));
    revalidatePath(paths.listsLanguagePath(list.language));
    revalidatePath(paths.dashboardLanguagePath(list.language));
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
    revalidatePath(paths.listsLanguagePath(list.language));
    revalidatePath(paths.dashboardLanguagePath(list.language));
    redirect(paths.listDetailsPath(listDetails.listNumber));
  }
  throw new Error(await response.json());
}

export async function stopLearningLanguage(language: SupportedLanguage) {
  const sessionUser = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to stop learning a language!"
  );
  if (!sessionUser.isLearning.map((lwf) => lwf.name).includes(language))
    throw new Error("You are not learning this language");

  const response = await fetch(
    `${server}/users/stopLearningLanguage/${sessionUser.id}/${language}`,
    {
      method: "POST",
    }
  );
  const responseData = await response.json();

  if (response.ok) {
    revalidatePath(paths.listsLanguagePath(language));
    revalidatePath(paths.dictionaryPath());
    if (sessionUser.isLearning)
      sessionUser.isLearning.forEach((lwf) =>
        revalidatePath(paths.dashboardLanguagePath(lwf.name))
      );
    revalidatePath(paths.profilePath(sessionUser.usernameSlug));
    return responseData;
  }
  throw new Error(responseData);
}

export async function addNewLanguageToLearn(
  userId: string,
  language: SupportedLanguage
) {
  const sessionUser = await getUserAndVerifyUserIsLoggedIn(
    "You need to be logged in to add a new language!"
  );
  const response = await fetch(
    `${server}/users/addNewLanguage/${userId}/${language}`,
    { method: "POST" }
  );
  const responseData = await response.json();
  if (response.ok) {
    revalidatePath(paths.listsLanguagePath(language));
    revalidatePath(paths.dictionaryPath());
    if (sessionUser.isLearning)
      sessionUser.isLearning.forEach((lwf) =>
        revalidatePath(paths.dashboardLanguagePath(lwf.name))
      );
    revalidatePath(paths.profilePath(sessionUser.usernameSlug));
    return responseData;
  }
  throw new Error(responseData);
}
