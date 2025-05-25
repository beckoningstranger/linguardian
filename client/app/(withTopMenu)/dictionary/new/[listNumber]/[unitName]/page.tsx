import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getList } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguages,
} from "@/lib/helperFunctionsServer";
import { siteSettings } from "@/lib/siteSettings";
import { ListAndUnitData } from "@/lib/types";

interface NewItemPageProps {
  params: { listNumber: string; unitName: string };
}

export default async function NewItemPage({
  params: { listNumber, unitName },
}: NewItemPageProps) {
  const decodedUnitName = decodeURIComponent(unitName);

  const [allUserLanguages, seperatedUserLanguages, listData] =
    await Promise.all([
      getAllUserLanguages(),
      getSeperatedUserLanguages(),
      getList(Number(listNumber)),
    ]);

  if (!listData || !allUserLanguages) throw new Error("Failed to get data");

  const listAndUnitData: ListAndUnitData = {
    languageWithFlagAndName: {
      code: listData.language.code,
      flag: listData.language.flag,
      name: siteSettings.languageFeatures.find(
        (lang) => lang.flagCode === listData.language.flag
      )?.langName!,
    },
    listNumber: Number(listNumber),
    listName: listData.name,
    unitName: decodedUnitName,
    unitNumber: listData.unitOrder.reduce((a, curr, index) => {
      if (curr === decodedUnitName) {
        return index + 1;
      } else {
        return a;
      }
    }, 0),
  };

  return (
    <EditOrCreateItem
      seperatedUserLanguages={seperatedUserLanguages}
      addToThisList={listAndUnitData}
    />
  );
}
