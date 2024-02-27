import express from "express";
import { httpGetOneItem } from "./items.controller.js";

export const itemsRouter = express.Router();

itemsRouter.get("/:language/:item", httpGetOneItem);
