import express from "express";
import { lemmasRouter } from "./lemmas/lemmas.router.js";
import { itemsRouter } from "./items/items.router.js";
import { listsRouter } from "./lists/lists.router.js";
import { settingsRouter } from "./settings/settings.router.js";
import { usersRouter } from "./users/users.router.js";

const api = express.Router();

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);
api.use("/lists", listsRouter);
api.use("/settings", settingsRouter);
api.use("/users", usersRouter);

export default api;
