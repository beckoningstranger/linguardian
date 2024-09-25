import express from "express";
import {
  httpEditOrCreateItem,
  httpFindItemsByName,
  httpGetAllSlugsForLanguage,
  httpGetFullyPopulatedItemBySlug,
  httpGetItemBySlug,
} from "./items.controller.js";

export const itemsRouter = express.Router();

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

itemsRouter.post("/editOrCreateBySlug/:slug", httpEditOrCreateItem);
