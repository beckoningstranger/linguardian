import { Request, Response } from "express";

import {
  createItemParamsSchema,
  fetchItemByIdParamsSchema,
  fetchItemIdBySlugParamsSchema,
  itemSchemaWithPopulatedTranslations,
  searchDictionaryParamsSchema,
} from "@/lib/contracts";
import { AuthenticatedItemRequest, AuthenticatedRequest } from "@/lib/types";
import {
  assertNever,
  errorResponse,
  formatZodErrors,
  successResponse,
} from "@/lib/utils";
import {
  createNewItem,
  getItemIdBySlug,
  getPopulatedItemById,
  searchDictionary,
  updateExistingItem,
} from "@/models/item.model.js";
import { addItemToUnit } from "@/models/list.model";

export async function getItemIdBySlugController(req: Request, res: Response) {
  const result = fetchItemIdBySlugParamsSchema.safeParse(req.params);
  if (!result.success) return errorResponse(res, 400, "Request invalid");

  const itemSlug = result.data.itemSlug;
  const response = await getItemIdBySlug(itemSlug);
  if (!response.success)
    return errorResponse(res, 404, `Item with slug ${itemSlug} not found`);

  return successResponse(res, 200, response.data.id);
}

export async function getItemController(req: Request, res: Response) {
  const result = fetchItemByIdParamsSchema.safeParse(req.params);
  if (!result.success) return errorResponse(res, 400, "Request invalid");

  const itemId = result.data.id;

  const response = await getPopulatedItemById(itemId);
  if (!response.success)
    return errorResponse(res, 404, `Item with id ${itemId} not found`);

  const item = response.data;

  // logObjectPropertySizes(item);
  return successResponse(res, 200, item);
}

export async function createItemController(
  req: AuthenticatedRequest,
  res: Response
) {
  const body = req.body as unknown;

  const result = createItemParamsSchema.safeParse(body);
  if (!result.success)
    return errorResponse(
      res,
      400,
      `Could not validate item:\n${formatZodErrors(result.error)}`
    );

  const { item, listNumber, unitName } = result.data;

  try {
    const response = await createNewItem(item);
    if (!response.success) return errorResponse(res, 400, response.error);
    const data = response.data;

    switch (data.type) {
      case "duplicate":
        return successResponse(res, 200, {
          type: data.type,
          message: data.message,
          redirectSlug: data.redirectSlug,
        });
      case "itemInfo": {
        if (listNumber && unitName) {
          const addToUnitResponse = await addItemToUnit(listNumber, {
            unitName,
            itemId: data.itemInfo.id,
          });
          if (!addToUnitResponse.success)
            return successResponse(res, 201, {
              message:
                "Item created successfully!  🎉\nbut could not add to unit! :-/",
              type: "itemInfo",
              itemInfo: data.itemInfo,
            });

          return successResponse(res, 201, {
            message: `Item successfully created and added to unit ${unitName}!  🎉`,
            type: "itemInfo",
            itemInfo: data.itemInfo,
          });
        }

        return successResponse(res, 201, {
          message: "Item created successfully! 🎉",
          type: "itemInfo",
          itemInfo: data.itemInfo,
        });
      }
      default:
        const _exhaustiveCheck: never = data;
        return assertNever(_exhaustiveCheck);
    }
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function updateItemController(
  req: AuthenticatedItemRequest,
  res: Response
) {
  const body = req.body as unknown;

  const result = itemSchemaWithPopulatedTranslations.safeParse(body);
  if (!result.success)
    return errorResponse(
      res,
      400,
      `Could not validate item:\n${formatZodErrors(result.error)}`
    );

  try {
    const response = await updateExistingItem(result.data);
    if (!response.success) return errorResponse(res, 400, response.error);
    if (response.data) {
      return successResponse(res, 200, {
        message: "Item updated successfully!  🎉",
        type: "itemInfo",
        itemInfo: response.data.itemInfo,
      });
    }
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function deleteItemController(
  req: AuthenticatedItemRequest,
  res: Response
) {
  const itemId = req.itemId;
  return errorResponse(res, 418, "Implement correctly");
}

export async function searchDictionaryController(req: Request, res: Response) {
  try {
    const { languages, query } = req.query;
    if (!query || !languages || typeof languages !== "string")
      return errorResponse(res, 400, "Missing query or languages");

    // languages comes as comma-separated string
    const languageArray = languages.split(",");

    const result = searchDictionaryParamsSchema.safeParse({
      query,
      languages: languageArray,
    });
    if (!result.success)
      return errorResponse(
        res,
        400,
        "Search query or search languages invalid"
      );

    const response = await searchDictionary(
      result.data.languages,
      result.data.query
    );
    if (!response.success) {
      console.error(`Search failed for query ${query}: ${response.error}`);
      return successResponse(res, 200, []);
    }
    return successResponse(res, 200, response.data);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}
