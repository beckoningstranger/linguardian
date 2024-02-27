import express from "express";
import {
  httpGetAllItemsForLemma,
  httpGetAllLemmas,
} from "./lemmas.controller.js";

export const lemmasRouter = express.Router();

lemmasRouter.get("/:language/:lemma", httpGetAllItemsForLemma);

lemmasRouter.get("/:language", httpGetAllLemmas);
