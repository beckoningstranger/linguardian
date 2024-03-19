import { Request, Response } from "express";
import {
  getAllSettings,
  getLanguageFeaturesForLanguage,
  getSupportedLanguages,
} from "../../models/settings.model.js";
import { SupportedLanguage } from "../../types.js";

export async function httpGetAllSettings(req: Request, res: Response) {
  return res.status(200).json(await getAllSettings());
}

export async function httpGetSupportedLanguages(req: Request, res: Response) {
  return res.status(200).json(await getSupportedLanguages());
}

export async function httpGetLanguageFeaturesForLanguage(
  req: Request,
  res: Response
) {
  const requestedLanguage = req.params.language as SupportedLanguage;

  return res
    .status(200)
    .json(await getLanguageFeaturesForLanguage(requestedLanguage));
}
