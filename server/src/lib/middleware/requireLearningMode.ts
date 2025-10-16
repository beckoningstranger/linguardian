import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/lib/utils";
import { learningModeSchema } from "../contracts";

export function requireLearningMode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = learningModeSchema.safeParse(req.params.mode);
  if (!result.success) return errorResponse(res, 400, "Invalid learning mode");

  req.learningMode = result.data;
  next();
}
