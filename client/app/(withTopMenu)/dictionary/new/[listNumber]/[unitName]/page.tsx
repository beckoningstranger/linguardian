import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import { getAllLanguageFeatures, getList } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
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
    seperatedUserLanguagesWithFlags,
    listData,
    allLanguageFeatures,
  ] = await Promise.all([
    getAllUserLanguages(),
    getSeperatedUserLanguagesWithFlags(),
    getList(Number(listNumber)),
    getAllLanguageFeatures(),
  ]);

  if (!listData || !allUserLanguages || !allLanguageFeatures)
    throw new Error("Failed to get data");

  const listAndUnitData: ListAndUnitData = {
    languageWithFlag: { name: listData.language, flag: listData.flag },
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
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
      addToThisList={listAndUnitData}
    />
  );
}
