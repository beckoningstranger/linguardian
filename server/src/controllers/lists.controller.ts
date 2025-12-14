import { Response, NextFunction } from "express";

import { objectIdStringSchema } from "@linguardian/shared/contracts";
import {
    CreateListSuccessResponse,
    addUnitUpdateSchema,
    listDetailsUpdateSchema,
    unitNameUpdateSchema,
    unitOrderUpdateSchema,
    addItemToUnitUpdateSchema,
} from "@linguardian/shared/contracts";
import { unitNameSchema } from "@linguardian/shared/contracts";
import { importCSV } from "@/importCSV";
import { createNewListApiSchema } from "@/schemas";
import {
    AuthenticatedExpandListRequest,
    AuthenticatedListRequest,
    AuthenticatedRequest,
} from "@/types/types";
import {
    composeListUpdateMessage,
    errorResponse,
    formatResultMessage,
    formatZodErrors,
    normalizeCreateListBody,
    successMessageResponse,
    successResponse,
} from "@/utils";
import {
    addItemToUnit,
    addUnitToList,
    createList,
    deleteList,
    deleteUnitFromList,
    findListByListNumber,
    removeItemFromList,
    renameUnitName,
    updateList,
} from "@/repositories/list.repo";
import { findUser } from "@/repositories/user.repo";

// POST

export async function createListController(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const normalizedBody = normalizeCreateListBody(req.body, req.file);
    const userId = req.auth.id;
    const userResponse = await findUser({ method: "_id", query: userId });
    if (!userResponse.success) return errorResponse(res, 500, "User not found");
    const user = userResponse.data;

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
                const results = await importCSV(
                    req.file.filename,
                    newList.listNumber,
                    newList.language.code,
                    user.username
                );
                parsedListResponse.results = results;
                parsedListResponse.message = formatResultMessage(results);
            } catch (err) {
                parsedListResponse.message = `List created, but critical error during import:\n ${err}.`;
            }
        }

        return successResponse(res, 201, parsedListResponse);
    } catch (err) {
        next(err);
    }
}

export async function expandListWithCSVController(
    req: AuthenticatedExpandListRequest,
    res: Response,
    next: NextFunction
) {
    const listNumber = req.listNumber;
    const fileName = req.fileName;
    const userId = req.auth.id;
    const userResponse = await findUser({ method: "_id", query: userId });
    if (!userResponse.success) return errorResponse(res, 500, "User not found");
    const user = userResponse.data;

    const response = await findListByListNumber(listNumber);
    if (!response.success) return errorResponse(res, 400, "List not found");
    const listLanguageCode = response.data.language.code;

    try {
        const results = await importCSV(
            fileName,
            listNumber,
            listLanguageCode,
            user.username
        );

        const parsedListResponse: CreateListSuccessResponse = {
            listNumber: listNumber,
            listLanguage: listLanguageCode,
            results,
            message: formatResultMessage(results),
        };

        return successResponse(res, 201, parsedListResponse);
    } catch (err) {
        next(err);
    }
}

export async function createUnitController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

// PATCH

export async function updateListDetailsController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function renameUnitController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function reorderUnitsController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function addItemToUnitController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

// DELETE

export async function deleteListController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
) {
    const listNumber = req.listNumber;

    try {
        const response = await deleteList(listNumber);
        if (!response.success) return errorResponse(res, 404, response.error);

        return successMessageResponse(res, 200, "List was deleted 🎉");
    } catch (err) {
        next(err);
    }
}

export async function deleteUnitController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function deleteListItemController(
    req: AuthenticatedListRequest,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}
