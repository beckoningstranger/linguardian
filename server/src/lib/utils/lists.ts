import {
  Item,
  ItemWithPopulatedTranslations,
  LearningStats,
  List,
  SupportedLanguage,
} from "@/lib/contracts";

export function generateLearningStats(
  items: Item[] | ItemWithPopulatedTranslations[],
  learnedItems: { id: string; level: number; nextReview: number }[],
  ignoredItemIds: string[],
  userNativeCode: SupportedLanguage
): LearningStats {
  const noTranslationsSet = new Set(
    items
      .filter((item) => {
        return (
          Object.keys(item.translations[userNativeCode] ?? {}).length === 0
        );
      })
      .map((item) => item.id)
  );

  const itemIdsSet = new Set(items.map((item) => item.id));
  const ignoredSet = new Set(ignoredItemIds);
  const learnedSet = new Set(learnedItems.map((i) => i.id));

  const unlearned = [...itemIdsSet].filter(
    (id) =>
      !ignoredSet.has(id) && !learnedSet.has(id) && !noTranslationsSet.has(id)
  ).length;

  const readyToReview = learnedItems.filter(
    (item) =>
      itemIdsSet.has(item.id) &&
      !ignoredSet.has(item.id) &&
      item.nextReview < Date.now()
  );

  const readySet = new Set(readyToReview.map((i) => i.id));

  const learned = learnedItems.filter(
    (item) =>
      itemIdsSet.has(item.id) &&
      !ignoredSet.has(item.id) &&
      !readySet.has(item.id) &&
      item.level >= 8
  );

  const learning = learnedItems.filter(
    (item) =>
      itemIdsSet.has(item.id) &&
      !ignoredSet.has(item.id) &&
      !readySet.has(item.id) &&
      item.level < 8
  );

  const ignoredItemsInListCount = ignoredItemIds.filter((id) =>
    itemIdsSet.has(id)
  ).length;

  return {
    unlearned,
    readyToReview: readyToReview.length,
    learned: learned.length,
    learning: learning.length,
    ignored: ignoredItemsInListCount,
  };
}

export function composeListUpdateMessage(updatePayload: Partial<List>): string {
  const keyToMessageMap: Record<string, string> = {
    name: "name",
    description: "description",
    image: "image",
    difficulty: "difficulty",
    authors: "authors",
    private: "visibility",
    unitOrder: "unit order",
  };

  const changedFields = Object.keys(updatePayload)
    .filter((key) => key in keyToMessageMap)
    .map((key) => keyToMessageMap[key]);

  if (changedFields.length === 1) {
    return `List ${changedFields[0]} updated 🎉`;
  }

  const last = changedFields.pop();
  return `List ${changedFields.join(", ")} and ${last} updated 🎉`;
}

export function getAllUnitInformation(
  units: { unitName: string; item: Item }[],
  learnedIds: string[] | undefined,
  unitOrder: string[]
): {
  unitName: string;
  noOfItems: number;
  fillWidth: string;
}[] {
  const unitMap = new Map<string, { count: number; learned: number }>();

  for (const { unitName, item } of units) {
    const isLearned = learnedIds?.includes(item.id) ?? false;

    if (!unitMap.has(unitName)) {
      unitMap.set(unitName, { count: 0, learned: 0 });
    }

    const data = unitMap.get(unitName)!;
    data.count += 1;
    if (isLearned) data.learned += 1;
  }

  const unitInfo = Array.from(unitMap.entries()).map(
    ([unitName, { count, learned }]) => {
      const percentage = count === 0 ? 0 : (100 * learned) / count;
      const fillWidth = `${Math.max(0, Math.min(100, percentage))}%`;

      return {
        unitName,
        noOfItems: count,
        fillWidth,
      };
    }
  );

  // So far, only units with items are included, now include empty units
  unitOrder.forEach((unitName) => {
    const exists = unitInfo.some((obj) => obj.unitName === unitName);
    if (!exists) unitInfo.push({ unitName, noOfItems: 0, fillWidth: "0%" });
  });

  return unitInfo.sort(
    (a, b) => unitOrder.indexOf(a.unitName) - unitOrder.indexOf(b.unitName)
  );
}

export function normalizeCreateListBody(
  rawBody: Record<string, any>,
  file: Express.Multer.File | undefined
) {
  return {
    ...rawBody,
    language: JSON.parse(rawBody.language),
    authors: JSON.parse(rawBody.authors),
    private: JSON.parse(rawBody.private),
    csvfile: file ?? null,
  };
}
