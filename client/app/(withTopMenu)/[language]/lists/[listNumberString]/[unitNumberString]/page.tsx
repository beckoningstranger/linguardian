import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import {
  AllLearningButtonsDesktopContainer,
  AllLearningButtonsMobileContainer,
} from "@/components/Lists/AllLearningButtonsContainer";
import FlexibleLearningButtons from "@/components/Lists/FlexibleLearningButtons";
import ItemBackButton from "@/components/Lists/ItemBackButton";
import Leaderboard from "@/components/Lists/Leaderboard";
import ListContainer from "@/components/Lists/ListContainer";
import { determineListStatus } from "@/components/Lists/ListHelpers";
import AllLearningButtons from "@/components/Lists/ListOverview/AllLearningButtons";
import UnitHeader from "@/components/Lists/UnitHeader";
import { calculateUnitStats } from "@/components/Lists/UnitHelpers";
import UnitItems from "@/components/Lists/UnitItems";
import {
  getFullyPopulatedListByListNumber,
  getLearnedLanguageData,
  getListDataForMetadata,
} from "@/lib/fetchData";
import {
  getSeperatedUserLanguages,
  getUserOnServer,
} from "@/lib/helperFunctions";
import paths from "@/lib/paths";
import { LearningMode, ListAndUnitData, SupportedLanguage } from "@/lib/types";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: UnitDetailPageProps) {
  const listNumber = parseInt(params.listNumberString);
  const unitNumber = parseInt(params.unitNumberString);

  const { listName, unitName, langName, description } =
    await getListDataForMetadata(listNumber, unitNumber);

  return {
    title: `${unitName} | ${listName}`,
    description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
      description ? ` ${description}` : ""
    }"`,
  };
}

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
    language: SupportedLanguage;
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString, language },
}: UnitDetailPageProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);
  const {
    id: userId,
    native: { name: userNative },
  } = await getUserOnServer();

  const [listData, allListsUserData, seperateUserLanguages] = await Promise.all(
    [
      getFullyPopulatedListByListNumber(userNative, listNumber),
      getLearnedLanguageData(userId, language),
      getSeperatedUserLanguages(),
    ]
  );
  if (!listData || !allListsUserData || !seperateUserLanguages)
    throw new Error("Could not get data");

  const unitName = listData.unitOrder[unitNumber - 1];
  if (!unitName) notFound();

  const unitItems = listData?.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const allLearnedListNumbers = allListsUserData?.learnedLists.map(
    (list) => list.listNumber
  );
  const allLearnedItems = allListsUserData?.learnedItems;
  const userHasAddedThisList = allLearnedListNumbers?.includes(listNumber);
  const stats = await calculateUnitStats(unitName, allListsUserData, listData);

  const unlockedModes: LearningMode[] =
    listData.unlockedReviewModes[userNative];

  const listAndUnitData: ListAndUnitData = {
    languageWithFlag: { name: listData.language, flag: listData.flag },
    listNumber: listNumber,
    listName: listData.name,
    unitName: unitName,
    unitNumber: unitNumber,
  };

  return (
    <ListContainer>
      <ItemBackButton path={paths.listDetailsPath(listNumber, language)} />
      <UnitHeader
        unitNumber={unitNumber}
        unitName={unitName}
        itemNumber={unitItems.length}
        listNumber={listNumber}
        unitCount={listData.unitOrder.length}
        listLanguage={listData.language}
      />
      {userHasAddedThisList && (
        <>
          <div className="md:hidden">
            <ListBarChart stats={stats} />
          </div>
          <div className="hidden md:block">
            <div className="flex">
              <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                <ListPieChart stats={stats} />
              </div>
              <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                <Leaderboard />
              </div>
            </div>
            <AllLearningButtonsDesktopContainer>
              <AllLearningButtons
                listLanguage={language}
                listNumber={listNumber}
                listStats={stats}
                unlockedReviewModes={unlockedModes}
              />
            </AllLearningButtonsDesktopContainer>
          </div>
        </>
      )}
      <UnitItems
        allLearnedItems={allLearnedItems}
        unitItems={unitItems}
        userNative={userNative}
        userIsAuthor={listData.authors.includes(userId)}
        pathToUnit={paths.unitDetailsPath(listNumber, unitNumber, language)}
        userLanguagesWithFlags={seperateUserLanguages}
        listAndUnitData={listAndUnitData}
      />
      {userHasAddedThisList && (
        <AllLearningButtonsMobileContainer>
          <FlexibleLearningButtons
            listLanguage={language}
            stats={stats}
            status={determineListStatus(stats)}
            listNumber={listNumber}
            unlockedModes={unlockedModes}
          />
        </AllLearningButtonsMobileContainer>
      )}
    </ListContainer>
  );
}
