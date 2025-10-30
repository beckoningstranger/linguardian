import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import {
  addNewlyLearnedItems,
  createUser,
  getUser,
  isTaken,
  updateReviewedItems,
  updateUser,
} from "@/models/users.model";

import {
  errorResponse,
  formatZodErrors,
  successMessageResponse,
  successResponse,
} from "@/lib/utils/shared";

import {
  isTakenParamsSchema,
  learningDataUpdateSchema,
  loginUserParamsSchema,
  registrationDataSchema,
  SessionUser,
  updateUserSchema,
  userSchema,
} from "@/lib/contracts";
import { AuthenticatedRequest } from "@/lib/types";

// GET

export async function getCurrentUserController(
  req: AuthenticatedRequest,
  res: Response
) {
  const id = req.auth.id;
  try {
    const response = await getUser({ method: "_id", query: id });
    if (!response.success) {
      return errorResponse(res, 400, response.error);
    }

    const result = userSchema.safeParse(response.data);
    if (!result.success) {
      return errorResponse(res, 400, formatZodErrors(result.error));
    }

    return successResponse(res, 200, result.data);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function isTakenController(req: Request, res: Response) {
  const result = isTakenParamsSchema.safeParse(req.query);
  if (!result.success) return errorResponse(res, 400, "Invalid request");

  const { mode, value } = result.data;

  try {
    const taken = await isTaken(mode, value);
    if (taken) successResponse(res, 200, true);
    else successResponse(res, 200, false);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

// POST

export async function createUserController(req: Request, res: Response) {
  const result = registrationDataSchema.safeParse(req.body as unknown);
  if (!result.success) {
    return errorResponse(res, 400, formatZodErrors(result.error));
  }

  const response = await createUser(result.data);
  if (!response.success) return errorResponse(res, 500, response.error);

  return successMessageResponse(res, 201, "User created successfully! 🎉");
}

export async function loginUserController(req: Request, res: Response) {
  try {
    const result = loginUserParamsSchema.safeParse(req.body as unknown);

    if (!result.success) {
      return errorResponse(res, 400, formatZodErrors(result.error));
    }

    const loginData = result.data;
    const response = await getUser({
      method: loginData.method,
      query: loginData.id,
    });

    if (!response.success)
      return errorResponse(res, 401, "Invalid credentials");

    const sensitiveUser = response.data;
    if (sensitiveUser.registeredVia !== loginData.method) {
      return errorResponse(res, 401, "Invalid login method for this account");
    }

    if (loginData.method === "email" && loginData.password) {
      const isPasswordCorrect = sensitiveUser.password
        ? await bcrypt.compare(loginData.password, sensitiveUser.password)
        : false;

      if (!sensitiveUser.password || !isPasswordCorrect)
        return errorResponse(res, 401, "Invalid credentials");
    }

    const { id } = sensitiveUser;
    const sessionUser: SessionUser = { id };
    return successResponse(res, 200, sessionUser);
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: (err as Error).message || "Unknown error occurred",
    });
  }
}

// PATCH

export async function updateUserController(
  req: AuthenticatedRequest,
  res: Response
) {
  const routeUserId = req.params.id;
  const trustedId = req.auth.id;

  if (trustedId !== routeUserId)
    errorResponse(res, 400, "Authenticated user does not match route user ID");

  try {
    const result = updateUserSchema.safeParse(req.body as unknown);
    if (!result.success) {
      return errorResponse(res, 400, formatZodErrors(result.error));
    }

    const userUpdate = { ...result.data, id: trustedId };
    const response = await updateUser(userUpdate);
    if (!response.success) return errorResponse(res, 404, "User not found");

    return successMessageResponse(res, 200, "User updated successfully 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function updateLearningDataController(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.auth.id;

  const result = learningDataUpdateSchema.safeParse(req.body as unknown);

  if (!result.success)
    return errorResponse(res, 400, "Could not validate learning update");
  const { language, mode, items } = result.data;

  if (mode === "overstudy")
    return successMessageResponse(
      res,
      200,
      "Great work! Overstudy session don't affect your learning progress. 🎉"
    );

  const response =
    mode === "learn"
      ? await addNewlyLearnedItems(items, userId, language)
      : await updateReviewedItems(items, userId, language);

  if (!response)
    return errorResponse(res, 500, "Could not update learned items");

  return successMessageResponse(
    res,
    200,
    "Your learning progress was saved successfully 🎉"
  );
}
