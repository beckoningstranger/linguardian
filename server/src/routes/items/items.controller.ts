import { Request, Response } from "express";
import {
  formatZodErrors,
  transformItemFromFEToBE,
} from "../../lib/helperFunctions.js";
import { siteSettings } from "../../lib/siteSettings.js";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "../../lib/types.js";
import { itemSchemaWithPopulatedTranslationsFE } from "../../lib/validations.js";
import {
  addTranslationBySlug,
  editOrCreateBySlug,
  findItemsByName,
  getAllSlugsForLanguage,
  getItemBySlug,
  getPopulatedItemBySlug,
  removeTranslationBySlug,
} from "../../models/items.model.js";

export async function httpGetItemBySlug(req: Request, res: Response) {
  const slug = req.params.slug;

  const response = await getItemBySlug(slug);
  if (response) return res.status(200).json(response);
  return res
    .status(404)
    .json({ message: `Error getting item with slug ${slug}: Item not found` });
}

export async function httpGetPopulatedItemBySlug(req: Request, res: Response) {
  const slug = req.params.slug;
  let userLanguages = req.params.userLanguages.split(
    ","
  ) as SupportedLanguage[];
  if (req.params.userLanguages === "undefined")
    userLanguages = [] as SupportedLanguage[];

  const response = await getPopulatedItemBySlug(slug, userLanguages);
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
  } = itemSchemaWithPopulatedTranslationsFE.safeParse(item);

  if (!success) {
    const formattedErrors = formatZodErrors(error.format());
    return res.status(400).json({ errors: formattedErrors });
  }

  const serverItem = transformItemFromFEToBE(validatedItem);

  const hasOtherAffectedItems = siteSettings.supportedLanguages.some(
    (lang) => (serverItem.translations[lang]?.length ?? 0) > 0
  );

  const updateResponses = hasOtherAffectedItems
    ? await updateRelatedItems(serverItem)
    : true;

  const response = await editOrCreateBySlug(serverItem, slug);
  if (updateResponses && response) return res.status(201).json(response);
  return res
    .status(500)
    .json({ error: "Internal server error, could not create/edit item" });
}

async function updateRelatedItems(item: ItemWithPopulatedTranslations) {
  const oldItem = await getPopulatedItemBySlug(
    item.slug,
    siteSettings.supportedLanguages
  );

  if (!oldItem) {
    console.warn("Could not find old item");
    return false;
  }

  const { added, removed, areEqual } = translationObjectsDiff(oldItem, item);
  const promises: Promise<any>[] = [];
  if (areEqual) return true;
  if (added)
    added.forEach((slug) =>
      promises.push(addTranslationBySlug(oldItem._id.toString(), slug))
    );
  if (removed)
    removed.forEach((slug) =>
      promises.push(removeTranslationBySlug(oldItem._id.toString(), slug))
    );

  await Promise.all(promises);
  return true;
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
