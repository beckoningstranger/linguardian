import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/lib/utils";

export function requireFileName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file || !req.file.filename)
    return errorResponse(res, 400, "No file attached to request");

  req.fileName = req.file.filename;
  next();
}
