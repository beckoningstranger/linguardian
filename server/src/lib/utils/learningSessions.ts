import {
  ItemToLearn,
  ItemWithPopulatedTranslations,
  LearningMode,
  SRSettings,
  SupportedLanguage,
  User,
} from "@/lib/contracts";
import { allLanguageFeatures, defaultSRSettings } from "@/lib/siteSettings";
import { getUser } from "@/models/user.model";

/* -------------------------------------------------------
 * Shared helpers
 * -----------------------------------------------------*/

export function assertUser(
  userResp: Awaited<ReturnType<typeof getUser>>
): User {
  if (!userResp.success) throw new Error("Could not find user");
  return userResp.data;
}

export function getSrsSettings(
  user: User,
  langCode: SupportedLanguage
): SRSettings {
  return user.customSRSettings?.[langCode] || defaultSRSettings;
}

export function getLanguageFeatures(langCode: string) {
  const f = allLanguageFeatures.find((lf) => lf.langCode === langCode);
  if (!f) throw new Error(`Unknown language features for ${langCode}`);
  return f;
}

export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  return Array.from(new Map(items.map((i) => [i.id, i])).values());
}

export function collectItemsFromList(
  list: {
    units: Array<{ unitName: string; item: ItemWithPopulatedTranslations }>;
    unitOrder: string[];
  },
  unitNumber?: number
): ItemWithPopulatedTranslations[] {
  if (unitNumber) {
    // unitNumber is 1-based
    const targetIndex = unitNumber - 1;
    return list.units
      .filter((u) => list.unitOrder.indexOf(u.unitName) === targetIndex)
      .map((u) => u.item);
  }
  // full list
  return list.units.map((u) => u.item);
}

export function possibleAnswers(
  items: ItemWithPopulatedTranslations[]
): string[] {
  return items.map((i) => i.name);
}

export function learnedIdsFor(
  user: User,
  langCode: SupportedLanguage
): Set<string> {
  const ids = (user.learnedItems?.[langCode] ?? []).map((li) => li.id);
  return new Set(ids);
}

export function dueIdsFor(
  user: User,
  langCode: SupportedLanguage
): Set<string> {
  const due = (user.learnedItems?.[langCode] ?? []).filter(
    (li) => li.nextReview < Date.now()
  );
  return new Set(due.map((li) => li.id));
}

export function ignoredIdsFor(
  user: User,
  langCode: SupportedLanguage
): Set<string> {
  return new Set(user.ignoredItems[langCode] ?? []);
}

export function filterIgnored(
  items: ItemWithPopulatedTranslations[],
  ignored: Set<string>
) {
  return items.filter((i) => !ignored.has(i.id));
}

export function itemsToProcessPool(
  all: ItemWithPopulatedTranslations[],
  dueIds: Set<string>,
  overstudy: boolean
) {
  if (overstudy) return all;
  return all.filter((i) => dueIds.has(i.id));
}

export function buildBuckets(
  items: ItemWithPopulatedTranslations[],
  mode: LearningMode,
  user: User,
  ignored: Set<string>,
  learned: Set<string>,
  overstudy: boolean
) {
  const translation: ItemToLearn[] = [];
  const context: ItemToLearn[] = [];
  const dictionary: ItemToLearn[] = [];

  for (const item of items) {
    // all guards share these
    const notIgnored = !ignored.has(item.id);

    if (
      mode === "translation" &&
      notIgnored &&
      (item.translations[user.native.code] ?? []).length > 0
    ) {
      translation.push({
        ...item,
        increaseLevel: !overstudy,
        learningStep: 3,
      });
    }

    if (
      mode === "context" &&
      notIgnored &&
      learned.has(item.id) &&
      (item.context ?? []).length > 1
    ) {
      context.push({
        ...item,
        increaseLevel: !overstudy,
        learningStep: 3,
      });
    }

    if (
      mode === "dictionary" &&
      notIgnored &&
      learned.has(item.id) &&
      (item.definition ?? "").length > 1
    ) {
      dictionary.push({
        ...item,
        increaseLevel: !overstudy,
        learningStep: 3,
      });
    }
  }

  return { translation, context, dictionary };
}

export function pickSessionItems(
  mode: LearningMode,
  srs: SRSettings,
  overstudy: boolean,
  buckets: {
    translation: ItemToLearn[];
    context: ItemToLearn[];
    dictionary: ItemToLearn[];
  },
  learnable?: ItemToLearn[]
): ItemToLearn[] {
  if (mode === "learn") {
    return (learnable ?? []).slice(0, srs.itemsPerSession.learning);
  }

  const cap = srs.itemsPerSession.reviewing;
  if (mode === "translation")
    return overstudy ? buckets.translation : buckets.translation.slice(0, cap);
  if (mode === "dictionary")
    return overstudy ? buckets.dictionary : buckets.dictionary.slice(0, cap);
  if (mode === "context")
    return overstudy ? buckets.context : buckets.context.slice(0, cap);

  return []; // fallback
}

export function computeLearnable(
  all: ItemWithPopulatedTranslations[],
  user: User,
  ignored: Set<string>,
  learned: Set<string>,
  mode: LearningMode
): ItemToLearn[] {
  if (mode !== "learn") return [];
  return all
    .filter(
      (item) =>
        !ignored.has(item.id) &&
        !learned.has(item.id) &&
        (item.translations[user.native.code] ?? []).length > 0
    )
    .map((item) => ({ ...item, increaseLevel: true, learningStep: 0 }));
}
