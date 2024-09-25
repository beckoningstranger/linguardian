import { Request, Response } from "express";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "../../lib/types.js";
import { itemSchemaWithPopulatedTranslations } from "../../lib/validations.js";
import {
  addTranslationBySlug,
  editOrCreateBySlug,
  findItemsByName,
  getAllSlugsForLanguage,
  getFullyPopulatedItemBySlug,
  getItemBySlug,
  removeTranslationBySlug,
} from "../../models/items.model.js";
import { getSupportedLanguages } from "../../models/settings.model.js";

export async function httpGetItemBySlug(req: Request, res: Response) {
  const slug = req.params.slug;

  const response = await getItemBySlug(slug);
  if (response) return res.status(200).json(response);
  return res
    .status(404)
    .json({ message: `Error getting item with slug ${slug}: Item not found` });
}

export async function httpGetFullyPopulatedItemBySlug(
  req: Request,
  res: Response
) {
  const slug = req.params.slug;
  let userLanguages = req.params.userLanguages.split(
    ","
  ) as SupportedLanguage[];
  if (req.params.userLanguages === "undefined")
    userLanguages = [] as SupportedLanguage[];

  const response = await getFullyPopulatedItemBySlug(slug, userLanguages);
  if (!response)
    return res
      .status(404)
      .json({ message: `Error getting item with id ${slug}: Item not found` });
  return res.status(200).json(response);
}

export async function httpGetAllSlugsForLanguage(req: Request, res: Response) {
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

export async function httpEditOrCreateItem(req: Request, res: Response) {
  const item = req.body as unknown;
  const slug = req.params.slug as string;
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

  const allSupportedLanguages = await getSupportedLanguages();
  const otherAffectedItems: any[] = [];
  allSupportedLanguages?.map((lang) =>
    validatedItem.translations[lang]?.forEach((item) =>
      otherAffectedItems.push(item)
    )
  );

  const updateReponses =
    otherAffectedItems.length > 0
      ? await updateRelatedItems(validatedItem)
      : true;

  const response = await editOrCreateBySlug(validatedItem, slug);
  if (updateReponses && response) return res.status(201).json(response);
  return res.status(500).json({ error: "Problem in database" });
}

async function updateRelatedItems(item: ItemWithPopulatedTranslations) {
  const allSupportedLanguages = await getSupportedLanguages();
  if (!allSupportedLanguages)
    throw new Error("Failed to get all supported languages");
  const oldItem = await getFullyPopulatedItemBySlug(
    item.slug,
    allSupportedLanguages
  );

  const { added, removed, areEqual } = translationObjectsDiff(oldItem, item);
  const promises: Promise<any>[] = [];
  if (areEqual) return true;
  if (added)
    added.forEach((slug) =>
      promises.push(addTranslationBySlug(oldItem._id, slug))
    );
  if (removed)
    removed.forEach((slug) =>
      promises.push(removeTranslationBySlug(oldItem._id, slug))
    );
  return await Promise.all(promises);
}

function translationObjectsDiff(
  oldItem: {
    translations: { [key: string]: { slug: string }[] };
  },
  newItem: {
    translations: { [key: string]: { slug: string }[] };
  }
): { added: string[]; removed: string[]; areEqual: boolean } {
  const allLanguages = new Set([
    ...Object.keys(oldItem.translations),
    ...Object.keys(newItem.translations),
  ]);
  const added: string[] = [];
  const removed: string[] = [];

  allLanguages.forEach((lang) => {
    const slugs1 = oldItem.translations[lang]?.map((item) => item.slug) || [];
    const slugs2 = newItem.translations[lang]?.map((item) => item.slug) || [];

    // Find added slugs
    const addedInLang = slugs2.filter((slug) => !slugs1.includes(slug));
    added.push(...addedInLang);

    // Find removed slugs
    const removedInLang = slugs1.filter((slug) => !slugs2.includes(slug));
    removed.push(...removedInLang);
  });

  // Determine if both objects are equal
  const areEqual = added.length === 0 && removed.length === 0;

  return { added, removed, areEqual };
}
