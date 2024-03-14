import { Request, Response } from "express";

import {
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

export async function httpGetUserWithPopulatedLearnedLists(
  req: Request,
  res: Response
) {
  const language = req.params.language as SupportedLanguage;
  const userId = parseInt(req.params.userId);

  const response = await getUserWithPopulatedLearnedLists(userId, language);
  console.log(response);
  if (response) return res.status(200).json(response.languages);
  return res.status(404).json();
}
