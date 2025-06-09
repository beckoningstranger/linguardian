import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Item } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setErrorsFromBackend<T>(
  errors: Record<keyof T, string[]>,
  setError: (field: keyof T, error: { type: string; message: string }) => void
) {
  Object.entries(errors).forEach(([field, messages]) => {
    (messages as string[]).forEach((message) => {
      setError(field as keyof T, {
        type: "manual",
        message,
      });
    });
  });
}

export function shuffleArray<T>(array: T[]) {
  // Durstenfeld Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getUnitInformation(
  units: { unitName: string; item: Item }[],
  unitName: string,
  learnedIds: string[] | undefined
) {
  const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
    if (itemInUnit.unitName === unitName) a += 1;
    return a;
  }, 0);

  const itemsInUnit = units.filter((item) => item.unitName === unitName);

  const noOfLearnedItemsInUnit = itemsInUnit.filter((item) =>
    learnedIds?.includes(item.item._id.toString())
  ).length;

  const learnedItemsPercentage =
    noOfItemsInUnit === 0
      ? 0
      : (100 / noOfItemsInUnit) * noOfLearnedItemsInUnit;

  const clampedLearnedItemsPercentage = Math.max(
    0,
    Math.min(100, learnedItemsPercentage)
  );
  const fillWidth = `${clampedLearnedItemsPercentage}%`;

  return {
    noOfItemsInUnit,
    fillWidth,
  };
}
