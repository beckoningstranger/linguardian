import express from "express";

import { requireAuth } from "@/middleware/requireAuth";
import { requireItemId } from "@/middleware/requireItemId";
import { asAuthenticatedItemRequest, asAuthenticatedRequest } from "@/utils";
import {
    createItemController,
    deleteItemController,
    getItemController,
    findItemIdBySlugController,
    findItemsByQueryController,
    updateItemController,
} from "@/controllers/items.controller";

export const itemsRouter = express.Router();

// GET
itemsRouter.get("/search", findItemsByQueryController);
itemsRouter.get("/id/:itemSlug", findItemIdBySlugController);
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
