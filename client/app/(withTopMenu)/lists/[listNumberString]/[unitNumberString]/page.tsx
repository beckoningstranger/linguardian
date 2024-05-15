import {
  getLearnedLanguageData,
  getUnitItems,
  getUserById,
} from "@/app/actions";
import AllLearningButtonsContainer from "@/components/Lists/AllLearningButtonsContainer";
import ListContainer from "@/components/Lists/ListContainer";
import AllLearningButtons from "@/components/Lists/ListOverview/AllLearningButtons";
import UnitHeader from "@/components/Lists/UnitHeader";
import { calculateUnitStats } from "@/components/Lists/UnitHelpers";
import getUnlockedModes from "@/lib/getUnlockedModes";
import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import Link from "next/link";

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
  const unitData = await getUnitItems(listNumber, unitNumber);
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (!unitData || !user)
    throw new Error("Failed to get unit data and/or user data");

  const unitLanguage = unitData[0].language;

  const learnedLanguageData = await getLearnedLanguageData(
    user.id,
    unitLanguage
  );

  if (!learnedLanguageData)
    throw new Error("Failed to get user data, please report this");

  const thisListsData = learnedLanguageData.learnedLists.find(
    (list) => list.listNumber === listNumber
  );

  const unitName = thisListsData?.unitOrder[unitNumber - 1];
  if (!unitName) throw new Error("Unit not found");
  const stats = await calculateUnitStats(listNumber, unitName);
  if (unitData && unitData?.length > 0) {
    const renderedItems = unitData.map((item) => (
      <div key={item.name + item.language}>{item.name}</div>
    ));

    return (
      <ListContainer>
        <UnitHeader unitName={unitName} />
        <AllLearningButtonsContainer>
          <AllLearningButtons
            listNumber={listNumber}
            listStats={stats}
            unlockedReviewModes={await getUnlockedModes(listNumber)}
          />
        </AllLearningButtonsContainer>
        <div>{renderedItems}</div>;
      </ListContainer>
    );
  }

  return (
    <div>
      <h1>Unit not found</h1>
      <p>This unit does not exist yet. </p>
      <div>
        <Link href={paths.listDetailsPath(listNumber)}>Back to List</Link>
        <Link href={paths.listsPath()}>List Store</Link>
      </div>
    </div>
  );
}
