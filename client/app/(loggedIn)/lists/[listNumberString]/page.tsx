import { notFound } from "next/navigation";

import {
  IconSidebar,
  IconSidebarButton,
  Leaderboard,
  ListBarChart,
  ListHeader,
  ListOverviewLearningButtons,
  ListPieChart,
  ListUnits,
  StartLearningListButton,
  StopLearningListButton,
  TopContextMenu,
  TopContextMenuButton,
} from "@/components";
import { ListContextProvider } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { TopContextMenuContextProvider } from "@/context/TopContextMenuContext";
import { fetchListOverviewPageData } from "@/lib/api/bff-api";
import paths from "@/lib/paths";
import { getCurrentUserId } from "@/lib/utils/server";

// export async function generateMetadata({ params }: ListPageProps) {
//   const listNumber = parseInt(params.listNumberString);

//     const response = await fetchListOverviewPageData({ listNumber }, userId);
//   if (!response.success) notFound();

//   const { listName, langName, description } = listData;
//   return {
//     title: listName,
//     description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
//       description ? ` ${description}` : ""
//     }"`,
//   };
// }

interface ListPageProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListPage({
  params: { listNumberString },
}: ListPageProps) {
  const listNumber = parseInt(listNumberString);
  if (!listNumber) notFound();

  const userId = await getCurrentUserId();
  if (!userId) throw new Error("You need to log in to see this page");

  const response = await fetchListOverviewPageData({ listNumber }, userId);
  if (!response.success) notFound();

  const {
    listImage,
    listDescription,
    listLanguage,
    listName,
    learningStats,
    unlockedLearningModesForUser,
    userIsAuthor,
    userIsLearningThisList,
    userIsLearningListLanguage,
    authorData,
    learnedItemIds,
    ignoredItemIds, // Will be used later, e.g. (Learned 18 out of 20, ignoring 2)
    unitInformation,
    listStatus,
  } = response.data;

  return (
    <ListContextProvider
      listNumber={listNumber}
      listLanguage={listLanguage}
      listDescription={listDescription}
      listImage={listImage}
      listName={listName}
      learningStats={learningStats}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      userIsAuthor={userIsAuthor}
      userIsLearningListLanguage={userIsLearningListLanguage}
      userIsLearningThisList={userIsLearningThisList || false}
      authorData={authorData}
      learnedItemIds={learnedItemIds}
      ignoredItemIds={ignoredItemIds}
      unitInformation={unitInformation}
      listStatus={listStatus}
    >
      <div className="flex w-full grow justify-center overflow-y-auto tablet:pb-4">
        <IconSidebar position="left" showOn="tablet">
          <StartLearningListButton mode="desktop" />
          <StopLearningListButton mode="desktop" />
          {userIsAuthor && (
            <IconSidebarButton
              mode="edit"
              link={paths.editListPath(listNumber)}
            />
          )}
        </IconSidebar>

        <div
          className={`grid w-full grid-cols-1 tablet:my-2 tablet:w-auto tablet:grid-cols-[310px_310px] tablet:grid-rows-[182px_340px] tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[182px_400px] desktopxl:grid-rows-[182px_200px]`}
          id="listOverviewMain"
        >
          <ListHeader
            name={listName}
            description={listDescription}
            image={listImage}
            authorData={authorData}
          />
          {userIsLearningThisList && (
            <>
              <ListBarChart stats={learningStats} />
              <ListPieChart mode="listoverview" stats={learningStats} />
              <Leaderboard mode="list" />
            </>
          )}
          <ListUnits
            unitInformation={unitInformation}
            listNumber={listNumber}
            userIsLearningThisList={userIsLearningThisList}
          />
        </div>
        <StartLearningListButton mode="mobile" />
        {userIsLearningThisList && (
          <ListOverviewLearningButtons
            listNumber={listNumber}
            learningStats={learningStats}
            unlockedLearningModesForUser={unlockedLearningModesForUser}
          />
        )}
      </div>
      <MobileMenuContextProvider>
        <TopContextMenuContextProvider>
          <TopContextMenu>
            <StopLearningListButton mode="mobile" />
            {userIsAuthor && (
              <>
                <TopContextMenuButton
                  mode="edit"
                  link={paths.editListPath(listNumber)}
                />
              </>
            )}
          </TopContextMenu>
        </TopContextMenuContextProvider>
      </MobileMenuContextProvider>
    </ListContextProvider>
  );
}
