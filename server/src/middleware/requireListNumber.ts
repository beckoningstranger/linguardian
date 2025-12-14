import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/utils";

export function requireListNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const raw = req.params.listNumber;
  if (raw == null) {
    return errorResponse(res, 400, "Missing list number in route parameter");
  }

  const string = String(raw).trim();
  const listNumber = Number(string);

  if (!Number.isInteger(listNumber) || listNumber <= 0) {
    return errorResponse(res, 400, "Invalid list number in route parameter");
  }
  req.listNumber = listNumber;
  next();
}
