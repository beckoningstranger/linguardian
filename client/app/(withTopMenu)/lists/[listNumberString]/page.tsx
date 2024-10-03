import {
  fetchAuthors,
  getLanguageFeaturesForLanguage,
  getLearningDataForList,
  getListDataForMetadata,
  getPopulatedList,
} from "@/lib/fetchData";

import notFound from "@/app/not-found";
import ListContainer from "@/components/Lists/ListContainer";
import { getListStatsAndStatus } from "@/components/Lists/ListHelpers";
import ChartsLButtonsLeaderboard from "@/components/Lists/ListOverview/ChartsLearningButtonsLeaderBoard";
import DeleteListButton from "@/components/Lists/ListOverview/DeleteListButton";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import Spinner from "@/components/Spinner";
import { ListContextProvider } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { Suspense } from "react";

export async function generateMetadata({ params }: ListPageProps) {
  const listNumber = parseInt(params.listNumberString);

  const listData = await getListDataForMetadata(listNumber, 1);
  const { listName, langName, description } = listData;
  return {
    title: listName,
    description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
      description ? ` ${description}` : ""
    }"`,
  };
}

interface ListPageProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListPage({
  params: { listNumberString },
}: ListPageProps) {
  const listNumber = parseInt(listNumberString);

  const [listData, sessionUser] = await Promise.all([
    getPopulatedList(listNumber),
    getUserOnServer(),
  ]);
  if (!listData) return notFound();

  const { language, authors, unlockedReviewModes, units } = listData;
  const [authorData, languageFeaturesForListLanguage, learningDataForUser] =
    await Promise.all([
      fetchAuthors(authors),
      getLanguageFeaturesForLanguage(language),
      getLearningDataForList(
        sessionUser.id,
        listData.language,
        listData.listNumber
      ),
    ]);
  const learnedListsForUserAndLanguage = sessionUser.learnedLists[language];

  if (!languageFeaturesForListLanguage)
    throw new Error("Could not get language features");

  const listLanguageName = languageFeaturesForListLanguage?.langName;
  const userIsLearningThisList: boolean =
    learnedListsForUserAndLanguage?.includes(listNumber) || false;

  const userIsAuthor = authors.includes(sessionUser.id);

  const unlockedLearningModesForUser =
    unlockedReviewModes[sessionUser.native.name];

  const itemIdsInUnits = units.map((item) => item.item._id);
  const { listStats, listStatus } = getListStatsAndStatus(
    itemIdsInUnits,
    learningDataForUser
  );
  return (
    <ListContextProvider
      userIsAuthor={userIsAuthor}
      listData={listData}
      authorData={authorData}
      userIsLearningThisList={userIsLearningThisList}
      listLanguageName={listLanguageName}
      learningDataForUser={learningDataForUser}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      listStats={listStats}
      listStatus={listStatus}
    >
      <ListContainer>
        <MobileMenuContextProvider>
          <DeleteListButton />
        </MobileMenuContextProvider>
        <ListHeader />
        <Suspense fallback={<Spinner centered />}>
          <ChartsLButtonsLeaderboard />
        </Suspense>
        <ListUnits />
      </ListContainer>
    </ListContextProvider>
  );
}
