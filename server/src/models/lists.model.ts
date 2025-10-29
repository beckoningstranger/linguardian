import { DeleteResult, Types, UpdateResult } from "mongoose";
import { z } from "zod";

import {
  AddItemToUnitUpdate,
  addItemToUnitUpdateSchema,
  ApiResponse,
  FullyPopulatedList,
  fullyPopulatedListSchema,
  LearningMode,
  List,
  listSchema,
  ListUpdate,
  listUpdateSchema,
  PopulatedList,
  populatedListSchema,
  SupportedLanguage,
  UnitNameUpdate,
} from "@/lib/contracts";
import { CreateNewListData, objectIdSchema } from "@/lib/schemas";
import {
  allSupportedLanguages,
  supportedLanguageCodes,
} from "@/lib/siteSettings";
import { safeDbRead, safeDbWrite } from "@/lib/utils";
import Lists from "@/models/list.schema";

export async function getListByListNumber(
  listNumber: number
): Promise<ApiResponse<List>> {
  return await safeDbRead<List>({
    dbReadQuery: () => Lists.findOne({ listNumber }).lean(),
    schemaForValidation: listSchema,
  });
}

export async function getListAuthorsByListNumber(listNumber: number) {
  const listWithOnlyAuthorsSchema = listSchema.pick({ authors: true });
  type ListWithOnlyAuthors = z.infer<typeof listWithOnlyAuthorsSchema>;
  return await safeDbRead<ListWithOnlyAuthors>({
    dbReadQuery: () => Lists.findOne({ listNumber }).select("authors").lean(),
    schemaForValidation: listWithOnlyAuthorsSchema,
  });
}

export async function getPopulatedListByListNumber(
  listNumber: number
): Promise<ApiResponse<PopulatedList>> {
  return await safeDbRead<PopulatedList>({
    dbReadQuery: () =>
      Lists.findOne({ listNumber })
        .populate({
          path: "units.item",
        })
        .lean(),
    schemaForValidation: populatedListSchema,
  });
}

export async function getFullyPopulatedListByListNumber(
  listNumber: number
): Promise<ApiResponse<FullyPopulatedList>> {
  return await safeDbRead<FullyPopulatedList>({
    dbReadQuery: () =>
      Lists.findOne({ listNumber })
        .populate({
          path: "units.item",
          populate: supportedLanguageCodes.map((lang) => ({
            path: `translations.${lang}`,
          })),
        })
        .lean(),
    schemaForValidation: fullyPopulatedListSchema,
  });
}

export async function getAllListsForLanguage(
  language: SupportedLanguage
): Promise<ApiResponse<List[]>> {
  return await safeDbRead<List[]>({
    dbReadQuery: () => Lists.find({ "language.code": language }).lean(),
    schemaForValidation: z.array(listSchema),
  });
}

export async function getNextListNumber(): Promise<number> {
  const response = await safeDbRead<List>({
    dbReadQuery: () => Lists.findOne().sort("-listNumber").lean(),
    schemaForValidation: listSchema,
  });

  if (!response.success) {
    if (response.error === "No result found") return 1;

    throw new Error(`Database call failed: ${response.error}`);
  }

  const newestList = response.data;
  return newestList.listNumber + 1;
}

export async function createList(
  newListData: CreateNewListData
): Promise<ApiResponse<List>> {
  const newListId = new Types.ObjectId();
  const newListNumber = await getNextListNumber();
  const newList = {
    ...newListData,
    _id: newListId,
    id: newListId.toHexString(),
    listNumber: newListNumber,
    units: [],
    unitOrder: [],
    learners: [],
  };

  const listSchemaWith_id = listSchema.extend({ _id: objectIdSchema });

  return await safeDbWrite({
    input: newList,
    dbWriteQuery: (validatedList) => Lists.create(validatedList),
    schemaForValidation: listSchemaWith_id,
    errorMessage: "Failed to create list",
  });
}

export async function verifyUserIsAuthor(
  userId: string,
  listNumber: number
): Promise<boolean> {
  const response = await getListByListNumber(listNumber);
  if (!response.success) throw new Error("Could not get list");

  return response.data.authors.includes(userId);
}

export async function addUnitToList(listNumber: number, unitName: string) {
  const listResponse = await getListByListNumber(listNumber);
  if (!listResponse.success) {
    return { success: false, error: listResponse.error };
  }

  const list = listResponse.data;

  if (list.unitOrder.includes(unitName)) {
    return { success: false, error: "Unit already exists" };
  }

  const updatedList = {
    ...list,
    unitOrder: [...list.unitOrder, unitName],
  };

  return updateList(updatedList, listNumber);
}

