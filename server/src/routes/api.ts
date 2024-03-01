import express from "express";
import { lemmasRouter } from "./lemmas/lemmas.router.js";
import { itemsRouter } from "./items/items.router.js";
import { coursesRouter } from "./courses/courses.router.js";

const api = express.Router();

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);
api.use("/courses", coursesRouter);

export default api;
