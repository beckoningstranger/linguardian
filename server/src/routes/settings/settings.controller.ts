import { Request, Response } from "express";
import {
  getAllSettings,
  getLanguageFeatures,
  getLanguageFeaturesForLanguage,
  getLearningModes,
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

export async function httpGetAllLanguageFeatures(req: Request, res: Response) {
  return res.status(200).json(await getLanguageFeatures());
}

export async function httpGetLearningModes(req: Request, res: Response) {
  return res.status(200).json(await getLearningModes());
}
