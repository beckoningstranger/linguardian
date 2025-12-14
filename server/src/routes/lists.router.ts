import express from "express";

import { csvUploadMiddleware } from "@/middleware/csvUpload";
import { requireAuth } from "@/middleware/requireAuth";
import { requireFileName } from "@/middleware/requireFileName";
import { requireListAuthor } from "@/middleware/requireListAuthor";
import { requireListNumber } from "@/middleware/requireListNumber";
import {
    asAuthenticatedExpandListRequest,
    asAuthenticatedListRequest,
    asAuthenticatedRequest,
} from "@/utils";
import {
    addItemToUnitController,
    createListController,
    createUnitController,
    deleteListController,
    deleteListItemController,
    deleteUnitController,
    expandListWithCSVController,
    renameUnitController,
    reorderUnitsController,
    updateListDetailsController,
} from "@/controllers/lists.controller";

export const listsRouter = express.Router();

// POST
listsRouter.post(
    "/create",
    requireAuth,
    csvUploadMiddleware,
    asAuthenticatedRequest(createListController)
);

listsRouter.post(
    "/expandWithCSV/:listNumber/",
    requireAuth,
    csvUploadMiddleware,
    requireListNumber,
    requireListAuthor,
    requireFileName,
    asAuthenticatedExpandListRequest(expandListWithCSVController)
);

listsRouter.post(
    "/:listNumber/units",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(createUnitController)
);

// PATCH

listsRouter.patch(
    "/:listNumber",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(updateListDetailsController)
);
listsRouter.patch(
    "/:listNumber/units",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(renameUnitController)
);
listsRouter.patch(
    "/:listNumber/units/order",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(reorderUnitsController)
);

listsRouter.patch(
    "/:listNumber/units/items",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(addItemToUnitController)
);

// DELETE

listsRouter.delete(
    "/:listNumber",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(deleteListController)
);
listsRouter.delete(
    "/:listNumber/item/:itemId",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(deleteListItemController)
);
listsRouter.delete(
    "/:listNumber/units/:unitName",
    requireAuth,
    requireListNumber,
    requireListAuthor,
    asAuthenticatedListRequest(deleteUnitController)
);
