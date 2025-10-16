import express from "express";

import { requireAuth } from "@/lib/middleware/requireAuth";
import { requireItemId } from "@/lib/middleware/requireItemId";
import {
  asAuthenticatedItemRequest,
  asAuthenticatedRequest,
} from "@/lib/utils";
import {
  createItemController,
  deleteItemController,
  getItemController,
  getItemIdBySlugController,
  searchDictionaryController,
  updateItemController,
} from "@/routes/items/items.controller";

export const itemsRouter = express.Router();

// GET
itemsRouter.get("/search", searchDictionaryController);
itemsRouter.get("/id/:itemSlug", getItemIdBySlugController);
itemsRouter.get("/:id", getItemController);

// POST

itemsRouter.post(
  "/create",
  requireAuth,
  asAuthenticatedRequest(createItemController)
);

// PATCH
itemsRouter.patch(
  "/:id",
  requireAuth,
  requireItemId,
  asAuthenticatedItemRequest(updateItemController)
);

// DELETE
itemsRouter.delete(
  "/:id",
  requireAuth,
  requireItemId,
  asAuthenticatedItemRequest(deleteItemController)
);
