import express from "express";
import {
  httpAddListToDashboard,
  httpAddNewLanguage,
  httpAddNewRecentDictionarySearches,
  httpGetAllLearnedListsForUser,
  httpGetAllUserIds,
  httpGetLearnedLanguageData,
  httpGetLearnedList,
  httpGetNativeLanguageById,
  httpGetNextUserId,
  httpGetRecentDictionarySearches,
  httpGetUserById,
  httpGetUserByUsernameSlug,
  httpRemoveListFromDashboard,
  httpSetNativeLanguage,
  httpUpdateLearnedItems,
} from "./users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/get/:id", httpGetUserById);

usersRouter.get("/getByUsernameSlug/:usernameSlug", httpGetUserByUsernameSlug);

usersRouter.get(
  "/getLearnedLanguageData/:language/:userId",
  httpGetLearnedLanguageData
);

usersRouter.get(
  "/getLearnedList/:language/:userId/:listNumber",
  httpGetLearnedList
);

usersRouter.post(
  "/addListToDashboard/:userId/:listNumber",
  httpAddListToDashboard
);

usersRouter.post(
  "/removeListFromDashboard/:userId/:listNumber",
  httpRemoveListFromDashboard
);

usersRouter.post("/addNewLanguage/:userId/:language", httpAddNewLanguage);

usersRouter.post(
  "/updateLearnedItems/:userId/:language/:mode",
  httpUpdateLearnedItems
);

usersRouter.get("/nextUserId", httpGetNextUserId);

usersRouter.post("/setNativeLanguage/:userId/:language", httpSetNativeLanguage);

usersRouter.get("/getNativeLanguage/:userId", httpGetNativeLanguageById);

usersRouter.get("/getAllUserIds", httpGetAllUserIds);

usersRouter.get("/getLearnedLists/:userId", httpGetAllLearnedListsForUser);

usersRouter.post(
  "/addRecentDictionarySearches/:userId/:slug",
  httpAddNewRecentDictionarySearches
);

usersRouter.get(
  "/getRecentDictionarySearches/:userId",
  httpGetRecentDictionarySearches
);
