import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/lib/utils";

export function requireListNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const listNumber = Number(req.params.listNumber);

  if (!Number.isInteger(listNumber) || listNumber <= 0) {
    return errorResponse(res, 400, "Invalid list number in route parameter");
  }
  req.listNumber = listNumber;
  next();
}
