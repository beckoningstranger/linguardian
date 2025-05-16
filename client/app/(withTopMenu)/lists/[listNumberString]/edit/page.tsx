import notFound from "@/app/not-found";
import EditListHeader from "@/components/Lists/EditList/EditListHeader";
import EditListUnits from "@/components/Lists/EditList/EditListUnits";
import { getListStats } from "@/components/Lists/ListHelpers";
import ListOverviewLeftButtons from "@/components/Lists/ListOverview/ListOverViewLeftButtons";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import { ListContextProvider } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import {
  fetchAuthors,
  getLearningDataForLanguage,
  getPopulatedList,
} from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

interface ListEditPageProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListEditPage({
  params: { listNumberString },
}: ListEditPageProps) {
  const listNumber = Number(listNumberString);
  const [user, list] = await Promise.all([
    getUserOnServer(),
    getPopulatedList(listNumber),
  ]);

  if (!list || !user) return notFound();

  const userIsAuthor = list?.authors.includes(user.id);
  if (!userIsAuthor) redirect(paths.listDetailsPath(listNumber));

  const { authors, unlockedReviewModes, units, language } = list;

  // This should be fetched immediately when getting the data above, saving time
  const [authorData, learningDataForLanguage] = await Promise.all([
    fetchAuthors(authors),
    getLearningDataForLanguage(user.id, list.language.code),
  ]);

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
      listData={list}
      authorData={authorData}
      learningDataForLanguage={learningDataForLanguage}
      unlockedLearningModesForUser={unlockedLearningModesForUser}
      listStats={listStats}
      listStatus={"practice"}
    >
      <div className="mb-24 flex justify-center tablet:gap-2 tablet:py-2 desktop:mb-0">
        <ListOverviewLeftButtons
          listNumber={listNumber}
          userIsAuthor={userIsAuthor}
          editMode
        />
        <div
          className={`grid grid-cols-1 tablet:grid-cols-[310px_310px] tablet:grid-rows-[182px_340px] tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[182px_400px] desktopxl:grid-rows-[182px_200px]`}
        >
          <EditListHeader />
          <EditListUnits />
        </div>
      </div>
      <MobileMenuContextProvider>
        <TopContextMenuLoader listNumber={listNumber} opacity={90} editMode />
      </MobileMenuContextProvider>
    </ListContextProvider>
  );
}
