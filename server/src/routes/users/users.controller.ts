import { Request, Response } from "express";

import {
  addListToLearnedLists,
  addNewLanguageToLearn,
  addNewlyLearnedItems,
  addRecentDictionarySearches,
  checkUsernameAvailability,
  createUser,
  getAllUserIds,
  getLearnedLanguageDataWithPopulatedLists,
  getNativeLanguageById,
  getNextUserId,
  getRecentDictionarySearches,
  getUserByEmail,
  getUserById,
  getUserByUsernameSlug,
  removeListFromDashboard,
  setNativeLanguage,
  stopLearningLanguage,
  updateReviewedItems,
} from "../../models/users.model.js";

import { formatZodErrors } from "../../lib/helperFunctions.js";
import {
  ItemForServer,
  LearningMode,
  SupportedLanguage,
} from "../../lib/types.js";
import { registerSchema } from "../../lib/validations.js";
import { getItemById } from "../../models/items.model.js";
import { getSupportedLanguages } from "../../models/settings.model.js";

export async function httpGetUserById(req: Request, res: Response) {
  const response = await getUserById(req.params.id);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetUserByEmail(req: Request, res: Response) {
  const email = req.params.email;
  const response = await getUserByEmail(email);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetUserByUsernameSlug(req: Request, res: Response) {
  const response = await getUserByUsernameSlug(req.params.usernameSlug);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetLearnedLanguageDataForLanguage(
  req: Request,
  res: Response
) {
  const language = req.params.language as SupportedLanguage;
  const userId = req.params.userId;

  const learnedLanguageData = await getLearnedLanguageDataWithPopulatedLists(
    userId
  );

  const responseFilteredForLanguage = learnedLanguageData?.find(
    (lang) => lang.code === language
  );

  return res.status(200).json(responseFilteredForLanguage || {});
}

export async function httpAddListToLearnedLists(req: Request, res: Response) {
  const { userId, listNumber } = req.body as {
    userId: string;
    listNumber: number;
  };

  const response = await addListToLearnedLists(userId, listNumber);
  if (response) return res.status(200).json();
  return res.status(400).json();
}

export async function httpRemoveListFromDashboard(req: Request, res: Response) {
  const userId = req.params.userId;
  const listNumber = parseInt(req.params.listNumber);

  if (isNaN(listNumber)) {
    return res.status(400).json({ error: "Invalid list number." });
  }

  const response = await removeListFromDashboard(userId, listNumber);
  if (response) return res.status(204).send();
  return res.status(500).json({ error: "Internal Server Error" });
}

export async function httpAddNewLanguageToLearn(req: Request, res: Response) {
  const { userId, language } = req.body as {
    userId: string;
    language: SupportedLanguage;
  };
  console.log("Add", language);

  try {
    const response = await addNewLanguageToLearn(userId, language);

    if (response?.acknowledged) {
      return res.status(200).json({ message: "Language added successfully." });
    }

    return res.status(400).json({ error: "Unable to add the language." });
  } catch (err) {
    console.error("Error in httpAddNewLanguageToLearn:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

export async function httpUpdateLearnedItems(req: Request, res: Response) {
  const { userId, language, mode, items } = req.body as {
    userId: string;
    language: SupportedLanguage;
    mode: LearningMode;
    items: ItemForServer[];
  };

  const response =
    mode === "learn"
      ? await addNewlyLearnedItems(items, userId, language)
      : await updateReviewedItems(items, userId, language);

  if (!response)
    return res.status(500).json({ error: "Could not update learned items" });

  return res.status(200).json(response);
}

export async function httpGetNextUserId(req: Request, res: Response) {
  return res.status(200).json(await getNextUserId());
}

export async function httpSetNativeLanguage(req: Request, res: Response) {
  const { userId, language } = req.body as {
    userId: string;
    language: SupportedLanguage;
  };

  const response = await setNativeLanguage(userId, language);
  if (response.modifiedCount === 1)
    return res
      .status(200)
      .json({ message: "Native language set successfully" });
  return res.status(500).json();
}

export async function httpGetNativeLanguageById(req: Request, res: Response) {
  const userId = req.params.userId;

  const response = await getNativeLanguageById(userId);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetAllUserIds(req: Request, res: Response) {
  const response = await getAllUserIds();
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetAllLearnedListsForUser(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  const languages = await getSupportedLanguages();
  if (!languages) throw new Error("Failed to get all supported languages");

  const response = await getLearnedLanguageDataWithPopulatedLists(userId);
  const allLearnedLists:
    | Record<SupportedLanguage, number[]>
    | Record<string, never> = {};
  if (!response) throw new Error("Failed to get all learned lists");
  languages.forEach((lang) =>
    Object.assign(allLearnedLists, {
      [lang]: response
        .find((lan) => lan.code === lang)
        ?.learnedLists.map((list) => list.listNumber),
    })
  );

  if (response) return res.status(200).json(allLearnedLists);
  return res.status(404).json();
}

export async function httpGetLearnedList(req: Request, res: Response) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;
  const listNumber = parseInt(req.params.listNumber);

  const response = await getLearnedLanguageDataWithPopulatedLists(userId);
  const learnedItems = response?.find(
    (lang) => lang.code === language
  )?.learnedItems;
  const ignoredItems = response?.find(
    (lang) => lang.code === language
  )?.ignoredItems;

  if (!response) return res.status(404).json();
  const foundList = response
    .find((lang) => lang.code === language)
    ?.learnedLists.find((list) => list.listNumber === listNumber);

  if (!foundList) return res.status(404).json();

  return res.status(200).json({
    learnedList: foundList,
    learnedItems,
    ignoredItems,
  });
}

export async function httpAddNewRecentDictionarySearches(
  req: Request,
  res: Response
) {
  const { slug, userId } = req.body;

  const response = await addRecentDictionarySearches(userId, slug);
  if (!response) return res.status(404).json({ error: "Not Found" });
  return res.status(200).json(response);
}

export async function httpGetRecentDictionarySearches(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;

  const user = await getRecentDictionarySearches(userId);
  if (!user) return res.status(404).json();

  const itemIdsToGet = user.recentDictionarySearches.map((item) => item.itemId);
  const itemPromises = itemIdsToGet.map(async (id) => getItemById(id));
  const items = await Promise.all(itemPromises);
  return res.status(200).json(items);
}

export async function httpStopLearningLanguage(req: Request, res: Response) {
  const { userId, language } = req.body as {
    userId: string;
    language: SupportedLanguage;
  };

  const response = await stopLearningLanguage(userId, language);
  if (!response) return res.status(500).json();
  return res.status(200).json(response);
}

export async function httpCreateUser(req: Request, res: Response) {
  const userData: unknown = req.body;
  const {
    data: validatedUserData,
    success,
    error,
  } = registerSchema.safeParse(userData);

  if (!success) {
    const formattedErrors = formatZodErrors(error.format());
    return res.status(400).json({ errors: formattedErrors });
  }

  const response = await createUser(validatedUserData);
  if (response) return res.status(201).json(response);
  return res
    .status(500)
    .json({ error: "Internal server error, could not create user" });
}

export async function httpIsEmailTaken(req: Request, res: Response) {
  const userEmail = req.params.email;
  const response = await getUserByEmail(userEmail);
  if (response) return res.status(200).json(true);
  return res.status(200).json(false);
}

export async function httpIsUsernameTaken(req: Request, res: Response) {
  const username = req.params.username;
  const response = await checkUsernameAvailability(username);
  if (response) return res.status(200).json(true);
  return res.status(200).json(false);
}
