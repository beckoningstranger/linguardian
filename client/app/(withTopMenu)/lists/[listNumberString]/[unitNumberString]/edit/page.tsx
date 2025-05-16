import EditUnitHeader from "@/components/Lists/EditUnit/EditUnitHeader";
import UnitDetailsLeftButtons from "@/components/Lists/UnitOverview/UnitDetailsLeftButtons";
import UnitHeader from "@/components/Lists/UnitOverview/UnitHeader";
import UnitItems from "@/components/Lists/UnitOverview/UnitItems";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { UnitContextProvider } from "@/context/UnitContext";
import {
  getFullyPopulatedListByListNumber,
  getLearningDataForLanguage,
  getList,
} from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { ListAndUnitData } from "@/lib/types";
import { redirect } from "next/navigation";

interface UnitEditPageProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitEditPage({
  params: { listNumberString, unitNumberString },
}: UnitEditPageProps) {
  const listNumber = Number(listNumberString);
  const unitNumber = Number(unitNumberString);
  const [user, list] = await Promise.all([
    getUserOnServer(),
    getList(listNumber),
  ]);

  if (!list?.authors.includes(user.id))
    redirect(paths.unitDetailsPath(listNumber, unitNumber));

  const {
    id: userId,
    native: { code: userNative },
    learnedLists,
  } = await getUserOnServer();

  const listData = await getFullyPopulatedListByListNumber(
    userNative,
    listNumber
  );
  if (!listData) throw new Error("List not found");

  const learningDataForLanguage = await getLearningDataForLanguage(
    userId,
    listData.language.code
  );
  if (!learningDataForLanguage) throw new Error("Could not get learning data");

  const unitName = listData.unitOrder[unitNumber - 1];
  const unitItems = listData?.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);
  const userIsAuthor = listData.authors.includes(userId);
  const userIsLearningThisList = Object.values(learnedLists)
    .flat()
    ?.includes(listNumber);

  const listAndUnitData: ListAndUnitData = {
    languageWithFlagAndName: listData.language,
    listNumber: listNumber,
    listName: listData.name,
    unitName: unitName,
    unitNumber: unitNumber,
  };

  return (
    <UnitContextProvider unitName={unitName} noOfItemsInUnit={unitItems.length}>
      <div className="mb-24 tablet:flex tablet:justify-center tablet:gap-2 tablet:p-2 desktopxl:grid desktopxl:grid-cols-[100px_minmax(0,1600px)]">
        <UnitDetailsLeftButtons
          listNumber={listNumber}
          unitNumber={unitNumber}
          userIsAuthor={userIsAuthor}
          editMode
        />
        <div className="flex flex-1 flex-col justify-center tablet:gap-2">
          <EditUnitHeader
            unitNumber={unitNumber}
            unitName={unitName}
            itemNumber={unitItems.length}
            listNumber={listNumber}
            unitOrder={listData.unitOrder}
          />

          <UnitItems
            allLearnedItems={learningDataForLanguage.learnedItems}
            unitItems={unitItems}
            userNative={userNative}
            userIsLearningThisList={userIsLearningThisList}
            userIsAuthor={listData.authors.includes(userId)}
            pathToUnit={paths.unitDetailsPath(listNumber, unitNumber)}
            listAndUnitData={listAndUnitData}
            editMode
          />
        </div>
        <MobileMenuContextProvider>
          <TopContextMenuLoader listNumber={listNumber} opacity={90} editMode />
        </MobileMenuContextProvider>
      </div>
    </UnitContextProvider>
  );
}
