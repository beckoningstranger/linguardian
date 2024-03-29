import express from "express";
import {
  httpAddListToDashboard,
  httpAddNewLanguage,
  httpGetLearnedLanguageData,
  httpGetUserById,
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
