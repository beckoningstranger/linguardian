import express from "express";

import { bffRouter } from "@/routes/bff.router";
import { itemsRouter } from "@/routes/items.router";
import { listsRouter } from "@/routes/lists.router";
import { usersRouter } from "@/routes/users.router";

const api = express.Router();

api.use("/items", itemsRouter);
api.use("/lists", listsRouter);
api.use("/users", usersRouter);
api.use("/bff", bffRouter);

export default api;
