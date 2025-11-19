import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "@/lib/contracts";

// Used on the item pages
export function filterItemDataForUserLanguages(
  item: ItemWithPopulatedTranslations,
  allUserLanguageCodes: SupportedLanguage[]
): ItemWithPopulatedTranslations {
  allUserLanguageCodes.forEach((code: SupportedLanguage) => {
    if (
      item.translations &&
      item.translations[code] &&
      !Object.keys(item.translations ?? {}).includes(code)
    ) {
      delete item.translations[code];
    }
  });

  item.translations = Object.fromEntries(
    Object.entries(item.translations ?? {}).filter(([lang]) =>
      allUserLanguageCodes.includes(lang as SupportedLanguage)
    )
  );

  return item;
}

export function bgColor(nextReview?: number, itemLevel?: number) {
  if (!nextReview || !itemLevel) return "bg-white/90 hover:bg-white"; // not learned yet

  const itemIsDue = nextReview < Date.now();
  const itemIsMature = itemLevel >= 8;

  if (itemIsDue) return "bg-blue-400 hover:bg-blue-500"; // due for review
  if (itemIsMature) return "bg-green-400 hover:bg-green-500"; // mature
  if (!itemIsMature) return "bg-orange-300 hover:bg-orange-400"; // growing
}

export function currentItemStatus(nextReviewTime: number, itemLevel: number) {
  const now = Date.now();
  return nextReviewTime > now
    ? itemLevel < 8
      ? "Growing"
      : "Mature"
    : "Ready to water";
}

export function nextReviewMessage(
  nextReview: number,
  itemLevel: number
): string {
  if (!nextReview || !itemLevel) return "";

  if (currentItemStatus(nextReview, itemLevel) === "Ready to water") {
    return "Water now!";
  }

  const now = Date.now();
  const diff = nextReview - now;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 100) {
    return `Due in ${minutes} minute${minutes !== 1 && "s"}`;
  }

  if (diff < 86400000) {
    // 86400000 = 24 hours
    return `Due in ${hours} hour${hours !== 1 ? "s" : ""}`;
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

  return `Due on ${formattedDate}`;
}
