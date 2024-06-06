import {
  getFullyPopulatedListByListNumber,
  getLearnedLanguageData,
  getUserById,
} from "@/app/actions";
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

interface UnitDetailsProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString },
}: UnitDetailsProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);
  const sessionUser = await getUserOnServer();
  const unlockedModes = await getUnlockedModes(listNumber);
  const userNative: SupportedLanguage = sessionUser.native.name;
  if (!userNative)
    throw new Error(`Failed to get native language of user ${sessionUser.id}`);

  const listData = await getFullyPopulatedListByListNumber(
    userNative,
    listNumber
  );
  if (!listData || !listData.unlockedReviewModes)
    throw new Error("Could not get listData");

  const unitName = listData.unitOrder[unitNumber - 1];
  const unitItems = listData?.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const user = await getUserById(sessionUser.id);

  if (!unitItems || !user)
    throw new Error("Failed to get unit data and/or user data");
  const allListsUserData = await getLearnedLanguageData(
    user.id,
    listData.language
  );

  if (!allListsUserData) throw new Error("Failed to get user data");

  const allLearnedListNumbers = allListsUserData?.learnedLists.map(
    (list) => list.listNumber
  );

  const allLearnedItems = allListsUserData.learnedItems;

  const userHasAddedThisList = allLearnedListNumbers?.includes(listNumber);

  const stats = await calculateUnitStats(listNumber, unitName);

  return (
    <ListContainer>
      <BackToListAndEditButtons
        listAuthors={listData.authors}
        listNumber={listNumber}
        userId={user.id}
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
