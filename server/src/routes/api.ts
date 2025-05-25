import express from "express";
import { itemsRouter } from "./items/items.router";
import { lemmasRouter } from "./lemmas/lemmas.router";
import { listsRouter } from "./lists/lists.router";
import { usersRouter } from "./users/users.router";

const api = express.Router();

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);
api.use("/lists", listsRouter);
api.use("/users", usersRouter);

export default api;
