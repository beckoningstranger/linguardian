import express from "express";
import {
  httpGetAllSettings,
  httpGetLanguageFeaturesForLanguage,
  httpGetSupportedLanguages,
  httpGetUser,
} from "./settings.controller.js";

export const settingsRouter = express.Router();

settingsRouter.get("/all", httpGetAllSettings);

settingsRouter.get("/supportedLanguages", httpGetSupportedLanguages);

settingsRouter.get(
  "/languageFeatures/:language",
  httpGetLanguageFeaturesForLanguage
);

settingsRouter.get("/user", httpGetUser);
