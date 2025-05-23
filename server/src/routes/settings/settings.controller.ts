import { Request, Response } from "express";
import { siteSettings } from "../../lib/siteSettings.js";
import { SupportedLanguage } from "../../lib/types.js";

export async function httpGetAllSettings(req: Request, res: Response) {
  return res.status(200).json(siteSettings);
}

export async function httpGetDefaultSRSettings(req: Request, res: Response) {
  return res.status(200).json(siteSettings.defaultSRSettings);
}

export async function httpGetSupportedLanguages(req: Request, res: Response) {
  return res.status(200).json(siteSettings.supportedLanguages);
}

export async function httpGetLanguageFeaturesForLanguage(
  req: Request,
  res: Response
) {
  const requestedLanguage = req.params.language as SupportedLanguage;
  return res
    .status(200)
    .json(
      siteSettings.languageFeatures.find(
        (lang) => lang.langCode === requestedLanguage
      )
    );
}

export async function httpGetAllLanguageFeatures(req: Request, res: Response) {
  return res.status(200).json(siteSettings.languageFeatures);
}

export async function httpGetLearningModes(req: Request, res: Response) {
  return res.status(200).json(siteSettings.learningModes);
}
