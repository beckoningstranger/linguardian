import express from "express";
import {
  httpEditOrCreateItem,
  httpFindItemsByName,
  httpGetAllSlugsForLanguage,
  httpGetFullyPopulatedItemBySlug,
  httpGetItemBySlug,
} from "./items.controller";

export const itemsRouter = express.Router();

// GET

itemsRouter.get("/getItemBySlug/:slug", httpGetItemBySlug);

itemsRouter.get(
  "/getPopulatedItemBySlug/:slug/:userLanguages",
  httpGetFullyPopulatedItemBySlug
);

itemsRouter.get(
  "/getAllSlugsForLanguage/:language",
  httpGetAllSlugsForLanguage
);

itemsRouter.get("/findItems/:languages/:query", httpFindItemsByName);

// POST

itemsRouter.post("/editOrCreateBySlug/:slug", httpEditOrCreateItem);
