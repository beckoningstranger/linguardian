import {
  fetchAuthors,
  getLearningDataForLanguage,
  getPopulatedList,
} from "@/lib/fetchData";

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
import Spinner from "@/components/Spinner";
import { ListContextProvider } from "@/context/ListContext";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { Metadata } from "next";
import { Suspense } from "react";

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

  const { authors, unlockedReviewModes, units } = listData;
  const [authorData, learningDataForLanguage] = await Promise.all([
    fetchAuthors(authors),
    getLearningDataForLanguage(user.id, listData.language.code),
  ]);

  const userIsAuthor = authors.includes(user.id);
  const unlockedLearningModesForUser = unlockedReviewModes[user.native.code];
  const itemIdsInUnits = units.map((item) => item.item._id.toString());
  const listStats = getListStats(itemIdsInUnits, learningDataForLanguage);
  const showStartLearningButton =
    !user?.learnedLists?.[listData.language.code]?.includes(listNumber);

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
        className="flex justify-center tablet:gap-2 tablet:p-2"
        id="container"
      >
        <ListOverviewLeftButtons />
        <div
          id="inner-container"
          className="grid grid-cols-1 tablet:grid-cols-[340px_340px] tablet:grid-rows-[200px_340px] tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[200px_400px] desktopxl:grid-cols-[500px_350px] desktopxl:grid-rows-[200px_200px]"
        >
          <ListHeader />
          {/* {true && <StartLearningListButton />} */}
          {showStartLearningButton && <StartLearningListButton />}
          {/* In StartLearningButton: col-start-1 row-start-2 tablet:col-span-2 tablet:row-start-2 */}
          <Suspense fallback={<Spinner centered />}>
            <div className="grid max-h-[120px] bg-white/90 py-4 tablet:hidden">
              <ListBarChart stats={listStats} />
            </div>

            <div className="hidden rounded-md bg-white/90 py-4 tablet:block desktopxl:row-span-2 desktopxl:grid desktopxl:w-[400px] desktopxl:place-items-center desktopxl:p-0">
              <ListPieChart stats={listStats} />
            </div>
            <div className="hidden rounded-md bg-white/90 py-4 tablet:block desktopxl:col-start-3 desktopxl:min-h-[400px]">
              <Leaderboard />
            </div>
            <div className="tablet:col-span-2 desktopxl:row-start-2">
              <ListUnits />
            </div>
          </Suspense>
        </div>
        <ListOverviewLearningButtons />
      </div>
    </ListContextProvider>
  );
}

// <MobileMenuContextProvider>
//   <DeleteListButton />
//   {/* <StopLearningListButton list={{ language, listNumber, name }} /> */}
// </MobileMenuContextProvider>
