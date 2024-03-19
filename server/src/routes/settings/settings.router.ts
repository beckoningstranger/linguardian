import express from "express";
import {
  httpGetAllSettings,
  httpGetLanguageFeaturesForLanguage,
  httpGetSupportedLanguages,
} from "./settings.controller.js";

export const settingsRouter = express.Router();

settingsRouter.get("/all", httpGetAllSettings);

settingsRouter.get("/supportedLanguages", httpGetSupportedLanguages);

settingsRouter.get(
  "/languageFeatures/:language",
  httpGetLanguageFeaturesForLanguage
);
