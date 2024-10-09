import { Request, Response } from "express";

import {
  addNewlyLearnedItems,
  addRecentDictionarySearches,
  checkUsernameAvailability,
  createUser,
  getAllUserIds,
  getLearningDataForUser,
  getNativeLanguageById,
  getNextUserId,
  getRecentDictionarySearches,
  getUserByEmail,
  getUserById,
  getUserByUsernameSlug,
  setLearnedLanguagesForUserId,
  setLearnedLists,
  setNativeLanguage,
  updateReviewedItems,
} from "../../models/users.model.js";

import { formatZodErrors } from "../../lib/helperFunctions.js";
import {
  ItemForServer,
  LanguageWithFlagAndName,
  LearningDataForLanguage,
  LearningMode,
  SupportedLanguage,
} from "../../lib/types.js";
import { registerSchema } from "../../lib/validations.js";
import { getItemById } from "../../models/items.model.js";
import { getPopulatedListByListNumber } from "../../models/lists.model.js";

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

export async function httpSetLearnedListsForUserId(
  req: Request,
  res: Response
) {
  const { userId, learnedLists } = req.body as {
    userId: string;
    learnedLists: Partial<Record<SupportedLanguage, number[]>>;
  };

  const response = await setLearnedLists(userId, learnedLists);
  if (response) return res.status(204).send();
  return res.status(500).json({ error: "Internal Server Error" });
}

export async function httpSetLearnedLanguagesForUserId(
  req: Request,
  res: Response
) {
  const { userId, learnedLanguages } = req.body as {
    userId: string;
    learnedLanguages: LanguageWithFlagAndName[];
  };

  try {
    const response = await setLearnedLanguagesForUserId(
      userId,
      learnedLanguages
    );

    if (response?.acknowledged) {
      return res
        .status(200)
        .json({ message: "Learned languages set successfully." });
    }
  } catch (err) {
    return res.status(500).json({
      error: `Server error, could not set learned languages for user ${userId}`,
    });
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

export async function httpSetNativeLanguageForUserId(
  req: Request,
  res: Response
) {
  const { userId, nativeLanguage } = req.body as {
    userId: string;
    nativeLanguage: SupportedLanguage;
  };

  const response = await setNativeLanguage(userId, nativeLanguage);
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

  const itemIdsToGet = user.recentDictionarySearches?.map(
    (item) => item.itemId
  );
  if (itemIdsToGet) {
    const itemPromises = itemIdsToGet.map(async (id) => getItemById(id));
    const items = await Promise.all(itemPromises);
    return res.status(200).json(items);
  }
  return res.status(500).json({ error: "Internal server error" });
}

export async function httpGetLearningDataForUser(req: Request, res: Response) {
  const userId = req.params.userId;
  const response = await getLearningDataForUser(userId);
  return res
    .status(200)
    .json(response ? response : { learnedItems: {}, ignoredItems: {} });
}

export async function httpGetLearningDataForLanguage(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;
  const response = await getLearningDataForUser(userId);

  return res.status(200).json({
    learnedItems:
      (response && response.learnedItems && response.learnedItems[language]) ||
      [],
    ignoredItems:
      (response && response.ignoredItems && response.ignoredItems[language]) ||
      [],
  } as LearningDataForLanguage);
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

export async function httpGetDashboardData(req: Request, res: Response) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;
  const user = await getUserById(userId);
  const response = await getLearningDataForUser(userId);
  const learningDataForLanguage = {
    learnedItems:
      response && response.learnedItems ? response.learnedItems[language] : [],
    ignoredItems:
      response && response.ignoredItems ? response.ignoredItems[language] : [],
  } as LearningDataForLanguage;

  const listPromises =
    user?.learnedLists[language]?.map(async (listNumber) =>
      getPopulatedListByListNumber(listNumber)
    ) || [];
  const lists = await Promise.all(listPromises);

  return res.status(200).json({
    learnedLists: user?.learnedLists,
    learningDataForLanguage,
    lists,
  });
}
