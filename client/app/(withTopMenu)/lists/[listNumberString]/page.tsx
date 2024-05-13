import {
  getLanguageFeaturesForLanguage,
  getLearnedLanguageData,
  getPopulatedList,
  getUserById,
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
import { ListStats, ListStatus } from "@/types";

interface ListDetailProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListDetailPage({
  params: { listNumberString },
}: ListDetailProps) {
  const listNumber = parseInt(listNumberString);

  const listData = await getPopulatedList(listNumber);

  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (listData?.data && user) {
    const {
      name,
      description,
      authors,
      unitOrder,
      units,
      language,
      listNumber,
    } = listData.data;

    const learnedLanguageData = await getLearnedLanguageData(user.id, language);

    if (!learnedLanguageData)
      throw new Error("Failed to get user data, please report this");

    const thisListsData = learnedLanguageData.learnedLists.find(
      (list) => list.listNumber === listNumber
    );

    const allLearnedListNumbers = learnedLanguageData?.learnedLists.map(
      (list) => list.listNumber
    );
    const listId = listData.data.listNumber;
    const userHasAddedThisList = allLearnedListNumbers?.includes(listId);

    const renderedAuthors = authors
      .map((author) => author.username)
      .join(" & ");

    const languageFeatures = await getLanguageFeaturesForLanguage(language);

    let listStats: ListStats | null = null;
    let listStatus: ListStatus | null = null;
    if (thisListsData) {
      listStats = calculateListStats(
        thisListsData,
        learnedLanguageData?.learnedItems,
        learnedLanguageData?.ignoredItems
      );
      listStatus = determineListStatus(listStats);
    }

    if (languageFeatures)
      return (
        <div id="container" className="md:mx-20 lg:mx-48 xl:mx-64 2xl:mx-96">
          <div className="mb-24 flex flex-col">
            <ListHeader
              name={name}
              description={description}
              authors={renderedAuthors}
              numberOfItems={listData.data.units.length}
              image={listData.data.image}
              added={userHasAddedThisList}
            />

            {user && !userHasAddedThisList && (
              <StartLearningListButton
                learnedLanguageData={learnedLanguageData}
                language={language}
                userId={user.id}
                listNumber={listNumber}
                languageName={languageFeatures.langName}
              />
            )}
            {userHasAddedThisList && listStats && (
              <div className="md:hidden">
                <ListBarChart stats={listStats} />
              </div>
            )}

            <ListUnits
              unitOrder={unitOrder}
              units={units}
              listNumber={listNumber}
            />

            {userHasAddedThisList && listStats && listStatus && (
              <div className="fixed bottom-0 h-24 w-full bg-slate-200 py-4 md:hidden">
                <FlexibleLearningButtons
                  stats={listStats}
                  status={listStatus}
                  listNumber={listNumber}
                />
              </div>
            )}
          </div>
        </div>
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
        <Link href={paths.dashboardPath()}>Back to Dashboard</Link>
        <Link href={paths.listsPath()}>List Store</Link>
      </div>
    </div>
  );
}
