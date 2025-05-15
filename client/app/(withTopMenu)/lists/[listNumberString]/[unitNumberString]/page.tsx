import { notFound } from "next/navigation";

import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import ListOverviewLearningButtons from "@/components/Lists/ListOverview/ListOverviewLearningButtons";
import UnitDetailsLeftButtons from "@/components/Lists/UnitDetailsLeftButtons";
import { calculateUnitStats } from "@/components/Lists/UnitHelpers";
import Leaderboard from "@/components/Lists/Leaderboard";
import UnitHeader from "@/components/Lists/UnitHeader";
import UnitItems from "@/components/Lists/UnitItems";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { UnitContextProvider } from "@/context/UnitContext";
import {
  getFullyPopulatedListByListNumber,
  getLearningDataForLanguage,
} from "@/lib/fetchData";
import { cn } from "@/lib/helperFunctionsClient";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { LearningMode, ListAndUnitData } from "@/lib/types";

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

  const listStats = await calculateUnitStats(
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

  // const unlockedLearningModesForUser = listData.unlockedReviewModes[userNative];

  return (
    <UnitContextProvider
      // userIsAuthor={userIsAuthor}
      // userIsLearningThisList={userIsLearningThisList || false}
      // listData={listData}
      // learningDataForLanguage={learningDataForLanguage}
      // unlockedLearningModesForUser={unlockedLearningModesForUser}
      // listStats={listStats}
      // listStatus={"practice"}
      unitName={unitName}
      noOfItemsInUnit={unitItems.length}
    >
      <div className="mb-24 tablet:flex tablet:justify-center tablet:gap-2 tablet:p-2 desktopxl:grid desktopxl:grid-cols-[100px_minmax(0,1600px)_100px]">
        <UnitDetailsLeftButtons
          listNumber={listNumber}
          unitNumber={unitNumber}
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
              <ListBarChart stats={listStats} />
              <div className="hidden grid-cols-[310px_310px] gap-2 tablet:grid desktop:grid-cols-[400px_400px] desktopxl:col-start-2 desktopxl:grid-rows-[400px_400px]">
                <ListPieChart mode="unitoverview" stats={listStats} />
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
            listStats={listStats}
            listNumber={listNumber}
            unitNumber={unitNumber}
          />
        )}
        <MobileMenuContextProvider>
          <TopContextMenuLoader listNumber={listNumber} opacity={90} />
        </MobileMenuContextProvider>
      </div>
    </UnitContextProvider>
  );
}
