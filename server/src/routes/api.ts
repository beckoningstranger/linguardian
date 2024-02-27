import express from "express";
import { lemmasRouter } from "./lemmas/lemmas.router.js";
import { itemsRouter } from "./items/items.router.js";

const api = express.Router();

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);

export default api;
