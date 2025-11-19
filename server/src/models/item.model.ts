import { z } from "zod";

import {
  ApiResponse,
  coreItemSchema,
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithTranslations,
  ItemWithPopulatedTranslations,
  MessageWithItemInfoResponse,
  MessageWithSlugResponse,
  NewItem,
  SupportedLanguage,
} from "@/lib/contracts";
import { itemToSubmitSchema } from "@/lib/schemas";
import { allSupportedLanguages } from "@/lib/siteSettings";
import {
  isNoResultError,
  normalizeString,
  prepareExistingItemToSave,
  prepareNewItemToSave,
  safeDbRead,
  safeDbWrite,
  translationsAreEqual,
  updateAllAffectedItems,
} from "@/lib/utils";
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
  item: NewItem
): Promise<ApiResponse<MessageWithItemInfoResponse | MessageWithSlugResponse>> {
  /* We call this function when users believe this is a new item (POST endpoint)
   and from parseCSV. We make sure we don't overwrite an existing item or create
   duplicates by looking existing items up first*/

  const itemToSubmit = await prepareNewItemToSave(item);

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
    itemToSubmit,
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
  const itemToSubmit = await prepareExistingItemToSave(item);

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
      input: itemToSubmit,
      schemaForValidation: itemToSubmitSchema,
      dbWriteQuery: () =>
        ItemModel.findOneAndUpdate(
          { id: itemToSubmit.id },
          { $set: itemToSubmit },
          { new: true }
        ),
      errorMessage: `Error updating item with slug: ${itemToSubmit.slug}`,
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
    itemToSubmit,
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
