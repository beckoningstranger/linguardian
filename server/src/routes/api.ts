import express from "express";
import { lemmasRouter } from "./lemmas/lemmas.router.js";
import { itemsRouter } from "./items/items.router.js";
import { listsRouter } from "./lists/lists.router.js";
import { settingsRouter } from "./settings/settings.router.js";
import { usersRouter } from "./users/users.router.js";
import { authRouter } from "./auth/auth.router.js";
import { Request, Response, NextFunction } from "express";

const api = express.Router();

export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) return res.status(401).json({ error: "You must log in!" });
  next();
}

api.use("/dictionary", lemmasRouter);
api.use("/items", itemsRouter);
api.use("/lists", listsRouter);
api.use("/settings", settingsRouter);
api.use("/users", usersRouter);
api.use("/auth", authRouter);

export default api;
