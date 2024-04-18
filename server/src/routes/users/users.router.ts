import express from "express";
import {
  httpAddListToDashboard,
  httpAddNewLanguage,
  httpGetNextUserId,
  httpGetLearnedLanguageData,
  httpGetUserById,
  httpUpdateLearnedItems,
  httpSetNativeLanguage,
} from "./users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/get/:id", httpGetUserById);

usersRouter.get(
  "/getLearnedLanguageData/:language/:userId",
  httpGetLearnedLanguageData
);

usersRouter.post(
  "/addListToDashboard/:userId/:listNumber",
  httpAddListToDashboard
);

usersRouter.post("/addNewLanguage/:userId/:language", httpAddNewLanguage);

usersRouter.post(
  "/updateLearnedItems/:userId/:language/:mode",
  httpUpdateLearnedItems
);

usersRouter.get("/nextUserId", httpGetNextUserId);

usersRouter.post("/setNativeLanguage/:userId/:language", httpSetNativeLanguage);
