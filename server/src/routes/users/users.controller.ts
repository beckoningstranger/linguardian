import { Request, Response } from "express";

import {
  addListToDashboard,
  addNewLanguage,
  getUserById,
  getUserWithPopulatedLearnedLists,
} from "../../models/users.model.js";
import { SupportedLanguage } from "../../types.js";

export async function httpGetUserById(req: Request, res: Response) {
  const userId = parseInt(req.params.id);

  const response = await getUserById(userId);
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}

export async function httpGetLearnedLanguageData(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;
  const userId = parseInt(req.params.userId);

  const response = await getUserWithPopulatedLearnedLists(userId, language);
  if (response) return res.status(200).json(response.languages[0]);
  return res.status(404).json();
}

export async function httpAddListToDashboard(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);
  const listNumber = parseInt(req.params.listNumber);

  const response = await addListToDashboard(userId, listNumber);
  if (response) return res.status(200).json();
  res.status(400).json();
}

export async function httpAddNewLanguage(req: Request, res: Response) {
  const userId = parseInt(req.params.userId);
  const language = req.params.language as SupportedLanguage;

  const response = await addNewLanguage(userId, language);
  if (response) return res.status(200).json();
  res.status(400).json();
}
