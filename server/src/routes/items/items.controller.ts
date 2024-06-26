import { Request, Response } from "express";
import { SupportedLanguage } from "../../lib/types.js";
import { itemSchemaWithPopulatedTranslations } from "../../lib/validations.js";
import {
  editBySlug,
  findItemsByName,
  getAllSlugsForLanguage,
  getFullyPopulatedItemBySlug,
  getOneItemById,
} from "../../models/items.model.js";

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
  const queryItemLanguage = req.params.queryItemLanguage as SupportedLanguage;
  let userLanguages = req.params.userLanguages.split(
    ","
  ) as SupportedLanguage[];
  if (req.params.userLanguages === "undefined")
    userLanguages = [] as SupportedLanguage[];

  const response = await getFullyPopulatedItemBySlug(
    queryItemLanguage,
    slug,
    userLanguages
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
  const languagesString = req.params.languages as string;
  const query = req.params.query as string;

  const languages = languagesString.split(",");

  const response = await findItemsByName(
    languages as SupportedLanguage[],
    query
  );
  if (response) return res.status(200).json(response);
  return res.status(404).json({
    message: `Error finding items for ${languages} and query ${query}: None found`,
  });
}

export async function httpEditItem(req: Request, res: Response) {
  const item = req.body as unknown;
  const passedSlug = req.params.slug as string;

  const {
    data: validatedItem,
    success,
    error,
  } = itemSchemaWithPopulatedTranslations.safeParse(item);
  if (!success) {
    let errorMessage = "";
    error.issues.forEach(
      (issue) => (errorMessage += `${issue.path[0]}: ${issue.message}. `)
    );
    return res.status(400).json({ error: errorMessage });
  }
  const response = await editBySlug(passedSlug, validatedItem);
  if (response) return res.status(201).json(response);
  return res.status(500).json({ error: "Problem in database" });
}
