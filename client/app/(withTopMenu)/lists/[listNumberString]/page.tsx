import {
  fetchAuthors,
  getAllLearnedListsForUser,
  getLanguageFeaturesForLanguage,
  getLearningDataForList,
  getListDataForMetadata,
  getPopulatedList,
  getUserById,
} from "@/lib/fetchData";

import ListDetailPage from "@/components/Lists/ListOverview/ListDetails";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import notFound from "@/app/not-found";
import { ListContextProvider } from "@/context/ListContext";
import {
  calculateListStats,
  determineListStatus,
} from "@/components/Lists/ListHelpers";
import { Item, LearnedItem, LearningData } from "@/lib/types";
import { Types } from "mongoose";

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
  const [
    authorData,
    fullUser,
    allLearnedListsForUser,
    languageFeaturesForListLanguage,
    learningDataForUser,
  ] = await Promise.all([
    fetchAuthors(authors),
    getUserById(sessionUser.id),
    getAllLearnedListsForUser(sessionUser.id),
    getLanguageFeaturesForLanguage(language),
    getLearningDataForList(
      sessionUser.id,
      listData.language,
      listData.listNumber
    ),
  ]);
  if (!languageFeaturesForListLanguage)
    throw new Error("Could not get language features");

  const listLanguageName = languageFeaturesForListLanguage?.langName;
  const userIsLearningThisList: boolean =
    allLearnedListsForUser[language].includes(listNumber);

  const userIsAuthor = authors.includes(sessionUser.id);
  const learnedItemsForListLanguage = fullUser?.languages.find(
    (lang) => lang.code === language
  )?.learnedItems;

  const unlockedLearningModesForUser =
    unlockedReviewModes[sessionUser.native.name];

  const { listStats, listStatus } = getListStatsAndStatus(
    units,
    learningDataForUser
  );
  return (
    <ListContextProvider
      userIsAuthor={userIsAuthor}
      learnedItemsForListLanguage={learnedItemsForListLanguage}
      listData={listData}
      authorData={authorData}
      userIsLearningThisList={userIsLearningThisList}
      listLanguageName={listLanguageName}
      learningDataForUser={learningDataForUser}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      listStats={listStats}
      listStatus={listStatus}
    >
      <ListDetailPage />;
    </ListContextProvider>
  );
}

function getListStatsAndStatus(
  units: {
    unitName: string;
    item: Item;
  }[],
  learningData: LearningData | undefined
) {
  let learnedItems: LearnedItem[] = [];
  let ignoredItems: Types.ObjectId[] = [];
  if (learningData) {
    learnedItems = learningData.learnedItems;
    ignoredItems = learningData.ignoredItems;
  }
  const listStats = calculateListStats(
    units.map((item) => item.item._id),
    learnedItems,
    ignoredItems
  );
  const listStatus = determineListStatus(listStats);
  return { listStats, listStatus };
}
