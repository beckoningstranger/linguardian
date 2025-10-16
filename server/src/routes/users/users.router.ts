import express from "express";

import { loginRateLimiter } from "@/lib/middleware/rateLimiters";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { asAuthenticatedRequest } from "@/lib/utils";
import {
  createUserController,
  getCurrentUserController,
  isTakenController,
  loginUserController,
  updateLearningDataController,
  updateUserController,
} from "@/routes/users/users.controller";

export const usersRouter = express.Router();

// GET

usersRouter.get(
  "/me",
  requireAuth,
  asAuthenticatedRequest(getCurrentUserController)
);
usersRouter.get("/isTaken", isTakenController);

// POST

usersRouter.post("/create", createUserController);
usersRouter.post("/login", loginRateLimiter, loginUserController);

// PATCH

usersRouter.patch(
  "/:id",
  requireAuth,
  asAuthenticatedRequest(updateUserController)
);

usersRouter.patch(
  "/:id/learn",
  requireAuth,
  asAuthenticatedRequest(updateLearningDataController)
);
