import express from "express";
import { httpGetOneItemById } from "./items.controller.js";

export const itemsRouter = express.Router();

itemsRouter.get("/getById/:id", httpGetOneItemById);
