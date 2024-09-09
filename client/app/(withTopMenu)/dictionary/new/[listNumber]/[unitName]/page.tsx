import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import { getLanguageFeaturesForLanguage, getList } from "@/lib/fetchData";
import {
  getAllUserLanguages,
  getSeperatedUserLanguagesWithFlags,
} from "@/lib/helperFunctions";
import { LanguageFeatures, ListAndUnitData } from "@/lib/types";

interface NewItemPageProps {
  params: { listNumber: string; unitName: string };
}

export default async function NewItemPage({
  params: { listNumber, unitName },
}: NewItemPageProps) {
  const decodedUnitName = decodeURIComponent(unitName);

  const [allUserLanguages, seperatedUserLanguagesWithFlags, listData] =
    await Promise.all([
      getAllUserLanguages(),
      getSeperatedUserLanguagesWithFlags(),
      getList(Number(listNumber)),
    ]);

  if (!listData || !allUserLanguages)
    throw new Error("Failed to get user or list data");

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

  const languageFeaturesForUserLanguagesPromises = allUserLanguages.map(
    (lang) => getLanguageFeaturesForLanguage(lang)
  );

  const languageFeaturesForUserLanguages = (
    await Promise.all(languageFeaturesForUserLanguagesPromises)
  ).filter((features): features is LanguageFeatures => features !== undefined);

  return (
    <EditOrCreateItem
      languageFeaturesForUserLanguages={languageFeaturesForUserLanguages}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
      addToThisList={listAndUnitData}
    />
  );
}
