import { NextFunction, Request, Response } from "express";

import { errorResponse } from "@/utils";
import { objectIdStringSchema } from "@linguardian/shared/contracts";

export function requireItemId(req: Request, res: Response, next: NextFunction) {
  const result = objectIdStringSchema.safeParse(req.params.id);
  if (!result.success)
    return errorResponse(res, 400, "Invalid item id in route parameter");

  req.itemId = result.data;
  next();
}
