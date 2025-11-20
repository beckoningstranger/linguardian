import {
  Item,
  ItemWithPopulatedTranslations,
  LearningMode,
  LearningModeWithInfo,
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
  // ---------- tiny helpers ----------
  const now = () => Date.now();

  const firstDue = (arr: { nextReview: number }[]) => {
    let min: number | undefined;
    for (const it of arr)
      if (min === undefined || it.nextReview < min) min = it.nextReview;
    return min;
  };

  const toSet = <T>(xs: T[]) => new Set(xs);
  const countIf = <T>(xs: T[], pred: (x: T) => boolean) => {
    let c = 0;
    for (const x of xs) if (pred(x)) c++;
    return c;
  };

  // ---------- precomputed sets ----------
  const itemIdsSet = toSet(items.map((i) => i.id));
  const ignoredSet = toSet(ignoredItemIds);
  const learnedSet = toSet(learnedItems.map((i) => i.id));

  // ready for review (learned + due now + in this items scope + not ignored)
  const readyForReviewItems = learnedItems.filter(
    (li) =>
      itemIdsSet.has(li.id) && !ignoredSet.has(li.id) && li.nextReview < now()
  );
  const readySet = toSet(readyForReviewItems.map((i) => i.id));

  // learned/learning tallies (learned in scope, not ignored, not currently due)
  const learned = countIf(
    learnedItems,
    (li) =>
      itemIdsSet.has(li.id) &&
      !ignoredSet.has(li.id) &&
      !readySet.has(li.id) &&
      li.level >= 8
  );
  const learning = countIf(
    learnedItems,
    (li) =>
      itemIdsSet.has(li.id) &&
      !ignoredSet.has(li.id) &&
      !readySet.has(li.id) &&
      li.level < 8
  );

  const ignoredItemsInList = countIf(ignoredItemIds, (id) =>
    itemIdsSet.has(id)
  );

  // items with NO translation to user's native
  const noTranslationsSet = toSet(
    items
      .filter((it) => (it.translations?.[userNativeCode] ?? []).length === 0)
      .map((it) => it.id)
  );

  // unlearned candidates
  const unlearned = [...itemIdsSet].filter(
    (id) =>
      !ignoredSet.has(id) && !learnedSet.has(id) && !noTranslationsSet.has(id)
  ).length;

  // ---------- next review message ----------
  const nextDue = firstDue(learnedItems);
  const nextReviewDueMessage =
    nextDue !== undefined ? nextReviewMessage(nextDue) : "";

  // ---------- capability feature sets ----------
  const hasTranslationsSet = toSet(
    items
      .filter((it) => (it.translations?.[userNativeCode] ?? []).length > 0)
      .map((it) => it.id)
  );
  const hasDefinitionSet = toSet(
    items.filter((it) => (it.definition ?? "").length > 1).map((it) => it.id)
  );
  const hasPicsOrVidsSet = toSet(
    items
      .filter((it) => (it.pics ?? []).length > 1 || (it.vids ?? []).length > 1)
      .map((it) => it.id)
  );
  const hasIpaOrAudioSet = toSet(
    items
      .filter((it) => (it.IPA ?? []).length > 1 || (it.audio ?? []).length > 1)
      .map((it) => it.id)
  );
  const hasContextSet = toSet(
    items.filter((it) => (it.context ?? []).length > 1).map((it) => it.id)
  );

  // helpers to count “ready for <mode>” among DUE learned items
  const readyFor = {
    translation: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        readySet.has(li.id) &&
        hasTranslationsSet.has(li.id)
    ),
    dictionary: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        readySet.has(li.id) &&
        hasDefinitionSet.has(li.id)
    ),
    spelling: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        readySet.has(li.id) &&
        hasIpaOrAudioSet.has(li.id)
    ),
    visual: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        readySet.has(li.id) &&
        hasPicsOrVidsSet.has(li.id)
    ),
    context: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        readySet.has(li.id) &&
        hasContextSet.has(li.id)
    ),
  };

  // helpers to count “available for <mode>” regardless of due state (for overstudy)
  const availableFor = {
    translation: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        hasTranslationsSet.has(li.id)
    ),
    dictionary: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        hasDefinitionSet.has(li.id)
    ),
    spelling: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        hasIpaOrAudioSet.has(li.id)
    ),
    visual: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        hasPicsOrVidsSet.has(li.id)
    ),
    context: countIf(
      learnedItems,
      (li) =>
        itemIdsSet.has(li.id) &&
        !ignoredSet.has(li.id) &&
        hasContextSet.has(li.id)
    ),
  };

  // ---------- recommended + available ----------
  const mk = (
    mode: LearningMode,
    number: number,
    overstudy: boolean,
    info?: string
  ): LearningModeWithInfo => ({
    mode,
    number,
    overstudy,
    info: info ?? String(number),
  });

  const availableModesWithInfo: LearningModeWithInfo[] = [];
  let recommended: LearningModeWithInfo;

  // default: learn
  recommended = mk("learn", unlearned, false);

  // if nothing to learn or review: overstudy
  if (unlearned === 0 && readyForReviewItems.length === 0) {
    // include overstudy placeholder
    availableModesWithInfo.push(mk("overstudy", 0, true, ""));
    if (availableFor.translation > 0)
      availableModesWithInfo.push(
        mk("translation", availableFor.translation, true)
      );
    if (availableFor.dictionary > 0)
      availableModesWithInfo.push(
        mk("dictionary", availableFor.dictionary, true)
      );
    if (availableFor.visual > 0)
      availableModesWithInfo.push(mk("visual", availableFor.visual, true));
    if (availableFor.spelling > 0)
      availableModesWithInfo.push(mk("spelling", availableFor.spelling, true));
    if (availableFor.context > 0)
      availableModesWithInfo.push(mk("context", availableFor.context, true));

    recommended = {
      mode: "overstudy",
      info: nextReviewDueMessage,
      number: 0,
      overstudy: true,
    };
  } else {
    // normal case: learning + ready buckets
    if (unlearned > 0)
      availableModesWithInfo.push(mk("learn", unlearned, false));
    if (readyFor.translation > 0)
      availableModesWithInfo.push(
        mk("translation", readyFor.translation, false)
      );
    if (readyFor.dictionary > 0)
      availableModesWithInfo.push(mk("dictionary", readyFor.dictionary, false));
    if (readyFor.visual > 0)
      availableModesWithInfo.push(mk("visual", readyFor.visual, false));
    if (readyFor.spelling > 0)
      availableModesWithInfo.push(mk("spelling", readyFor.spelling, false));
    if (readyFor.context > 0)
      availableModesWithInfo.push(mk("context", readyFor.context, false));

    // pick the largest bucket as recommendation
    let best: LearningModeWithInfo | undefined;
    for (const m of availableModesWithInfo) {
      if (!best || m.number > best.number) best = m;
    }
    if (best) recommended = { ...best, overstudy: false };

    // final rule: if there is any due review at all, prefer translation recommendation
    if (readyForReviewItems.length > 0) {
      recommended = mk("translation", readyFor.translation, false);
    }
  }

  return {
    readyToLearn: unlearned,
    readyForReview: readyForReviewItems.length,
    availableModesWithInfo,
    learned,
    learning,
    ignored: ignoredItemsInList,
    recommendedModeWithInfo: recommended,
    nextReviewDueMessage,
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

export function nextReviewMessage(nextReview: number): string {
  const now = Date.now();
  const diff = nextReview - now;
  if (diff < 0) return "";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (hours === 0 && minutes < 1) return "due in less than a minute";

  if (hours < 2 && minutes < 100) {
    return `due in ${minutes} minute${minutes !== 1 && "s"}`;
  }

  if (diff < 86400000) {
    const msIntoHour = diff % 3600000;
    const msToNextHour = 3600000 - msIntoHour;
    // If we're within the last 30 minutes of the hour, round the message up.
    if (msToNextHour <= 30 * 60000) {
      return `due in less than ${hours + 1} hours`;
    }
    // 86400000 = 24 hours
    return `due in more than ${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  const date = new Date(nextReview);
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const day = date.getDate();
  function getOrdinal(n: number): string {
    const suffix =
      n % 100 >= 11 && n % 100 <= 13
        ? "th"
        : ["st", "nd", "rd"][(n % 10) - 1] ?? "th";
    return n + suffix;
  }

  const formattedDate = formatter.format(date).replace(/\d+/, getOrdinal(day));

  return `due on ${formattedDate}`;
}
