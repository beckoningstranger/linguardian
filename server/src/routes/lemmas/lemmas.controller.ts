import {
  getAllItemsForLemma,
  getAllLemmas,
} from "../../models/lemmas.model.js";
import { Request, Response } from "express";
import { SupportedLanguage } from "../../lib/types.js";

export async function httpGetAllItemsForLemma(req: Request, res: Response) {
  const lemma = req.params.lemma;
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getAllItemsForLemma(lemma, language));
}

export async function httpGetAllLemmasForLanguage(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;
  return res.status(200).json(await getAllLemmas(language));
}
