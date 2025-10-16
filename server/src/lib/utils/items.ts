import {
  ApiResponse,
  Item,
  itemSchemaWithTranslations,
  ItemWithPopulatedTranslations,
  NewItem,
  PartOfSpeech,
  PopulatedTranslations,
  SupportedLanguage,
  Tag,
} from "@/lib/contracts";
import {
  ItemToSubmit,
  ItemWithTranslationsAndLemmas,
  TranslationsAsObjectIds,
} from "@/lib/schemas";
import {
  allLanguageFeatures,
  supportedLanguageCodes,
} from "@/lib/siteSettings";
import { normalizeString, safeDbWrite, slugifyString } from "@/lib/utils";
import Items from "@/models/item.schema";
import { getPopulatedItemById } from "@/models/items.model";
import { ClientSession, startSession, Types } from "mongoose";
import { z } from "zod";

export function sanitizeItem(item: ItemWithTranslationsAndLemmas): Item {
  const { lemmas, ...rest } = item;

  const result = itemSchemaWithTranslations.safeParse(rest);
  if (!result.success) throw Error("Sanitizing item failed!");
  return result.data;
}

export function filterOutInvalidTags(
  partOfSpeech: PartOfSpeech,
  language: SupportedLanguage,
  tagArray?: string[]
): Tag[] {
  if (!tagArray) return [];
  const languageFeatures = allLanguageFeatures.find(
    (lang) => lang.langCode === language
  );
  if (!languageFeatures) return [];

  const validTags = languageFeatures?.tags.forAll
    .concat(languageFeatures.tags[partOfSpeech])
    .filter((item) => item !== undefined);

  if (validTags)
    return tagArray.filter((tag) => validTags.includes(tag as Tag)) as Tag[];
  return [];
}

export function deleteIf<T extends object>(
  obj: T,
  key: keyof T,
  condition: boolean
) {
  if (condition) {
    delete obj[key];
  }
}

export function generateIds(): { _id: Types.ObjectId; id: string } {
  const _id = new Types.ObjectId();
  const id = _id.toHexString();

  return { _id, id };
}

export async function prepareNewItemToSave(
  item: NewItem
): Promise<ItemToSubmit> {
  const itemToSubmit: ItemToSubmit = {
    ...item,
    ...generateIds(),
    lemmas: [],
    slug: await slugifyString(item.name, item.language, item.partOfSpeech),
    normalizedName: normalizeString(item.name),
    translations: item.translations
      ? convertTranslationsToIds(item.translations)
      : {},
  };

  if (item.tags)
    itemToSubmit.tags = filterOutInvalidTags(
      item.partOfSpeech,
      item.language,
      item.tags
    );

  deleteIf(itemToSubmit, "gender", item.partOfSpeech !== "noun");
  deleteIf(
    itemToSubmit,
    "grammaticalCase",
    item.partOfSpeech !== "preposition"
  );
  deleteIf(
    itemToSubmit,
    "pluralForm",
    item.partOfSpeech !== "noun" && item.partOfSpeech !== "adjective"
  );

  return itemToSubmit;
}

export async function prepareExistingItemToSave(
  item: ItemWithPopulatedTranslations
): Promise<ItemToSubmit> {
  const itemToSubmit: ItemToSubmit = {
    ...item,
    _id: new Types.ObjectId(item.id),
    lemmas: [],
    translations: convertTranslationsToIds(item.translations),
  };

  if (item.tags)
    itemToSubmit.tags = filterOutInvalidTags(
      item.partOfSpeech,
      item.language,
      item.tags
    );

  itemToSubmit.slug = await slugifyString(
    item.name,
    item.language,
    item.partOfSpeech
  );
  itemToSubmit.normalizedName = normalizeString(item.name);

  deleteIf(itemToSubmit, "gender", item.partOfSpeech !== "noun");
  deleteIf(
    itemToSubmit,
    "grammaticalCase",
    item.partOfSpeech !== "preposition"
  );
  deleteIf(
    itemToSubmit,
    "pluralForm",
    item.partOfSpeech !== "noun" && item.partOfSpeech !== "adjective"
  );

  return itemToSubmit;
}

