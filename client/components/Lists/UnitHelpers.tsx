import { getLearnedLanguageData, getPopulatedList } from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";
import { generateStats } from "./ListHelpers";

export async function calculateUnitStats(listNumber: number, unitName: string) {
  const listData = await getPopulatedList(listNumber);
  if (!listData) throw new Error("Error getting list data");
  const listLanguage = listData?.language;

  const sessionUser = await getUserOnServer();
  const userId = sessionUser.id;

  const learnedLanguageData = await getLearnedLanguageData(
    userId,
    listLanguage
  );

  if (!learnedLanguageData)
    throw new Error("Error getting learned language data");

  const learnedItems = learnedLanguageData.learnedItems;
  const ignoredItems = learnedLanguageData.ignoredItems;

  const selectedUnitData = listData.units.filter(
    (unit) => unit.unitName === unitName
  );
  if (!selectedUnitData)
    throw new Error("Unit not found, unable to calculate stats");

  const itemIDsInUnit = selectedUnitData.map((unitItem) => unitItem.item._id);
  const userlearnedItemIDs = learnedItems.map((item) => item.id);
  const learnedItemsInList = userlearnedItemIDs.filter((id) =>
    itemIDsInUnit.includes(id)
  );

  return generateStats(
    ignoredItems,
    learnedItems,
    itemIDsInUnit,
    learnedItemsInList
  );
}
