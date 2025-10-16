import express from "express";

import { csvUploadMiddleware } from "@/lib/middleware/csvUpload";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { requireListAuthor } from "@/lib/middleware/requireListAuthor";
import { requireListNumber } from "@/lib/middleware/requireListNumber";
import {
  asAuthenticatedListRequest,
  asAuthenticatedRequest,
} from "@/lib/utils";
import {
  addItemToUnitController,
  createListController,
  createUnitController,
  deleteListController,
  deleteListItemController,
  deleteUnitController,
  renameUnitController,
  reorderUnitsController,
  updateListDetailsController,
} from "@/routes/lists/lists.controller";

export const listsRouter = express.Router();

// POST
listsRouter.post(
  "/create",
  requireAuth,
  csvUploadMiddleware,
  asAuthenticatedRequest(createListController)
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
