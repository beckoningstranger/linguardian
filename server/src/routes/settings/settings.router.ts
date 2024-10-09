import express from "express";
import {
  httpGetAllLanguageFeatures,
  httpGetAllSettings,
  httpGetDefaultSRSettings,
  httpGetLanguageFeaturesForLanguage,
  httpGetLearningModes,
  httpGetSupportedLanguages,
} from "./settings.controller.js";

export const settingsRouter = express.Router();

// GET

settingsRouter.get("/all", httpGetAllSettings);

settingsRouter.get("/defaultSRSettings", httpGetDefaultSRSettings);

settingsRouter.get("/supportedLanguages", httpGetSupportedLanguages);

settingsRouter.get(
  "/languageFeatures/:language",
  httpGetLanguageFeaturesForLanguage
);

settingsRouter.get("/allLanguageFeatures", httpGetAllLanguageFeatures);

settingsRouter.get("/learningModes", httpGetLearningModes);
