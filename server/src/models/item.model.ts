import { z } from "zod";

import {
  ApiResponse,
  coreItemSchema,
  ItemWithPopulatedTranslations,
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithTranslations,
  MessageWithItemInfoResponse,
  MessageWithSlugResponse,
  SupportedLanguage,
} from "@linguardian/shared/contracts";
import { dbItemSchema, NewItem } from "@/schemas";
import { allSupportedLanguages } from "@linguardian/shared/constants";
import {
  isNoResultError,
  normalizeString,
  prepareExistingItemToSave,
  prepareNewItemToSave,
  safeDbRead,
  safeDbWrite,
  translationsAreEqual,
  updateAllAffectedItems,
} from "@/utils";
import { ItemModel } from "@/models";

export async function getItemIdBySlug(slug: string) {
  return await safeDbRead({
    dbReadQuery: () => ItemModel.findOne({ slug }).select({ id: true }).lean(),
    schemaForValidation: coreItemSchema.pick({ id: true }),
  });
}

export async function getPopulatedItemById(id: string) {
  const paths = allSupportedLanguages.map((lang) => ({
    path: "translations." + lang,
  }));

  return await safeDbRead({
    dbReadQuery: () => ItemModel.findOne({ _id: id }).populate(paths).lean(),
    schemaForValidation: itemSchemaWithPopulatedTranslations,
  });
}

export async function searchDictionary(
  languages: SupportedLanguage[],
  query: string
) {
  const normalizedLowerCaseQuery = normalizeString(query);

  return await safeDbRead({
    dbReadQuery: () =>
      ItemModel.find({
        normalizedName: { $regex: normalizedLowerCaseQuery, $options: "i" },
        language: { $in: languages },
      }).lean(),
    schemaForValidation: z.array(itemSchemaWithTranslations),
  });
}

export async function createNewItem(
  item: NewItem,
  batchTag?: string
): Promise<ApiResponse<MessageWithItemInfoResponse | MessageWithSlugResponse>> {
  /* We call this function when users believe this is a new item (POST endpoint)
   and from parseCSV. We make sure we don't overwrite an existing item or create
   duplicates by looking existing items up first*/

  const dbItem = await prepareNewItemToSave(item, batchTag);

  const existingItemResponse = await safeDbRead({
    dbReadQuery: () =>
      ItemModel.findOne({
        name: item.name,
        language: item.language,
        partOfSpeech: item.partOfSpeech,
      }).lean(),
    schemaForValidation: itemSchemaWithTranslations,
  });

  if (!existingItemResponse.success && !isNoResultError(existingItemResponse)) {
    return {
      success: false,
      error: "Database error, please try again later",
    };
  }

  if (existingItemResponse.success) {
    return {
      success: true,
      data: {
        type: "duplicate",
        message:
          "An item with this name already exists. Please edit it instead.",
        redirectSlug: existingItemResponse.data.slug,
      },
    };
  }

  const created = await updateAllAffectedItems(
    dbItem,
    {},
    item.translations,
    true
  );

  if (!created.success) return { success: false, error: created.error };

  return {
    success: true,
    data: {
      type: "itemInfo",
      message: "Item successfully created! 🎉",
      itemInfo: {
        id: created.data.id,
        slug: created.data.slug,
        language: created.data.language,
      },
    },
  };
}

export async function updateExistingItem(
  item: ItemWithPopulatedTranslations
): Promise<ApiResponse<MessageWithItemInfoResponse>> {
  const dbItem = await prepareExistingItemToSave(item);

  const oldItemResponse = await getPopulatedItemById(item.id);
  if (!oldItemResponse.success) {
    return {
      success: false,
      error: "Could not find old item for update",
    };
  }

  const oldTranslations = oldItemResponse.data.translations;
  const newTranslations = item.translations;

  const changed = !translationsAreEqual(oldTranslations, newTranslations);

  if (!changed) {
    const updated = await safeDbWrite({
      input: dbItem,
      schemaForValidation: dbItemSchema,
      dbWriteQuery: () =>
        ItemModel.findOneAndUpdate(
          { id: dbItem.id },
          { $set: dbItem },
          { new: true }
        ),
      errorMessage: `Error updating item with slug: ${dbItem.slug}`,
    });

    if (!updated.success) return { success: false, error: updated.error };
    if (!updated.data)
      return { success: false, error: "No data returned when updating" };

    return {
      success: true,
      data: {
        type: "itemInfo",
        message: "Item successfully updated! 🎉",
        itemInfo: {
          id: updated.data.id,
          slug: updated.data.slug,
          language: updated.data.language,
        },
      },
    };
  }

  const updated = await updateAllAffectedItems(
    dbItem,
    oldTranslations,
    newTranslations,
    false
  );

  if (!updated.success) {
    return {
      success: false,
      error: updated.error || "Failed to update item with translations",
    };
  }
  return {
    success: true,
    data: {
      type: "itemInfo",
      message: "Item and its translations updated successfully! 🎉",
      itemInfo: {
        id: updated.data.id,
        slug: updated.data.slug,
        language: updated.data.language,
      },
    },
  };
}
