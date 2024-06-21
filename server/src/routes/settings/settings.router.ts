import express from "express";
import {
  httpGetAllLanguageFeatures,
  httpGetAllSettings,
  httpGetLanguageFeaturesForLanguage,
  httpGetLearningModes,
  httpGetSupportedLanguages,
} from "./settings.controller.js";

export const settingsRouter = express.Router();

settingsRouter.get("/all", httpGetAllSettings);

settingsRouter.get("/supportedLanguages", httpGetSupportedLanguages);

settingsRouter.get(
  "/languageFeatures/:language",
  httpGetLanguageFeaturesForLanguage
);

settingsRouter.get("/allLanguageFeatures", httpGetAllLanguageFeatures);

settingsRouter.get("/learningModes", httpGetLearningModes);
