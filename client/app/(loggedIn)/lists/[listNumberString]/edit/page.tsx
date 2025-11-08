import { notFound } from "next/navigation";

import {
  DeleteListButton,
  EditListHeader,
  IconSidebar,
  IconSidebarButton,
  ReorderableListUnits,
  TopContextMenu,
  TopContextMenuButton,
} from "@/components";
import ExpandListWithCSV from "@/components/Lists/EditList/ExpandListWithCSV";
import { ListContextProvider } from "@/context/ListContext";
import { fetchEditListPageData } from "@/lib/api/bff-api";
import paths from "@/lib/paths";

interface ListEditPageProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListEditPage({
  params: { listNumberString },
}: ListEditPageProps) {
  const listNumber = Number(listNumberString);
  if (!listNumber) notFound();

  const response = await fetchEditListPageData({ listNumber });
  if (!response.success) notFound();

  const {
    listName,
    listDescription,
    listLanguage,
    listImage,
    userIsAuthor,
    authorData,
    learnedItemIds,
    unitOrder,
    unitInformation,
  } = response.data;

  return (
    <ListContextProvider
      userIsAuthor={userIsAuthor}
      authorData={authorData}
      listNumber={listNumber}
      learnedItemIds={learnedItemIds}
      listDescription={listDescription}
      listName={listName}
      listLanguage={listLanguage}
      listImage={listImage}
      initialUnitOrder={unitOrder}
      unitInformation={unitInformation}
    >
      <div className="flex justify-center desktop:mb-0">
        <IconSidebar position="left" showOn="tablet">
          <IconSidebarButton
            mode="back"
            link={paths.listDetailsPath(listNumber)}
          />
          <ExpandListWithCSV mode="desktop" />
          <DeleteListButton mode="desktop" />
        </IconSidebar>
        <div
          className={`grid w-full grid-cols-1 tablet:my-2 tablet:w-auto tablet:grid-cols-[310px_310px] tablet:grid-rows-[182px_340px] tablet:gap-2 desktop:grid-cols-[400px_400px] desktop:grid-rows-[182px_400px] desktopxl:grid-rows-[182px_200px]`}
          id="listOverviewMain"
        >
          <EditListHeader />
          <ReorderableListUnits />
        </div>
        <div className="desktop:m-2 desktop:w-[90px]" />
      </div>

      <TopContextMenu>
        <TopContextMenuButton
          mode="back"
          target="list"
          link={paths.listDetailsPath(listNumber)}
        />
        <ExpandListWithCSV mode="mobile" />
        <DeleteListButton mode="mobile" />
      </TopContextMenu>
    </ListContextProvider>
  );
}
