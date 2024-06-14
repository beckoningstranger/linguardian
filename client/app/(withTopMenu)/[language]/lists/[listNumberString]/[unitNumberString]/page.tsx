import {
  getFullyPopulatedListByListNumber,
  getLearnedLanguageData,
  getListDataForMetadata,
} from "@/lib/fetchData";
import ListBarChart from "@/components/Charts/ListBarChart";
import {
  AllLearningButtonsDesktopContainer,
  AllLearningButtonsMobileContainer,
} from "@/components/Lists/AllLearningButtonsContainer";
import FlexibleLearningButtons from "@/components/Lists/FlexibleLearningButtons";
import ListContainer from "@/components/Lists/ListContainer";
import { determineListStatus } from "@/components/Lists/ListHelpers";
import AllLearningButtons from "@/components/Lists/ListOverview/AllLearningButtons";
import UnitHeader from "@/components/Lists/UnitHeader";
import { calculateUnitStats } from "@/components/Lists/UnitHelpers";
import getUnlockedModes from "@/lib/getUnlockedModes";
import getUserOnServer from "@/lib/getUserOnServer";
import BackToListAndEditButtons from "@/components/Lists/BackToListAndEditButtons";
import ListPieChart from "@/components/Charts/ListPieChart";
import Leaderboard from "@/components/Lists/Leaderboard";
import UnitItems from "@/components/Lists/UnitItems";
import { SupportedLanguage } from "@/types";

export async function generateMetadata({ params }: UnitDetailsProps) {
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

interface UnitDetailsProps {
  params: {
    language: SupportedLanguage;
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString, language },
}: UnitDetailsProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);
  const {
    id: userId,
    native: { name: userNative },
  } = await getUserOnServer();

  const [unlockedModes, listData, allListsUserData] = await Promise.all([
    getUnlockedModes(listNumber),
    getFullyPopulatedListByListNumber(userNative, listNumber),
    getLearnedLanguageData(userId, language),
  ]);
  if (!listData || !allListsUserData) throw new Error("Could not get data");

  const unitName = listData.unitOrder[unitNumber - 1];
  const unitItems = listData?.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const allLearnedListNumbers = allListsUserData?.learnedLists.map(
    (list) => list.listNumber
  );
  const allLearnedItems = allListsUserData?.learnedItems;
  const userHasAddedThisList = allLearnedListNumbers?.includes(listNumber);
  const stats = await calculateUnitStats(listNumber, unitName);

  return (
    <ListContainer>
      <BackToListAndEditButtons
        listAuthors={listData.authors}
        listNumber={listNumber}
        userId={userId}
        listLanguage={listData.language}
      />
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
