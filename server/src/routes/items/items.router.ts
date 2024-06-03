import express from "express";
import {
  httpFindItemsByName,
  httpGetAllSlugForLanguage,
  httpGetOneItemById,
  httpGetOneItemBySlug,
} from "./items.controller.js";

export const itemsRouter = express.Router();

itemsRouter.get("/getById/:id", httpGetOneItemById);

itemsRouter.get("/getBySlug/:language/:slug", httpGetOneItemBySlug);

itemsRouter.get("/getAllSlugsForLanguage/:language", httpGetAllSlugForLanguage);

itemsRouter.get("/findItems/:language/:query", httpFindItemsByName);
