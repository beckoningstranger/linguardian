import { Response } from "express";

import {
  addItemToUnitUpdateSchema,
  addUnitUpdateSchema,
  CreateListSuccessResponse,
  listDetailsUpdateSchema,
  objectIdStringSchema,
  unitNameSchema,
  unitNameUpdateSchema,
  unitOrderUpdateSchema,
} from "@/lib/contracts";
import { parseCSV } from "@/lib/parsecsv";
import { createNewListApiSchema } from "@/lib/schemas";
import {
  AuthenticatedExpandListRequest,
  AuthenticatedListRequest,
  AuthenticatedRequest,
} from "@/lib/types";
import {
  composeListUpdateMessage,
  errorResponse,
  formatZodErrors,
  normalizeCreateListBody,
  successMessageResponse,
  successResponse,
} from "@/lib/utils";
import {
  addItemToUnit,
  addUnitToList,
  createList,
  deleteList,
  deleteUnitFromList,
  getListByListNumber,
  removeItemFromList,
  renameUnitName,
  updateList,
} from "@/models/lists.model";
import { formatResultMessage } from "@/lib/utils/parsecsv";

// POST

export async function createListController(
  req: AuthenticatedRequest,
  res: Response
) {
  const normalizedBody = normalizeCreateListBody(req.body, req.file);

  try {
    const result = createNewListApiSchema.safeParse(normalizedBody);
    if (!result.success) {
      return errorResponse(res, 400, formatZodErrors(result.error));
    }
    const response = await createList(result.data);
    if (!response.success) {
      return errorResponse(res, 500, "Failed to persist list");
    }
    const newList = response.data;

    const parsedListResponse: CreateListSuccessResponse = {
      listNumber: newList.listNumber,
      listLanguage: newList.language.code,
      results: [],
      message: `${newList.name} was created! 🎉`,
    };

    if (req.file && req.file.size > 0) {
      try {
        const results = await parseCSV(
          req.file.filename,
          newList.listNumber,
          newList.language.code
        );
        parsedListResponse.results = results;
        const failedCount = results.filter((r) => r.status === "error").length;
        parsedListResponse.message =
          failedCount > 0
            ? `List created 🎉, but ${failedCount} ${
                failedCount === 1 ? "item" : "items"
              } could not be imported`
            : "List created! 🎉";
      } catch (err) {
        parsedListResponse.message = `List created, but critical error during import:\n ${err}.`;
      }
    }

    return successResponse(res, 201, parsedListResponse);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function expandListWithCSVController(
  req: AuthenticatedExpandListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  const fileName = req.fileName;

  const response = await getListByListNumber(listNumber);
  if (!response.success) return errorResponse(res, 400, "List not found");
  const listLanguageCode = response.data.language.code;

  try {
    const results = await parseCSV(fileName, listNumber, listLanguageCode);
    console.log("RESULTS", results);

    const parsedListResponse: CreateListSuccessResponse = {
      listNumber: listNumber,
      listLanguage: listLanguageCode,
      results,
      message: formatResultMessage(results),
    };

    return successResponse(res, 201, parsedListResponse);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function createUnitController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  const body = req.body as unknown;
  const result = addUnitUpdateSchema.safeParse(body);
  if (!result.success) {
    return errorResponse(res, 400, formatZodErrors(result.error));
  }
  const listUpdate = result.data;

  try {
    const response = await addUnitToList(listNumber, listUpdate.unitName);
    if (!response.success) {
      return errorResponse(res, 400, response.error);
    }

    return successMessageResponse(res, 201, "Unit created successfully 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

// PATCH

export async function updateListDetailsController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  const body = req.body as unknown;
  const result = listDetailsUpdateSchema.safeParse(body);
  if (!result.success)
    return errorResponse(res, 400, formatZodErrors(result.error));

  const listUpdate = result.data;

  try {
    const response = await updateList(listUpdate, listNumber);

    if (!response.success) return errorResponse(res, 404, response.error);

    const message = composeListUpdateMessage(result.data);
    return successMessageResponse(res, 200, message);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function renameUnitController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  try {
    const body = req.body as unknown;
    const result = unitNameUpdateSchema.safeParse(body);
    if (!result.success)
      return errorResponse(res, 400, formatZodErrors(result.error));

    const unitNameUpdate = result.data;
    const response = await renameUnitName(listNumber, unitNameUpdate);

    if (!response.success) return errorResponse(res, 404, response.error);
    return successMessageResponse(res, 200, "Updated unit name 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function reorderUnitsController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  try {
    const body = req.body as unknown;
    const result = unitOrderUpdateSchema.safeParse(body);
    if (!result.success)
      return errorResponse(res, 400, formatZodErrors(result.error));

    const listUpdate = result.data;
    const response = await updateList(listUpdate, listNumber);

    if (!response.success) return errorResponse(res, 404, response.error);
    return successMessageResponse(res, 200, "Updated unit order 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function addItemToUnitController(
  req: AuthenticatedListRequest,
  res: Response
) {
  try {
    const listNumber = req.listNumber;

    const body = req.body as unknown;
    const result = addItemToUnitUpdateSchema.safeParse(body);
    if (!result.success)
      return errorResponse(res, 400, formatZodErrors(result.error));

    const response = await addItemToUnit(listNumber, result.data);

    if (!response.success) return errorResponse(res, 404, response.error);
    const message = response.data.message || "Item added successfully! 🎉";

    return successMessageResponse(res, 200, message);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

// DELETE

export async function deleteListController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;

  try {
    const response = await deleteList(listNumber);
    if (!response.success) return errorResponse(res, 404, response.error);

    return successMessageResponse(res, 200, "List was deleted 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function deleteUnitController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;

  const result = unitNameSchema.safeParse(req.params.unitName);
  if (!result.success)
    return errorResponse(res, 400, formatZodErrors(result.error));
  const unitName = result.data;

  try {
    const response = await deleteUnitFromList(listNumber, unitName);
    if (!response.success) {
      return errorResponse(res, 400, response.error);
    }

    return successMessageResponse(res, 200, "Unit deleted successfully 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function deleteListItemController(
  req: AuthenticatedListRequest,
  res: Response
) {
  const listNumber = req.listNumber;
  const result = objectIdStringSchema.safeParse(req.params.itemId);
  if (!result.success)
    return errorResponse(res, 400, formatZodErrors(result.error));
  const itemId = result.data;

  try {
    const response = await removeItemFromList(listNumber, itemId);
    if (!response.success) return errorResponse(res, 400, response.error);

    if (response.data.modifiedCount === 0)
      return errorResponse(res, 404, "Item not found in list");

    return successMessageResponse(res, 200, "Item deleted successfully 🎉");
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}
