import { NextFunction, Request, Response } from "express";
import { jwtDecrypt } from "jose";

import { jwtPayLoadSchema } from "../contracts";
import { errorResponse } from "../utils";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
  if (!NEXTAUTH_SECRET)
    throw new Error("NEXTAUTH_SECRET not found in environment");

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const key = Buffer.from(NEXTAUTH_SECRET, "base64");
    const { payload } = await jwtDecrypt(token, key);

    const result = jwtPayLoadSchema.safeParse(payload);
    if (!result.success)
      return errorResponse(res, 401, "Invalid token structure");

    req.auth = result.data;
    next();
  } catch (err) {
    console.error("requireAuth catch block", err);
    return errorResponse(res, 403, "Invalid or expired token");
  }
}
