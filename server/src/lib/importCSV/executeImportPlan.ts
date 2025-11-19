import { UnitToAdd } from "@/lib/types";
import { ListModel } from "@/models";
import { getListByListNumber } from "@/models/list.model";
import { ParseResult } from "@/lib/contracts";

export async function executeImportPlan(
  existingUnitsToAdd: UnitToAdd[],
  newUnitsToAdd: UnitToAdd[],
  listNumber: number
): Promise<{ success: boolean; results: ParseResult[] }> {
  const results: ParseResult[] = [];

  // ---------------------------------------------------------
  // 1. Add existing items to list
  // ---------------------------------------------------------
  if (existingUnitsToAdd.length > 0) {
    const units = existingUnitsToAdd.map(({ unitName, itemId }) => ({
      unitName,
      item: itemId,
    }));

    const updateResult = await ListModel.updateOne(
      { listNumber },
      {
        $addToSet: {
          units: { $each: units },
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      for (const entry of existingUnitsToAdd) {
        results.push({
          row: entry.rowNumber,
          name: entry.name,
          status: "error",
          message: "List not found while adding existing item to list",
        });
      }
    } else {
      for (const entry of existingUnitsToAdd) {
        results.push({
          row: entry.rowNumber,
          name: entry.name,
          status: "addedExisting",
          message: "Existing item added to this list (or was already present)",
        });
      }
    }
  }

  // ---------------------------------------------------------
  // 2. Add newly created items to list
  // ---------------------------------------------------------
  if (newUnitsToAdd.length > 0) {
    const units = newUnitsToAdd.map(({ unitName, itemId }) => ({
      unitName,
      item: itemId,
    }));

    const updateResult = await ListModel.updateOne(
      { listNumber },
      {
        $addToSet: {
          units: { $each: units },
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      for (const entry of newUnitsToAdd) {
        results.push({
          row: entry.rowNumber,
          name: entry.name,
          status: "error",
          message: "List not found while adding new item to list",
        });
      }
    } else {
      for (const entry of newUnitsToAdd) {
        results.push({
          row: entry.rowNumber,
          name: entry.name,
          status: "success",
          message: "Item created and added to list successfully",
        });
      }
    }
  }

  // ---------------------------------------------------------
  // 3. Update unit order
  // ---------------------------------------------------------
  const unitOrderResult = await updateUnitOrderForList(listNumber);
  if (!unitOrderResult.success) {
    throw new Error(unitOrderResult.error);
  }

  return { success: true, results };
}

async function updateUnitOrderForList(listNumber: number): Promise<
  | {
      success: true;
      changed: boolean;
      unitOrder: string[];
    }
  | {
      success: false;
      error: string;
    }
> {
  const response = await getListByListNumber(listNumber);
  if (!response.success) {
    return {
      success: false,
      error: `Could not get list ${listNumber} to compute unit order`,
    };
  }

  const list = response.data;

  const unitOrder = Array.from(
    new Set(
      list.units
        .map((u) => u.unitName)
        .filter((name): name is string => Boolean(name && name.trim()))
    )
  );

  const updateResult = await ListModel.updateOne(
    { listNumber },
    { $set: { unitOrder } }
  );

  if (updateResult.matchedCount === 0) {
    return {
      success: false,
      error: `No list found with listNumber ${listNumber} when setting unitOrder`,
    };
  }

  return {
    success: true,
    changed: updateResult.modifiedCount > 0,
    unitOrder,
  };
}