export async function updateTranslations(id: string, diff: TranslationDiff) {
  const itemObjectId = new Types.ObjectId(id);

  const pullOps: Partial<
    Record<`translations.${SupportedLanguage}`, { $in: Types.ObjectId[] }>
  > = {};
  const addOps: Partial<
    Record<`translations.${SupportedLanguage}`, { $each: Types.ObjectId[] }>
  > = {};

  for (const lang of Object.keys(diff.removed) as SupportedLanguage[]) {
    const ids = diff.removed[lang]!;

    if (ids.length > 0) {
      const objectIds = ids.map((v) => new Types.ObjectId(v));
      pullOps[`translations.${lang}`] = { $in: objectIds };

      // 🔄 also remove this item from those translations
      await Items.updateMany(
        { _id: { $in: objectIds } },
        { $pull: { [`translations.${lang}`]: itemObjectId } }
      );
    }
  }

  for (const lang of Object.keys(diff.added) as SupportedLanguage[]) {
    const ids = diff.added[lang]!;
    if (ids.length > 0) {
      const objectIds = ids.map((v) => new Types.ObjectId(v));
      addOps[`translations.${lang}`] = {
        $each: objectIds,
      };

      // 🔄 also add this item to those translations
      await Items.updateMany(
        { _id: { $in: objectIds } },
        { $addToSet: { [`translations.${lang}`]: itemObjectId } }
      );
    }
  }

  const updateOps: Record<string, unknown> = {};
  if (Object.keys(pullOps).length > 0) updateOps.$pull = pullOps;
  if (Object.keys(addOps).length > 0) updateOps.$addToSet = addOps;

  if (Object.keys(updateOps).length === 0) {
    return { success: true, data: true }; // nothing to update
  }

  return await safeDbWrite({
    input: updateOps,
    schemaForValidation: z.any(),
    dbWriteQuery: (validatedOps) => Items.updateOne({ id }, validatedOps),
    errorMessage: `Failed to update translations for item with id ${id}`,
  });
}

export type TranslationDiff = {
  added: Partial<Record<SupportedLanguage, string[]>>; // languageCode -> item ids
  removed: Partial<Record<SupportedLanguage, string[]>>; // languageCode -> item ids
  areEqual: boolean;
};

export function translationObjectsDiff(
  oldItemTranslations: PopulatedTranslations,
  newItemTranslations: PopulatedTranslations
): TranslationDiff {
  const added: Partial<Record<SupportedLanguage, string[]>> = {};
  const removed: Partial<Record<SupportedLanguage, string[]>> = {};

  supportedLanguageCodes.forEach((languageCode) => {
    const oldIds =
      oldItemTranslations[languageCode]?.map((item) => item.id) || [];
    const newIds =
      newItemTranslations[languageCode]?.map((item) => item.id) || [];

    const addedInLang = newIds.filter((id) => !oldIds.includes(id));
    const removedInLang = oldIds.filter((id) => !newIds.includes(id));

    if (addedInLang.length > 0) added[languageCode] = addedInLang;
    if (removedInLang.length > 0) removed[languageCode] = removedInLang;
  });

  return {
    added,
    removed,
    areEqual:
      Object.keys(added).length === 0 && Object.keys(removed).length === 0,
  };
}

export async function updateRelatedItems(
  item: ItemWithPopulatedTranslations,
  isNewItem: boolean
) {
  let oldTranslations: PopulatedTranslations = {};

  if (!isNewItem) {
    const response = await getPopulatedItemById(item.id);
    if (!response.success) {
      console.warn("Could not find old item in updateRelatedItems");
      return false;
    }
    oldTranslations = response.data.translations;
  }

  const diff = translationObjectsDiff(oldTranslations, item.translations);
  const updateResponse = await updateTranslations(item.id, diff);
  return updateResponse.success;
}

export function convertTranslationsToIds(
  populatedTranslations: PopulatedTranslations
): TranslationsAsObjectIds {
  // Initialize empty object to hold results
  return supportedLanguageCodes.reduce<TranslationsAsObjectIds>(
    (translationsByLang, lang) => {
      // Get the translations for this language
      const translationsForLang = populatedTranslations[lang];

      // If there are any translations, convert their IDs to ObjectId
      if (translationsForLang && translationsForLang.length > 0) {
        translationsByLang[lang] = translationsForLang.map(
          (translation) => new Types.ObjectId(translation.id)
        );
      }

      // Return the accumulator for the next iteration
      return translationsByLang;
    },
    {}
  );
}

