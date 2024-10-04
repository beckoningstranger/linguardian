import express from "express";
import {
  httpAddListToLearnedLists,
  httpAddNewLanguageToLearn,
  httpAddNewRecentDictionarySearches,
  httpCreateUser,
  httpGetAllLearnedListsForUser,
  httpGetAllUserIds,
  httpGetLearnedLanguageDataForLanguage,
  httpGetLearnedList,
  httpGetNativeLanguageById,
  httpGetNextUserId,
  httpGetRecentDictionarySearches,
  httpGetUserByEmail,
  httpGetUserById,
  httpGetUserByUsernameSlug,
  httpIsEmailTaken,
  httpIsUsernameTaken,
  httpRemoveListFromDashboard,
  httpSetNativeLanguage,
  httpStopLearningLanguage,
  httpUpdateLearnedItems,
} from "./users.controller.js";

export const usersRouter = express.Router();

// GET

usersRouter.get("/get/:id", httpGetUserById);

usersRouter.get("/getByEmail/:email", httpGetUserByEmail);

usersRouter.get("/getByUsernameSlug/:usernameSlug", httpGetUserByUsernameSlug);

usersRouter.get(
  "/getLearnedLanguageDataForLanguage/:language/:userId",
  httpGetLearnedLanguageDataForLanguage
);

usersRouter.get(
  "/getLearnedList/:language/:userId/:listNumber",
  httpGetLearnedList
);

usersRouter.get("/isEmailTaken/:email", httpIsEmailTaken);

usersRouter.get("/isUsernameTaken/:username", httpIsUsernameTaken);

usersRouter.get("/nextUserId", httpGetNextUserId);

usersRouter.get("/getNativeLanguage/:userId", httpGetNativeLanguageById);

usersRouter.get("/getAllUserIds", httpGetAllUserIds);

usersRouter.get("/getLearnedLists/:userId", httpGetAllLearnedListsForUser);

usersRouter.get(
  "/getRecentDictionarySearches/:userId",
  httpGetRecentDictionarySearches
);

// POST

usersRouter.post("/createUser", httpCreateUser);

// PATCH

usersRouter.patch("/setNativeLanguage", httpSetNativeLanguage);

usersRouter.patch("/stopLearningLanguage", httpStopLearningLanguage);

usersRouter.patch("/addListToLearnedLists", httpAddListToLearnedLists);

usersRouter.patch("/addNewLanguageToLearn", httpAddNewLanguageToLearn);

usersRouter.patch(
  "/addRecentDictionarySearches",
  httpAddNewRecentDictionarySearches
);

usersRouter.patch("/updateLearnedItems", httpUpdateLearnedItems);

// DELETE

usersRouter.delete(
  "/removeListFromDashboard/:userId/:listNumber",
  httpRemoveListFromDashboard
);

// PUT
