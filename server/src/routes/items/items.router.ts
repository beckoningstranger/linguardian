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
  "/getBySlug/:queryItemLanguage/:slug/:userLanguages",
  httpGetFullyPopulatedItemBySlug
);

itemsRouter.get("/getAllSlugsForLanguage/:language", httpGetAllSlugForLanguage);

itemsRouter.get("/findItems/:languages/:query", httpFindItemsByName);
