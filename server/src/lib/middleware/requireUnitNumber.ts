import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/lib/utils";

export function requireUnitNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const unitNumber = Number(req.params.unitNumber);

  if (!Number.isInteger(unitNumber) || unitNumber <= 0) {
    return errorResponse(res, 400, "Invalid list number in route parameter");
  }
  req.unitNumber = unitNumber;
  next();
}
