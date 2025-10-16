import { NextFunction, Request, Response } from "express";

import { ListAuthors } from "@/lib/contracts";
import { errorResponse } from "@/lib/utils";
import { getListAuthorsByListNumber } from "@/models/lists.model";

export async function requireListAuthor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // req.auth will be attached if we use requireAuth middleware
    if (!req.auth) return errorResponse(res, 401, "Unauthorized");

    // req.listNumber will be attached if we use requireListNumber middleware
    if (!req.listNumber) return errorResponse(res, 400, "No list number found");

    const trustedId = req.auth.id;
    const listNumber = req.listNumber;

    const listResponse = await getListAuthorsByListNumber(listNumber);
    if (!listResponse.success || !listResponse.data) {
      return errorResponse(res, 404, "List not found");
    }

    const authors: ListAuthors = listResponse.data.authors;

    if (!authors.includes(trustedId)) {
      return errorResponse(res, 403, "Only list authors may edit this list");
    }

    next();
  } catch (err) {
    return errorResponse(res, 500, (err as Error).message);
  }
}
