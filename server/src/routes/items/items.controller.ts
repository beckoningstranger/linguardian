import {
  getAllSlugsForLanguage,
  getOneItemById,
  getOneItemBySlug,
} from "../../models/items.model.js";
import { Request, Response } from "express";
import { SupportedLanguage } from "../../types.js";

export async function httpGetOneItemById(req: Request, res: Response) {
  const id = req.params.id;

  const response = await getOneItemById(id);
  if (response) return res.status(200).json(response);
  return res
    .status(404)
    .json({ message: `Error getting item with id ${id}: Item not found` });
}

export async function httpGetOneItemBySlug(req: Request, res: Response) {
  const slug = req.params.slug;
  const language = req.params.language as SupportedLanguage;

  const response = await getOneItemBySlug(language, slug);
  if (!response)
    return res
      .status(404)
      .json({ message: `Error getting item with id ${slug}: Item not found` });
  return res.status(200).json(response);
}

export async function httpGetAllSlugForLanguage(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;

  const response = await getAllSlugsForLanguage(language);
  if (response)
    return res
      .status(200)
      .json(response as { slug: string; language: SupportedLanguage }[]);
  return res
    .status(404)
    .json({ message: `Error getting slugs for ${language}: None found` });
}
