import { getOneItem } from "../../models/items.model.js";
import { Request, Response } from "express";
import { SupportedLanguage } from "../../types.js";

export async function httpGetOneItem(req: Request, res: Response) {
  const item = req.params.item;
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getOneItem(item, language));
}
