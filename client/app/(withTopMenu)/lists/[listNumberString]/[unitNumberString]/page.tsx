import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import { AllLearningButtonsContainer } from "@/components/Lists/AllLearningButtonsContainer";
import FlexibleLearningButtons from "@/components/Lists/FlexibleLearningButtons";
import ItemBackButton from "@/components/Lists/ItemBackButton";
import Leaderboard from "@/components/Lists/Leaderboard";
import ListContainer from "@/components/Lists/ListContainer";
import AllLearningButtons from "@/components/Lists/ListOverview/AllLearningButtons";
import ListOverviewLearningButtons from "@/components/Lists/ListOverview/ListOverviewLearningButtons";
import ListOverviewLeftButtons from "@/components/Lists/ListOverview/ListOverViewLeftButtons";
import UnitDetailsLeftButtons from "@/components/Lists/UnitDetailsLeftButtons";
import UnitHeader from "@/components/Lists/UnitHeader";
import { calculateUnitStats } from "@/components/Lists/UnitHelpers";
import UnitItems from "@/components/Lists/UnitItems";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import {
  getFullyPopulatedListByListNumber,
  getLearningDataForLanguage,
} from "@/lib/fetchData";
import { cn } from "@/lib/helperFunctionsClient";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { LearningMode, ListAndUnitData } from "@/lib/types";
import { notFound } from "next/navigation";

// export async function generateMetadata({ params }: UnitDetailPageProps) {
//   const listNumber = parseInt(params.listNumberString);
//   const unitNumber = parseInt(params.unitNumberString);

//   const { listName, unitName, langName, description } =
//     await getListDataForMetadata(listNumber, unitNumber);

//   return {
//     title: `${unitName} | ${listName}`,
//     description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
//       description ? ` ${description}` : ""
//     }"`,
//   };
// }

// export async function generateStaticParams() {
//   const listNumbers = await getListNumbers();
//   if (!listNumbers) throw new Error("Failed to get all list numbers");

//   const listNumbersWithUnitNumbers = Promise.all(
//     listNumbers.map(async (number) => ({
//       listNumberString: number,
//       unitNumberString: await getUnitNumbers(Number(number)),
//     }))
//   );

//   let possibilities: {
//     listNumberString: string;
//     unitNumberString: string;
//   }[] = [];

//   (await listNumbersWithUnitNumbers).forEach((listNumber) =>
//     listNumber.unitNumberString.forEach((unitNumber) =>
//       possibilities.push({
//         listNumberString: listNumber.listNumberString,
//         unitNumberString: String(unitNumber),
//       })
//     )
//   );
//   return possibilities;
// }

interface UnitDetailPageProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString },
}: UnitDetailPageProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);
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

  const unitName = listData.unitOrder[unitNumber - 1];
  if (!unitName) notFound();
  const learningDataForLanguage = await getLearningDataForLanguage(
    userId,
    listData.language.code
  );
  if (!learningDataForLanguage) throw new Error("Could not get learning data");

  const unitItems = listData?.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const userIsLearningThisList = Object.values(learnedLists)
    .flat()
    ?.includes(listNumber);

  const userIsAuthor = listData.authors.includes(userId);

  const stats = await calculateUnitStats(
    unitName,
    learningDataForLanguage,
    listData
  );

  const unlockedModes: LearningMode[] =
    listData.unlockedReviewModes[userNative];

  const listAndUnitData: ListAndUnitData = {
    languageWithFlagAndName: listData.language,
    listNumber: listNumber,
    listName: listData.name,
    unitName: unitName,
    unitNumber: unitNumber,
  };

  return (
    <div className="tablet:flex tablet:justify-center tablet:gap-2 tablet:p-2 desktopxl:grid desktopxl:grid-cols-[100px_minmax(0,1600px)_100px]">
      <UnitDetailsLeftButtons
        listNumber={listNumber}
        unitName={unitName}
        unitNumber={unitNumber}
        noOfItemsInUnit={unitItems.length}
        userIsAuthor={userIsAuthor}
      />
      <div
        className={cn(
          "justify-center tablet:gap-2",
          userIsLearningThisList &&
            "grid grid-cols-1 desktop:grid-rows-[88px_400px] desktopxl:grid-cols-[minmax(0,1200px)_400px] desktopxl:grid-rows-[88px]",
          !userIsLearningThisList && "flex flex-1 flex-col"
        )}
      >
        <UnitHeader
          unitNumber={unitNumber}
          unitName={unitName}
          itemNumber={unitItems.length}
          listNumber={listNumber}
          unitCount={listData.unitOrder.length}
        />
        {userIsLearningThisList && (
          <>
            <ListBarChart stats={stats} />
            <div className="hidden grid-cols-[310px_310px] gap-2 tablet:grid desktop:grid-cols-[400px_400px] desktopxl:col-start-2 desktopxl:grid-rows-[400px_400px]">
              <ListPieChart mode="unitoverview" stats={stats} />
              <Leaderboard mode="unit" />
            </div>
          </>
        )}
        <UnitItems
          allLearnedItems={learningDataForLanguage.learnedItems}
          unitItems={unitItems}
          userNative={userNative}
          userIsLearningThisList={userIsLearningThisList}
          userIsAuthor={listData.authors.includes(userId)}
          pathToUnit={paths.unitDetailsPath(listNumber, unitNumber)}
          listAndUnitData={listAndUnitData}
        />
      </div>
      {userIsLearningThisList && (
        <ListOverviewLearningButtons
          unlockedModes={unlockedModes}
          listStats={stats}
          listNumber={listNumber}
          unitNumber={unitNumber}
        />
      )}
      <MobileMenuContextProvider>
        <TopContextMenuLoader listNumber={listNumber} opacity={90} />
      </MobileMenuContextProvider>
    </div>
  );
}
/* <div className="hidden sm:block">
              <div className="flex">
                <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                </div>
                <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                </div>
              </div>
              <AllLearningButtonsContainer mode="desktop">
                <AllLearningButtons
                  listStats={stats}
                  listNumber={listNumber}
                  unlockedLearningModesForUser={unlockedModes}
                  unitNumber={unitNumber}
                />
              </AllLearningButtonsContainer>
            </div> */
/* <UnitItems
          allLearnedItems={learningDataForLanguage.learnedItems}
          unitItems={unitItems}
          userNative={userNative}
          userIsAuthor={listData.authors.includes(userId)}
          pathToUnit={paths.unitDetailsPath(listNumber, unitNumber)}
          listAndUnitData={listAndUnitData}
        /> */
/* {userIsLearningThisList && (
          <AllLearningButtonsContainer mode="mobile">
            <FlexibleLearningButtons
              stats={stats}
              status={"practice"}
              listNumber={listNumber}
              unlockedModes={unlockedModes}
            />
          </AllLearningButtonsContainer>
        )} */
/* {userIsLearningThisList && <ListOverviewLearningButtons />} */
// );
