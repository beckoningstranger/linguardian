import express from "express";
import {
  httpGetOneItemById,
  httpGetOneItemByName,
} from "./items.controller.js";

export const itemsRouter = express.Router();

itemsRouter.get("/getByName/:language/:name", httpGetOneItemByName);

itemsRouter.get("/getById/:id", httpGetOneItemById);
