import { Request, Response } from "express";
import {
  getAllSettings,
  getLanguageFeatures,
  getSupportedLanguages,
  getUser,
} from "../../models/settings.model.js";

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
  const requestedLanguage = req.params.language;

  const allLanguageFeatures = await getLanguageFeatures();
  if (allLanguageFeatures) {
    const [featuresForLanguage] = allLanguageFeatures.filter(
      (lang) => lang.langCode === requestedLanguage
    );
    return res.status(200).json(featuresForLanguage);
  }
  return res.status(404).json();
}

export async function httpGetUser(req: Request, res: Response) {
  const response = await getUser();
  if (response) return res.status(200).json(response);
  return res.status(404).json();
}