export async function renameUnitName(
  listNumber: number,
  update: UnitNameUpdate
) {
  const listResponse = await getListByListNumber(listNumber);
  if (!listResponse.success) {
    return { success: false, error: listResponse.error };
  }

  const list = listResponse.data;

  if (!list.unitOrder.includes(update.oldName)) {
    return { success: false, error: "Cannot rename: Old unit name not found" };
  }

  const updatedUnitOrder = list.unitOrder.map((unitName) => {
    if (unitName === update.oldName) {
      return update.newName;
    } else {
      return unitName;
    }
  });

  const updatedUnits = list.units.map((unitItem) => {
    if (unitItem.unitName === update.oldName) {
      return { ...unitItem, unitName: update.newName };
    } else return unitItem;
  });

  const updatedList = {
    ...list,
    unitOrder: updatedUnitOrder,
    units: updatedUnits,
  };

  return updateList(updatedList, listNumber);
}

export async function deleteUnitFromList(listNumber: number, unitName: string) {
  const listResponse = await getListByListNumber(listNumber);
  if (!listResponse.success) {
    return { success: false, error: listResponse.error };
  }

  const list = listResponse.data;

  if (!list.unitOrder.includes(unitName)) {
    return { success: false, error: "No such unit name in list" };
  }

  const updatedUnitOrder = list.unitOrder.filter((unit) => unit !== unitName);

  const updatedList = {
    ...list,
    unitOrder: updatedUnitOrder,
  };

  return updateList(updatedList, listNumber);
}

export async function updateList(
  listUpdate: ListUpdate,
  listNumber: number
): Promise<ApiResponse<UpdateResult>> {
  return await safeDbWrite({
    input: listUpdate,
    schemaForValidation: listUpdateSchema,
    dbWriteQuery: () => Lists.updateOne({ listNumber }, listUpdate),
    errorMessage: `Error updating list number ${listNumber}`,
  });
}

export async function deleteList(
  listNumber: number
): Promise<ApiResponse<DeleteResult>> {
  return await safeDbWrite({
    input: undefined,
    schemaForValidation: z.void(),
    dbWriteQuery: async () => {
      const result = await Lists.deleteOne({ listNumber });
      if (result.deletedCount === 0) {
        throw new Error(`List ${listNumber} not found`);
      }
      return {
        acknowledged: result.acknowledged,
        deletedCount: result.deletedCount,
      };
    },
    errorMessage: `Failed to delete list ${listNumber}`,
  });
}

export async function addItemToUnit(
  listNumber: number,
  update: AddItemToUnitUpdate
): Promise<ApiResponse<{ message?: string }>> {
  return await safeDbWrite({
    input: update,
    schemaForValidation: addItemToUnitUpdateSchema,
    dbWriteQuery: async ({ unitName, itemId }) => {
      const response = await getListByListNumber(listNumber);
      if (!response.success)
        return {
          success: false,
          error: "Failed to get this list, try again later",
        };

      const list = response.data;

      const currentUnit = list.units.find((u) => u.item.toString() === itemId);

      // If the item is already in the desired unit → nothing to do
      if (currentUnit && currentUnit.unitName === unitName) {
        return { message: `Item is already in ${unitName}` };
      }

      // If the item exists in a different unit → move it
      if (currentUnit && currentUnit.unitName !== unitName) {
        await Lists.updateOne(
          { listNumber },
          {
            $pull: { units: { item: itemId } }, // remove from current unit
          }
        );

        await Lists.updateOne(
          { listNumber },
          {
            $addToSet: { units: { unitName, item: itemId } }, // add to new unit
          }
        );

        return {
          message: `Item was in ${currentUnit.unitName}, but we moved it to ${unitName}.`,
        };
      }

      // If not in any unit → just add it
      await Lists.updateOne(
        { listNumber },
        {
          $addToSet: { units: { unitName, item: itemId } },
        }
      );

      return { message: `Item added successfully to ${unitName}.` };
    },
    errorMessage: `Failed to add or move item ${update.itemId} in list ${listNumber}`,
  });
}

export async function removeItemFromList(
  listNumber: number,
  itemId: string
): Promise<ApiResponse<UpdateResult>> {
  return await safeDbWrite({
    input: undefined,
    schemaForValidation: z.void(),
    dbWriteQuery: () =>
      Lists.updateOne(
        { listNumber: listNumber },
        { $pull: { units: { item: itemId } } }
      ),
  });
}
