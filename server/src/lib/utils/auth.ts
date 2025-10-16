import { AuthTokenPayload } from "@/lib/contracts";
import {
  AuthenticatedItemRequest,
  AuthenticatedLearningSessionRequestForList,
  AuthenticatedLearningSessionRequestForUnit,
  AuthenticatedListRequest,
  AuthenticatedRequest,
} from "@/lib/types";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { errorResponse } from "./shared";

export function getAuth(req: Request): AuthTokenPayload {
  const auth = (req as Request & { auth: AuthTokenPayload }).auth;
  if (!auth) throw new Error("Missing auth payload");
  return auth;
}

export function asAuthenticatedRequest(
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next?: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
    return handler(req as AuthenticatedRequest, res, next);
  };
}

export function asAuthenticatedListRequest(
  handler: (
    req: AuthenticatedListRequest,
    res: Response,
    next?: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return errorResponse(res, 401, "Unauthorized");
    if (!req.listNumber) return errorResponse(res, 400, "No list number found");
    return handler(req as AuthenticatedListRequest, res, next);
  };
}

export function asAuthenticatedItemRequest(
  handler: (
    req: AuthenticatedItemRequest,
    res: Response,
    next?: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return errorResponse(res, 401, "Unauthorized");
    if (!req.itemId) return errorResponse(res, 400, "No item id found");
    return handler(req as AuthenticatedItemRequest, res, next);
  };
}

export function asAuthenticatedLearningSessionRequestForList(
  handler: (
    req: AuthenticatedLearningSessionRequestForList,
    res: Response,
    next?: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return errorResponse(res, 401, "Unauthorized");
    if (!req.listNumber)
      return errorResponse(res, 400, "No valid list number found");
    if (!req.learningMode)
      return errorResponse(res, 400, "No valid learning mode found");
    return handler(
      req as AuthenticatedLearningSessionRequestForList,
      res,
      next
    );
  };
}

export function asAuthenticatedLearningSessionRequestForUnit(
  handler: (
    req: AuthenticatedLearningSessionRequestForUnit,
    res: Response,
    next?: NextFunction
  ) => any
): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return errorResponse(res, 401, "Unauthorized");
    if (!req.listNumber)
      return errorResponse(res, 400, "No valid list number found");
    if (!req.learningMode)
      return errorResponse(res, 400, "No valid learning mode found");
    if (!req.unitNumber)
      return errorResponse(res, 400, "No valid unit number found");
    return handler(
      req as AuthenticatedLearningSessionRequestForUnit,
      res,
      next
    );
  };
}
