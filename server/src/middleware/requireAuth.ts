import { NextFunction, Request, Response } from "express";
import { jwtDecrypt } from "jose";

import { jwtPayLoadSchema } from "@linguardian/shared/contracts";
import { AppError } from "@/utils/app-error";
import { env } from "@/config/env";
import logger from "@/utils/logger";
import { errorResponse } from "../utils";

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return errorResponse(res, 401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    try {
        const key = Buffer.from(env.NEXTAUTH_SECRET, "base64");
        const { payload } = await jwtDecrypt(token, key);

        const result = jwtPayLoadSchema.safeParse(payload);
        if (!result.success)
            return errorResponse(res, 401, "Invalid token structure");

        req.auth = result.data;
        next();
    } catch (err) {
        logger.error("requireAuth catch block", { error: err });
        next(new AppError(403, "Invalid or expired token"));
    }
}
