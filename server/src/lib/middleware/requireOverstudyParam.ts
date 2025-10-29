import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";

export function requireOverstudyParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const raw = req.query.overstudy;

  if (raw === undefined) {
    req.overstudy = false; // default
    return next();
  }

  if (typeof raw === "string") {
    if (raw === "true") {
      req.overstudy = true;
      return next();
    }
    if (raw === "false") {
      req.overstudy = false;
      return next();
    }
  }

  return errorResponse(res, 400, "Invalid query param: overstudy");
}
