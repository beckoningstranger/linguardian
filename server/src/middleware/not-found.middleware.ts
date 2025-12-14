import { Request, Response, NextFunction } from "express";

import { errorResponse } from "@/utils";

/**
 * 404 Not Found handler middleware
 * 
 * Should be added after all routes but before the error handler
 * in app.ts
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  errorResponse(res, 404, `Route ${req.method} ${req.path} not found`);
}
