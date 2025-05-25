import express from "express";
import {
  httpAddNewRecentDictionarySearches,
  httpCreateUser,
  httpGetAllUsernameSlugs,
  httpGetDashboardData,
  httpGetLearningDataForLanguage,
  httpGetLearningDataForUser,
  httpGetLearningSessionForList,
  httpGetNativeLanguageById,
  httpGetNextUserId,
  httpGetRecentDictionarySearches,
  httpGetUserByEmail,
  httpGetUserById,
  httpGetUserByUsernameSlug,
  httpIsEmailTaken,
  httpIsUsernameTaken,
  httpSetLearnedLanguagesForUserId,
  httpSetLearnedListsForUserId,
  httpSetNativeLanguageForUserId,
  httpUpdateLearnedItems,
} from "./users.controller";

export const usersRouter = express.Router();

// GET

usersRouter.get("/get/:id", httpGetUserById);

usersRouter.get("/getByEmail/:email", httpGetUserByEmail);

usersRouter.get("/getByUsernameSlug/:usernameSlug", httpGetUserByUsernameSlug);

usersRouter.get("/isEmailTaken/:email", httpIsEmailTaken);

usersRouter.get("/isUsernameTaken/:username", httpIsUsernameTaken);

usersRouter.get("/nextUserId", httpGetNextUserId);

usersRouter.get("/getNativeLanguage/:userId", httpGetNativeLanguageById);

usersRouter.get("/getAllUsernameSlugs", httpGetAllUsernameSlugs);

usersRouter.get("/getLearnedList/:language/:userId/:listNumber");

usersRouter.get(
  "/getRecentDictionarySearches/:userId",
  httpGetRecentDictionarySearches
);

usersRouter.get("/getLearningDataForUser/:userId", httpGetLearningDataForUser);

usersRouter.get(
  "/getLearningDataForLanguage/:userId/:language",
  httpGetLearningDataForLanguage
);

usersRouter.get(
  "/getDashboardDataForUserId/:userId/:language",
  httpGetDashboardData
);
usersRouter.get(
  "/getLearningSessionForList/:userId/:listNumber/:mode/:unitNumber?",
  httpGetLearningSessionForList
);

// POST

usersRouter.post("/createUser", httpCreateUser);

// PATCH

usersRouter.patch(
  "/addRecentDictionarySearches",
  httpAddNewRecentDictionarySearches
);

usersRouter.patch("/updateLearnedItems", httpUpdateLearnedItems);

// PUT

usersRouter.put("/setNativeLanguageForUserId", httpSetNativeLanguageForUserId);

usersRouter.put("/setLearnedListsForUserId", httpSetLearnedListsForUserId);

usersRouter.put(
  "/setLearnedLanguagesForUserId",
  httpSetLearnedLanguagesForUserId
);

// DELETE
