import {
  fetchAuthors,
  getLanguageFeaturesForLanguage,
  getLearnedLanguageData,
  getPopulatedList,
} from "@/app/actions";
import Link from "next/link";

import paths from "@/paths";
import getUserOnServer from "@/lib/getUserOnServer";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import StartLearningListButton from "@/components/Lists/ListOverview/StartLearningListButton";
import ListBarChart from "@/components/Charts/ListBarChart";
import FlexibleLearningButtons from "@/components/Lists/FlexibleLearningButtons";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import {
  calculateListStats,
  determineListStatus,
} from "@/components/Lists/ListHelpers";
import { ListStats, ListStatus, SupportedLanguage } from "@/types";
import ListPieChart from "@/components/Charts/ListPieChart";
import Leaderboard from "@/components/Lists/Leaderboard";
import AllLearningButtons from "@/components/Lists/ListOverview/AllLearningButtons";
import ListContainer from "@/components/Lists/ListContainer";
import {
  AllLearningButtonsDesktopContainer,
  AllLearningButtonsMobileContainer,
} from "@/components/Lists/AllLearningButtonsContainer";

interface ListDetailProps {
  params: {
    language: SupportedLanguage;
    listNumberString: string;
  };
}

export default async function ListDetailPage({
  params: { listNumberString, language },
}: ListDetailProps) {
  const listNumber = parseInt(listNumberString);

  const listData = await getPopulatedList(listNumber);
  if (!listData || !listData.unlockedReviewModes)
    throw new Error("Could not get listData");

  const sessionUser = await getUserOnServer();
  const usersNativeLanguage: SupportedLanguage = sessionUser.native.name;
  if (!usersNativeLanguage)
    throw new Error("Error getting users native language");
  const unlockedReviewModes =
    listData?.unlockedReviewModes[usersNativeLanguage];

  const userId = sessionUser.id;

  if (listData && userId) {
    const {
      name,
      description,
      authors,
      unitOrder,
      units,
      language,
      listNumber,
    } = listData;

    const allListsUserData = await getLearnedLanguageData(userId, language);

    if (!allListsUserData)
      throw new Error("Failed to get user data, please report this");

    const thisListsUserData = allListsUserData.learnedLists.find(
      (list) => list.listNumber === listNumber
    );

    const allLearnedListNumbers = allListsUserData?.learnedLists.map(
      (list) => list.listNumber
    );
    const listId = listData.listNumber;
    const userHasAddedThisList = allLearnedListNumbers?.includes(listId);

    const renderedAuthors = await fetchAuthors(authors);

    const languageFeatures = await getLanguageFeaturesForLanguage(language);

    let listStats: ListStats | null = null;
    let listStatus: ListStatus | null = null;
    if (thisListsUserData) {
      listStats = calculateListStats(
        thisListsUserData,
        allListsUserData?.learnedItems,
        allListsUserData?.ignoredItems
      );
      listStatus = determineListStatus(listStats);
    }

    if (languageFeatures)
      return (
        <ListContainer>
          <div className="mb-24 flex flex-col md:mb-0">
            <ListHeader
              name={name}
              description={description}
              authors={renderedAuthors}
              numberOfItems={listData.units.length}
              image={listData.image}
              added={userHasAddedThisList}
            />

            {userId && !userHasAddedThisList && (
              <StartLearningListButton
                learnedLanguageData={allListsUserData}
                language={language}
                userId={userId}
                listNumber={listNumber}
                languageName={languageFeatures.langName}
              />
            )}
            {userHasAddedThisList && listStats && (
              <>
                <div className="md:hidden">
                  <ListBarChart stats={listStats} />
                </div>
                <div className="hidden md:block">
                  <div className="flex">
                    <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                      <ListPieChart stats={listStats} />
                    </div>
                    <div className="m-2 w-1/2 rounded-md bg-slate-100 py-4">
                      <Leaderboard />
                    </div>
                  </div>
                  {listStats && (
                    <AllLearningButtonsDesktopContainer>
                      <AllLearningButtons
                        listNumber={listNumber}
                        listStats={listStats}
                        unlockedReviewModes={unlockedReviewModes}
                      />
                    </AllLearningButtonsDesktopContainer>
                  )}
                </div>
              </>
            )}

            <ListUnits
              unitOrder={unitOrder}
              units={units}
              listNumber={listNumber}
              language={language}
            />

            {userHasAddedThisList && listStats && listStatus && (
              <div>
                <div className="my-4 h-64 bg-slate-100 md:hidden">
                  <Leaderboard />
                </div>

                <AllLearningButtonsMobileContainer>
                  <FlexibleLearningButtons
                    stats={listStats}
                    status={listStatus}
                    listNumber={listNumber}
                    unlockedModes={unlockedReviewModes}
                  />
                </AllLearningButtonsMobileContainer>
              </div>
            )}
          </div>
        </ListContainer>
      );
  }

  return (
    <div>
      <h1>List or user not found</h1>
      <p>
        Either the list does not exist yet or there was a problem fetching it
        from the database. Make sure you are logged in.
      </p>
      <div>
        <Link href={paths.dashboardLanguagePath(language)}>
          Back to Dashboard
        </Link>
        <Link href={paths.listsLanguagePath(language)}>List Store</Link>
      </div>
    </div>
  );
}