export function translationsAreEqual(
  a: PopulatedTranslations,
  b: PopulatedTranslations
): boolean {
  const langs = new Set([
    ...Object.keys(a || {}),
    ...Object.keys(b || {}),
  ]) as Set<SupportedLanguage>;

  for (const lang of langs) {
    const aIds = (a[lang]?.map((t) => t.id).sort() || []).join(",");
    const bIds = (b[lang]?.map((t) => t.id).sort() || []).join(",");
    if (aIds !== bIds) return false;
  }
  return true;
}

export async function updateAllAffectedItems(
  itemToSubmit: ItemToSubmit,
  oldTranslations: PopulatedTranslations,
  newTranslations: PopulatedTranslations,
  isNewItem: boolean
): Promise<ApiResponse<ItemWithTranslationsAndLemmas>> {
  const session = await startSession();
  session.startTransaction();

  try {
    let mainItem: ItemWithTranslationsAndLemmas | null = null;

    // 🧮 Compute translation diff
    const diff = translationObjectsDiff(oldTranslations, newTranslations);

    if (isNewItem) {
      // --- Step 1: Create the new item
      mainItem = await Items.create([itemToSubmit], { session }).then(
        (res) => res[0]
      );
      if (!mainItem?.id) throw new Error("Could not get new item id");

      // --- Step 2: Treat all translations as newly added
      const allAsNew = translationObjectsDiff({}, newTranslations);
      const relatedUpdate = await updateTranslationsWithSession(
        mainItem.id,
        allAsNew,
        session
      );
      if (!relatedUpdate.success)
        throw new Error("Failed to link translations for new item");
    } else {
      // --- Step 1: Update related translations bidirectionally
      const relatedUpdate = await updateTranslationsWithSession(
        itemToSubmit.id,
        diff,
        session
      );
      if (!relatedUpdate.success)
        throw new Error("Failed to update related translations");

      // --- Step 2: Update the main item
      mainItem = await Items.findOneAndUpdate(
        { _id: new Types.ObjectId(itemToSubmit.id) },
        { $set: itemToSubmit },
        { new: true, session }
      );

      if (!mainItem)
        throw new Error(`Item not found during update: ${itemToSubmit.id}`);
    }

    // ✅ Commit all DB changes atomically
    await session.commitTransaction();
    session.endSession();

    return { success: true, data: mainItem };
  } catch (err) {
    // ❌ Roll back everything if anything fails
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted:", err);
    return {
      success: false,
      error:
        (err as Error).message ||
        "Failed to update or create item and translations atomically",
    };
  }
}

async function updateTranslationsWithSession(
  id: string,
  diff: TranslationDiff,
  session: ClientSession
) {
  try {
    const itemObjectId = new Types.ObjectId(id);

    const pullOps: Partial<
      Record<`translations.${SupportedLanguage}`, { $in: Types.ObjectId[] }>
    > = {};
    const addOps: Partial<
      Record<`translations.${SupportedLanguage}`, { $each: Types.ObjectId[] }>
    > = {};

    // Remove this item from related items
    for (const lang of Object.keys(diff.removed) as SupportedLanguage[]) {
      const ids = diff.removed[lang]!.map((id) => new Types.ObjectId(id));
      if (ids.length > 0) {
        pullOps[`translations.${lang}`] = { $in: ids };
        await Items.updateMany(
          { _id: { $in: ids } },
          { $pull: { [`translations.${lang}`]: itemObjectId } },
          { session }
        );
      }
    }

    // Add this item to related items
    for (const lang of Object.keys(diff.added) as SupportedLanguage[]) {
      const ids = diff.added[lang]!.map((id) => new Types.ObjectId(id));
      if (ids.length > 0) {
        addOps[`translations.${lang}`] = { $each: ids };
        await Items.updateMany(
          { _id: { $in: ids } },
          { $addToSet: { [`translations.${lang}`]: itemObjectId } },
          { session }
        );
      }
    }

    const updateOps: Record<string, unknown> = {};
    if (Object.keys(pullOps).length > 0) updateOps.$pull = pullOps;
    if (Object.keys(addOps).length > 0) updateOps.$addToSet = addOps;

    if (Object.keys(updateOps).length > 0) {
      await Items.updateOne({ _id: itemObjectId }, updateOps, { session });
    }

    return { success: true, data: true };
  } catch (err) {
    console.error("Failed during translation update:", err);
    throw err;
  }
}
