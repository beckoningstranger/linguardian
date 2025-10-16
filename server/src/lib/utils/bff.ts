import { Request, Response } from "express";

import {
  AuthenticatedRequest,
  HandlerOptions,
  HandlerOptionsAuthenticatedRequest,
} from "@/lib/types";
import { errorResponse, formatZodErrors, successResponse } from "@/lib/utils";

export function createAuthenticatedRequestHandler<TParams, TData>({
  parseParams,
  service,
  validateOutput,
}: HandlerOptionsAuthenticatedRequest<TParams, TData>) {
  return async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = parseParams.safeParse(req.params);
      if (!parsed.success) {
        console.error("validation failed in createHandlerAuthenticatedRequest");
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
      console.error("Unexpected error processing query:", {
        query: req.query,
        error: err,
      });
      return errorResponse(res, 500, "Internal server error");
    }
  };
}

export function createUnauthenticatedRequestHandler<TParams, TData>({
  parseParams,
  service,
  validateOutput,
}: HandlerOptions<TParams, TData>) {
  return async (req: Request, res: Response) => {
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
      console.error("Unexpected error processing query:", {
        query: req.query,
        error: err,
      });
      return errorResponse(res, 500, "Internal server error");
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
      console.log(`${key}: ${size.toFixed(2)} KB`);
    } else {
      console.log(`${key}: undefined`);
    }
  }
  console.log(`Total: ${totalSize.toFixed(2)} KB`);
}
