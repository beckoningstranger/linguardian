import { Request, Response } from "express";

import {
  addListToDashboard,
  addNewLanguage,
  getUserById,
  getUserWithPopulatedLearnedLists,
  addNewlyLearnedItems,
  updateReviewedItems,
  getNextUserId,
  setNativeLanguage,
  removeListFromDashboard,
} from "../../models/users.model.js";

import { LearningMode, SupportedLanguage } from "../../types.js";

export async function httpGetUserById(req: Request, res: Response) {
  const response = await getUserById(req.params.id);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetLearnedLanguageData(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;
  const userId = req.params.userId;

  const response = await getUserWithPopulatedLearnedLists(userId);

  const responseFilteredForLanguage = response?.languages.filter(
    (lang) => lang.code === language
  )[0];

  if (response) return res.status(200).json(responseFilteredForLanguage);
  return res.status(404).json();
}

export async function httpAddListToDashboard(req: Request, res: Response) {
  const userId = req.params.userId;
  const listNumber = parseInt(req.params.listNumber);
  const language = req.params.language as SupportedLanguage;

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
  if (response) return res.status(200).json();
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
  return res.status(500);
}
