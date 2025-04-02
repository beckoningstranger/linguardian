import {
  fetchAuthors,
  getLearningDataForLanguage,
  getPopulatedList,
} from "@/lib/fetchData";

import { Metadata } from "next";
import notFound from "@/app/not-found";
import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "@/components/Charts/ListPieChart";
import Leaderboard from "@/components/Lists/Leaderboard";
import { getListStats } from "@/components/Lists/ListHelpers";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListOverviewLearningButtons from "@/components/Lists/ListOverview/ListOverviewLearningButtons";
import ListOverviewLeftButtons from "@/components/Lists/ListOverview/ListOverViewLeftButtons";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import StartLearningListButton from "@/components/Lists/ListOverview/StartLearningListButton";
import { ListContextProvider } from "@/context/ListContext";
import { getUserOnServer } from "@/lib/helperFunctionsServer";

// export async function generateMetadata({ params }: ListPageProps) {
//   const listNumber = parseInt(params.listNumberString);

//   const listData = await getListDataForMetadata(listNumber, 1);
//   const { listName, langName, description } = listData;
//   return {
//     title: listName,
//     description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
//       description ? ` ${description}` : ""
//     }"`,
//   };
// }

export const metadata: Metadata = {
  description: "Enrich your vocabulary by memorizing this list",
};

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

  const { authors, unlockedReviewModes, units, language } = listData;
  const [authorData, learningDataForLanguage] = await Promise.all([
    fetchAuthors(authors),
    getLearningDataForLanguage(user.id, listData.language.code),
  ]);

  const userIsAuthor = authors.includes(user.id);
  const userIsLearningThisList =
    user.learnedLists[language.code]?.includes(listNumber);

  const unlockedLearningModesForUser = unlockedReviewModes[user.native.code];
  const itemIdsInUnits = units.map((item) => item.item._id.toString());
  const listStats = getListStats(itemIdsInUnits, learningDataForLanguage);

  return (
    <ListContextProvider
      userIsAuthor={userIsAuthor}
      listData={listData}
      authorData={authorData}
      learningDataForLanguage={learningDataForLanguage}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      listStats={listStats}
      listStatus={"practice"}
    >
      <div
        className="flex justify-center tablet:gap-2 tablet:py-2"
        id="container"
      >
        <ListOverviewLeftButtons />
        <div
          id="inner-container"
          className={`grid grid-cols-1 tablet:grid-cols-[340px_340px] ${
            userIsLearningThisList
              ? "tablet:grid-rows-[200px_340px]"
              : "tablet:grid-rows-[200px_64px]"
          } tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[200px_400px] desktopxl:grid-cols-[500px_350px] desktopxl:grid-rows-[200px_200px]`}
        >
          <ListHeader />
          {!userIsLearningThisList && <StartLearningListButton />}
          {userIsLearningThisList && (
            <>
              <ListBarChart stats={listStats} />
              <ListPieChart mode="listoverview" stats={listStats} />
              <Leaderboard />
            </>
          )}
          <ListUnits />
        </div>
        {userIsLearningThisList && <ListOverviewLearningButtons />}
      </div>
    </ListContextProvider>
  );
}

// <MobileMenuContextProvider>
//   <DeleteListButton />
//   {/* <StopLearningListButton list={{ language, listNumber, name }} /> */}
// </MobileMenuContextProvider>
