import express from "express";
import {
  httpFindItemsByName,
  httpGetAllSlugForLanguage,
  httpGetFullyPopulatedItemBySlug,
  httpGetOneItemById,
} from "./items.controller.js";

export const itemsRouter = express.Router();

itemsRouter.get("/getById/:id", httpGetOneItemById);

itemsRouter.get(
  "/getBySlug/:language/:slug/:userNative",
  httpGetFullyPopulatedItemBySlug
);

itemsRouter.get("/getAllSlugsForLanguage/:language", httpGetAllSlugForLanguage);

itemsRouter.get("/findItems/:languages/:query", httpFindItemsByName);
