import {
  fetchAuthors,
  getLearningDataForLanguage,
  getPopulatedList,
} from "@/lib/fetchData";

import notFound from "@/app/not-found";
import ListContainer from "@/components/Lists/ListContainer";
import ChartsLButtonsLeaderboard from "@/components/Lists/ListOverview/ChartsLearningButtonsLeaderBoard";
import DeleteListButton from "@/components/Lists/ListOverview/DeleteListButton";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import Spinner from "@/components/Spinner";
import { ListContextProvider } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { Metadata } from "next";
import { Suspense } from "react";
import { getListStats } from "@/components/Lists/ListHelpers";

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
      <ListContainer>
        <MobileMenuContextProvider>
          <DeleteListButton />
          {/* <StopLearningListButton list={{ language, listNumber, name }} /> */}
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
