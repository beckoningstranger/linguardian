import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/utils";
import { supportedLanguageSchema } from "@linguardian/shared/contracts";

export function requireLangCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = supportedLanguageSchema.safeParse(req.params.langCode);
  if (!result.success) return errorResponse(res, 400, "Invalid language code");

  req.langCode = result.data;
  next();
}
