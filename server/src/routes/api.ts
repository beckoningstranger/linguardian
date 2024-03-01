import express from "express";
import { lemmasRouter } from "./lemmas/lemmas.router.js";
import { itemsRouter } from "./items/items.router.js";
import { listsRouter } from "./lists/lists.router.js";

const api = express.Router();

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);
api.use("/lists", listsRouter);

export default api;
