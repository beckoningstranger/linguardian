import { Request, Response } from "express";

import {
  addListToDashboard,
  addNewLanguage,
  addNewlyLearnedItems,
  addRecentDictionarySearches,
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

import {
  LearningMode,
  SupportedLanguage,
  UserCreationData,
} from "../../lib/types.js";
import { getItemById } from "../../models/items.model.js";
import { getSupportedLanguages } from "../../models/settings.model.js";
import { slugifyString } from "../../lib/helperFunctions.js";

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

export async function httpAddListToDashboard(req: Request, res: Response) {
  const userId = req.params.userId;
  const listNumber = parseInt(req.params.listNumber);

  const response = await addListToDashboard(userId, listNumber);
  if (response) return res.status(200).json();
  return res.status(400).json();
}

export async function httpRemoveListFromDashboard(req: Request, res: Response) {
  const userId = req.params.userId;
  const listNumber = parseInt(req.params.listNumber);

  const response = await removeListFromDashboard(userId, listNumber);
  if (response) return res.status(200).json();
  return res.status(400).json();
}

export async function httpAddNewLanguage(req: Request, res: Response) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;

  const response = await addNewLanguage(userId, language);
  if (response) return res.status(200).json(response);
  return res.status(400).json();
}

export async function httpUpdateLearnedItems(req: Request, res: Response) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;
  const mode = req.params.mode as LearningMode;
  let response;
  if (mode === "learn") {
    response = await addNewlyLearnedItems(req.body, userId, language);
  } else {
    response = await updateReviewedItems(req.body, userId, language);
  }
  return res.status(200).json();
}

export async function httpGetNextUserId(req: Request, res: Response) {
  return res.status(200).json(await getNextUserId());
}

export async function httpSetNativeLanguage(req: Request, res: Response) {
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;

  const response = await setNativeLanguage(userId, language);
  if (response.modifiedCount === 1) return res.status(201).json();
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
  const userId = req.params.userId;
  const slug = req.params.slug;

  const response = await addRecentDictionarySearches(userId, slug);
  if (!response) return res.status(404).json();
  return res.status(201).json(response);
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
  const userId = req.params.userId;
  const language = req.params.language as SupportedLanguage;

  const response = await stopLearningLanguage(userId, language);
  if (!response) return res.status(500).json();
  return res.status(200).json(response);
}

export async function httpCreateUser(req: Request, res: Response) {
  const userData: UserCreationData = req.body;
  const { id, username, email, hashedPassword } = userData;

  const response = await createUser({
    id: id === "credentials" ? id + (await getNextUserId()) : id,
    email,
    username,
    usernameSlug: slugifyString(username),
    password: hashedPassword,
  });

  if (response) return res.status(200).json();
  return res.status(500).json();
}

export async function httpIsEmailTaken(req: Request, res: Response) {
  const userEmail = req.params.email;
  const response = await getUserByEmail(userEmail);
  if (response) return res.status(200).json(true);
  return res.status(200).json(false);
}
