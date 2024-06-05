import {
  findItemsByName,
  getAllSlugsForLanguage,
  getOneItemById,
  getFullyPopulatedItemBySlug,
} from "../../models/items.model.js";
import { Request, Response } from "express";
import { DictionarySearchResult, SupportedLanguage } from "../../types.js";

export async function httpGetOneItemById(req: Request, res: Response) {
  const id = req.params.id;

  const response = await getOneItemById(id);
  if (response) return res.status(200).json(response);
  return res
    .status(404)
    .json({ message: `Error getting item with id ${id}: Item not found` });
}

export async function httpGetFullyPopulatedItemBySlug(
  req: Request,
  res: Response
) {
  const slug = req.params.slug;
  const language = req.params.language as SupportedLanguage;
  const userNative = req.params.userNative as SupportedLanguage;

  const response = await getFullyPopulatedItemBySlug(
    language,
    slug,
    userNative
  );
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

export async function httpFindItemsByName(req: Request, res: Response) {
  const language = req.params.language as SupportedLanguage;
  const query = req.params.query as string;

  const response = await findItemsByName(language, query);
  if (response) return res.status(200).json(response);
  return res.status(404).json({
    message: `Error finding items for ${language} and query ${query}: None found`,
  });
}
