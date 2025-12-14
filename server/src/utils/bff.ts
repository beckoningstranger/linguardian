import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";

import {
  AuthenticatedRequest,
  HandlerOptions,
  HandlerOptionsAuthenticatedRequest,
} from "@/types/types";
import { errorResponse, formatZodErrors, successResponse } from "@/utils";

export function createAuthenticatedRequestHandler<TParams, TData>({
  parseParams,
  service,
  validateOutput,
}: HandlerOptionsAuthenticatedRequest<TParams, TData>) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = parseParams.safeParse(req.params);
      if (!parsed.success) {
        logger.error("Validation failed in createHandlerAuthenticatedRequest");
        return errorResponse(res, 400, formatZodErrors(parsed.error));
      }

      const params = parsed.data;
      const trustedId = req.auth.id;

      const data = await service(params, trustedId);
      const validated = validateOutput.safeParse(data);
      if (!validated.success) {
        return errorResponse(res, 500, formatZodErrors(validated.error));
      }

      return successResponse(res, 200, validated.data);
    } catch (err) {
      logger.error("Unexpected error processing query", { 
        query: req.query,
        error: err,
       });
      next(err);
    }
  };
}

export function createUnauthenticatedRequestHandler<TParams, TData>({
  parseParams,
  service,
  validateOutput,
}: HandlerOptions<TParams, TData>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = parseParams.safeParse(req.params);
      if (!parsed.success)
        return errorResponse(res, 400, formatZodErrors(parsed.error));

      const params = parsed.data;
      const data = await service(params);
      const validated = validateOutput.safeParse(data);
      if (!validated.success) {
        return errorResponse(res, 500, formatZodErrors(validated.error));
      }

      return successResponse(res, 200, validated.data);
    } catch (err) {
      logger.error("Unexpected error processing query", { 
        query: req.query,
        error: err,
       });
      next(err);
    }
  };
}

function getSizeInKB(obj: any): number {
  return Buffer.byteLength(JSON.stringify(obj), "utf8") / 1024;
}

export function logObjectPropertySizes(obj: Record<string, unknown>) {
  let totalSize = 0;
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      const size = getSizeInKB(value);
      totalSize += size;
      logger.debug("Object size", { key, sizeKB: size.toFixed(2) });
    } else {
      logger.debug("Object size undefined", { key });
    }
  }
  logger.debug("Total object size", { totalSizeKB: totalSize.toFixed(2) });
}
