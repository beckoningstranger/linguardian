import express from "express";
import {
  httpGetUserById,
  httpGetUserWithPopulatedLearnedLists,
} from "./users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/get/:id", httpGetUserById);

usersRouter.get(
  "/getLearnedLists/:language/:userId",
  httpGetUserWithPopulatedLearnedLists
);
