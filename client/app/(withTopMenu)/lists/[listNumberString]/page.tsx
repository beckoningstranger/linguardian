import {
  fetchAuthors,
  getLearningDataForLanguage,
  getListDataForMetadata,
  getPopulatedList,
} from "@/lib/fetchData";

import notFound from "@/app/not-found";
import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import Leaderboard from "@/components/Lists/ListOverview/Leaderboard";
import { getListStats } from "@/components/Lists/ListHelpers";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListOverviewLearningButtons from "@/components/Lists/ListOverview/ListOverviewLearningButtons";
import ListOverviewLeftButtons from "@/components/Lists/ListOverview/ListOverViewLeftButtons";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import StartLearningListButton from "@/components/Lists/ListOverview/StartLearningListButton";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import { ListContextProvider } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { getUserOnServer } from "@/lib/helperFunctionsServer";

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

  const [listData, user] = await Promise.all([
    getPopulatedList(listNumber),
    getUserOnServer(),
  ]);
  if (!listData) return notFound();

  const {
    name,
    description,
    image,
    authors,
    unlockedReviewModes,
    units,
    language,
  } = listData;
  const [authorData, learningDataForLanguage] = await Promise.all([
    fetchAuthors(authors),
    getLearningDataForLanguage(user.id, listData.language.code),
    // This should be combined with the backend call above into a single call
  ]);

  const userIsAuthor = authors.includes(user.id);
  const userIsLearningThisList =
    user?.learnedLists[language.code]?.includes(listNumber);

  const userListsForThisLanguage = user?.learnedLists[language.code];
  const userIsLearningListLanguage =
    Array.isArray(userListsForThisLanguage) &&
    userListsForThisLanguage.length > 0;

  const unlockedLearningModesForUser = unlockedReviewModes[user.native.code];
  const itemIdsInUnits = units.map((item) => item.item._id.toString());
  const listStats = getListStats(itemIdsInUnits, learningDataForLanguage);

  return (
    <ListContextProvider
      userIsAuthor={userIsAuthor}
      userIsLearningListLanguage={userIsLearningListLanguage}
      userIsLearningThisList={userIsLearningThisList || false}
      listData={listData}
      authorData={authorData}
      learningDataForLanguage={learningDataForLanguage}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      listStats={listStats}
      listStatus={"practice"}
    >
      <div className="mb-24 flex justify-center desktop:mb-0">
        <ListOverviewLeftButtons
          listNumber={listNumber}
          userIsAuthor={userIsAuthor}
        />
        <div
          className={`grid w-full grid-cols-1 tablet:my-2 tablet:w-auto tablet:grid-cols-[310px_310px] tablet:grid-rows-[182px_340px] tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[182px_400px] desktopxl:grid-rows-[182px_200px]`}
        >
          <ListHeader
            name={name}
            description={description}
            image={image}
            authorData={authorData}
          />
          {userIsLearningThisList && (
            <>
              <ListBarChart stats={listStats} />
              <ListPieChart mode="listoverview" stats={listStats} />
              <Leaderboard mode="list" />
            </>
          )}
          <ListUnits
            listData={listData}
            learningDataForLanguage={learningDataForLanguage}
          />
        </div>
        <StartLearningListButton mode="mobile" />
        {userIsLearningThisList && (
          <ListOverviewLearningButtons
            listNumber={listNumber}
            listStats={listStats}
            unlockedModes={unlockedReviewModes[user.native.code]}
          />
        )}
      </div>
      <MobileMenuContextProvider>
        <TopContextMenuLoader listNumber={listNumber} opacity={90} />
      </MobileMenuContextProvider>
    </ListContextProvider>
  );
}
