import express from "express";
import {
  httpGetAllItemsForLemma,
  httpGetAllLemmasForLanguage,
} from "./lemmas.controller.js";

export const lemmasRouter = express.Router();

lemmasRouter.get("/:language/:lemma", httpGetAllItemsForLemma);

lemmasRouter.get("/:language", httpGetAllLemmasForLanguage);
