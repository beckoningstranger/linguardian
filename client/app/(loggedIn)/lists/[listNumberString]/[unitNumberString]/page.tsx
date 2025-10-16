import { notFound } from "next/navigation";

import {
  IconSidebar,
  IconSidebarButton,
  Leaderboard,
  ListBarChart,
  ListOverviewLearningButtons,
  ListPieChart,
  TopContextMenu,
  TopContextMenuButton,
  UnitHeader,
  UnitItems,
} from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { TopContextMenuContextProvider } from "@/context/TopContextMenuContext";
import { UnitContextProvider } from "@/context/UnitContext";
import { fetchUnitOverviewPageData } from "@/lib/api/bff-api";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/utils/server";

// export async function generateMetadata({ params }: UnitDetailPageProps) {
//   const listNumber = parseInt(params.listNumberString);
//   const unitNumber = parseInt(params.unitNumberString);

//   return {
//     title: `${unitName} | ${listName}`,
//     description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
//       description ? ` ${description}` : ""
//     }"`,
//   };
// }

interface UnitDetailPageProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString },
}: UnitDetailPageProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Could not get user, you need to be logged in");

  const response = await fetchUnitOverviewPageData({
    listNumber,
    unitNumber,
  });
  if (!response.success) notFound();

  const {
    unitName,
    unitItems,
    listLanguage,
    listName,
    userNativeCode,
    userIsAuthor,
    userIsLearningThisList,
    itemsPlusLearningInfo,
    ignoredItemIds,
    unitOrder,
    learningStats,
    unlockedLearningModesForUser,
  } = response.data;

  const noOfItemsInUnit = unitItems.length;

  return (
    <UnitContextProvider
      unitName={unitName}
      noOfItemsInUnit={noOfItemsInUnit}
      unitNumber={unitNumber}
      listLanguage={listLanguage}
      listName={listName}
      listNumber={listNumber}
      unitOrder={unitOrder}
    >
      <div className="mb-24 tablet:flex tablet:justify-center desktop:mb-0 desktopxl:grid desktopxl:grid-cols-[100px_minmax(0,1600px)_100px]">
        <IconSidebar showOn="tablet" position="left">
          <IconSidebarButton
            mode="back"
            link={paths.listDetailsPath(listNumber)}
          />
          {userIsAuthor && (
            <IconSidebarButton
              mode="edit"
              label="Edit this unit"
              link={paths.editUnitPath(listNumber, unitNumber)}
            />
          )}
        </IconSidebar>

        <div
          className={cn(
            "justify-center tablet:gap-2 tablet:pr-2 tablet:pt-2",
            userIsLearningThisList &&
              "grid grid-cols-1 desktop:grid-rows-[80px_400px] desktopxl:grid-cols-[minmax(0,1200px)_400px] desktopxl:grid-rows-[80px]",
            !userIsLearningThisList && "flex flex-1 flex-col"
          )}
        >
          <UnitHeader unitName={unitName} itemNumber={noOfItemsInUnit} />
          {userIsLearningThisList && (
            <>
              <ListBarChart stats={learningStats} />
              <div className="hidden grid-cols-[310px_310px] gap-2 tablet:grid desktop:grid-cols-[400px_400px] desktopxl:col-start-2 desktopxl:grid-rows-[400px_400px]">
                <ListPieChart mode="unitoverview" stats={learningStats} />
                <Leaderboard mode="unit" />
              </div>
            </>
          )}
          <UnitItems
            itemsPlusLearningInfo={itemsPlusLearningInfo}
            userNative={userNativeCode}
            userIsLearningThisList={userIsLearningThisList}
            userIsAuthor={userIsAuthor}
            pathToUnit={paths.unitDetailsPath(listNumber, unitNumber)}
          />
        </div>
        {userIsLearningThisList && (
          <ListOverviewLearningButtons
            learningStats={learningStats}
            listNumber={listNumber}
            unitNumber={unitNumber}
          />
        )}
        <MobileMenuContextProvider>
          <TopContextMenuContextProvider>
            <TopContextMenu>
              <TopContextMenuButton
                mode="back"
                link={paths.listDetailsPath(listNumber)}
              />
              <TopContextMenuButton
                mode="edit"
                target="unit"
                link={paths.editUnitPath(listNumber, unitNumber)}
              />
            </TopContextMenu>
          </TopContextMenuContextProvider>
        </MobileMenuContextProvider>
      </div>
    </UnitContextProvider>
  );
}
