import { getOneItemById, getOneItemByName } from "../../models/items.model.js";
import { Request, Response } from "express";
import { SupportedLanguage } from "../../types.js";

export async function httpGetOneItemByName(req: Request, res: Response) {
  const name = req.params.name;
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getOneItemByName(name, language));
}

export async function httpGetOneItemById(req: Request, res: Response) {
  const id = req.params.id;
  const language = req.params.language as SupportedLanguage;

  return res.status(200).json(await getOneItemById(id));
}
