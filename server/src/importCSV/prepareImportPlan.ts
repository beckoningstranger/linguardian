import { SupportedLanguage } from "@linguardian/shared/contracts";
import { getPopulatedListByListNumber } from "@/models/list.model";
import { ItemModel } from "@/models";
import { ImportPlan, ParsedCSVRow } from "@/types/types";

export async function prepareImportPlan(
  parsedRows: ParsedCSVRow[],
  listNumber: number
): Promise<ImportPlan> {
  const plan: ImportPlan = {
    existingUnitsToAdd: [],
    newItems: [],
    results: [],
  };

  // -----------------------
  // 1. Check what items already exist on the list
  // -----------------------
  const listResponse = await getPopulatedListByListNumber(listNumber);
  if (!listResponse.success) throw new Error("Could not get list");
  const list = listResponse.data;

  const itemsAlreadyOnList = new Set<string>();
  if (list) {
    for (const unit of list.units) {
      const item = unit.item;
      if (!item) continue;
      const key = keyOf(item.name, item.language, item.partOfSpeech);
      itemsAlreadyOnList.add(key);
    }
  }

  // -----------------------
  // 2. Find which parsed items already exist in DB
  // -----------------------
  const uniqueKeys: Set<string> = new Set();
  const keyQueries: {
    name: string;
    language: SupportedLanguage;
    partOfSpeech: string;
  }[] = [];

  for (const row of parsedRows) {
    const i = row.item;
    const key = keyOf(i.name, i.language, i.partOfSpeech);
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      keyQueries.push({
        name: i.name,
        language: i.language,
        partOfSpeech: i.partOfSpeech,
      });
    }
  }

  const existingItems = keyQueries.length
    ? await ItemModel.find(
        { $or: keyQueries },
        { _id: 1, name: 1, language: 1, partOfSpeech: 1 }
      ).lean()
    : [];

  const existingIdByKey = new Map<string, any>();
  for (const i of existingItems) {
    existingIdByKey.set(keyOf(i.name, i.language, i.partOfSpeech), i._id);
  }

  // -----------------------
  // 3. Classify parsed rows
  // -----------------------
  for (const row of parsedRows) {
    const i = row.item;
    const key = keyOf(i.name, i.language, i.partOfSpeech);

    // Already on list -> skip and warn
    if (itemsAlreadyOnList.has(key)) {
      plan.results.push({
        row: row.rowNumber,
        name: i.name,
        status: "duplicate",
        message: `Already on this list`,
      });
      continue;
    }

    // Exists in DB -> schedule it to be added to list
    const existingId = existingIdByKey.get(key);
    if (existingId) {
      plan.existingUnitsToAdd.push({
        unitName: i.unit,
        itemId: existingId,
        rowNumber: row.rowNumber,
        name: i.name,
      });
      continue;
    }

    // Truly new item -> create it
    plan.newItems.push(row);
  }

  return plan;
}

function keyOf(name: string, lang: SupportedLanguage, pos: string): string {
  return `${name.toLowerCase()}||${lang}||${pos.toLowerCase()}`;
}
