import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getAllLanguageFeatures, getList } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguages,
} from "@/lib/helperFunctionsServer";
import { ListAndUnitData } from "@/lib/types";

interface NewItemPageProps {
  params: { listNumber: string; unitName: string };
}

export default async function NewItemPage({
  params: { listNumber, unitName },
}: NewItemPageProps) {
  const decodedUnitName = decodeURIComponent(unitName);

  const [
    allUserLanguages,
    seperatedUserLanguages,
    listData,
    allLanguageFeatures,
  ] = await Promise.all([
    getAllUserLanguages(),
    getSeperatedUserLanguages(),
    getList(Number(listNumber)),
    getAllLanguageFeatures(),
  ]);

  if (!listData || !allUserLanguages || !allLanguageFeatures)
    throw new Error("Failed to get data");

  const listAndUnitData: ListAndUnitData = {
    languageWithFlagAndName: {
      code: listData.language.code,
      flag: listData.language.flag,
      name: allLanguageFeatures.find(
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
      allLanguageFeatures={allLanguageFeatures}
      seperatedUserLanguages={seperatedUserLanguages}
      addToThisList={listAndUnitData}
    />
  );
}
