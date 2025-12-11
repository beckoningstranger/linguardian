import { Request, Response, NextFunction } from "express";
import { env } from "@/lib/env";
import logger from "@/lib/logger";

import { AppError } from "@/lib/app-error";
import { errorResponse } from "@/lib/utils";

/**
 * Global error handler middleware
 * 
 * Handles:
 * - AppError instances (operational errors)
 * - Zod validation errors
 * - Mongoose errors
 * - Unexpected errors (500)
 * 
 * Should be added as the last middleware in app.ts
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If response already sent, delegate to Express default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    return errorResponse(res, 400, `Validation error: ${err.message}`);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return errorResponse(
      res,
      400,
      `Validation error: ${err.message}`
    );
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid ID format");
  }

  // Handle duplicate key errors (MongoDB)
  if ((err as any).code === 11000) {
    return errorResponse(
      res,
      409,
      "Duplicate entry: This resource already exists"
    );
  }

  // Log unexpected errors for debugging
  logger.error("Unexpected error", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    path: req.path,
    ip: req.ip,
    method: req.method,
  });

  // Default to 500 for unexpected errors
  return errorResponse(
    res,
    500,
    env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message || "An unexpected error occurred"
  );
}
