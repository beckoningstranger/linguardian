import AddItemsToUnitButton from "@/components/Lists/EditUnit/AddItemsToUnitButton";
import DeleteUnitButton from "@/components/Lists/EditUnit/DeleteUnitButton";
import EditUnitHeader from "@/components/Lists/EditUnit/EditUnitHeader";
import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenu from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenu";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenuButton";
import UnitItems from "@/components/Lists/UnitOverview/UnitItems";
import { UnitContextProvider } from "@/context/UnitContext";
import { fetchEditUnitPageData } from "@/lib/api/bff-api";
import paths from "@/lib/paths";
import { notFound, redirect } from "next/navigation";

interface UnitEditPageProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitEditPage({
  params: { listNumberString, unitNumberString },
}: UnitEditPageProps) {
  const listNumber = Number(listNumberString);
  const unitNumber = Number(unitNumberString);

  const response = await fetchEditUnitPageData({
    listNumber,
    unitNumber,
  });
  if (!response.success) notFound();

  const {
    userNativeCode,
    userIsAuthor,
    unitName,
    unitItems,
    itemsPlusLearningInfo,
    userIsLearningThisList,
    unitOrder,
    listName,
    listLanguage,
  } = response.data;

  if (!userIsAuthor) redirect(paths.unitDetailsPath(listNumber, unitNumber));

  return (
    <UnitContextProvider
      unitName={unitName}
      noOfItemsInUnit={unitItems.length}
      unitNumber={unitNumber}
      listName={listName}
      listNumber={listNumber}
      listLanguage={listLanguage}
      unitOrder={unitOrder}
    >
      <div className="pb-4 tablet:flex tablet:justify-center desktopxl:grid desktopxl:grid-cols-[100px_minmax(0,1600px)]">
        <IconSidebar position="left" showOn="tablet">
          <IconSidebarButton
            mode="back"
            label="Back to unit overview"
            link={paths.unitDetailsPath(listNumber, unitNumber)}
          />
          {userIsAuthor && (
            <>
              <AddItemsToUnitButton mode="desktop" />
              <DeleteUnitButton mode="desktop" />
            </>
          )}
        </IconSidebar>
        <div className="flex flex-1 flex-col tablet:my-2 tablet:gap-2 tablet:pr-2">
          <EditUnitHeader />
          <UnitItems
            itemsPlusLearningInfo={itemsPlusLearningInfo}
            userNative={userNativeCode}
            userIsLearningThisList={userIsLearningThisList}
            userIsAuthor={userIsAuthor}
            pathToUnit={paths.unitDetailsPath(listNumber, unitNumber)}
            editMode
          />
        </div>

        <TopContextMenu>
          <TopContextMenuButton
            target="unit"
            mode="back"
            link={paths.unitDetailsPath(listNumber, unitNumber)}
          />
          {userIsAuthor && (
            <>
              <AddItemsToUnitButton mode="mobile" />
              <DeleteUnitButton mode="mobile" />
            </>
          )}
        </TopContextMenu>
      </div>
    </UnitContextProvider>
  );
}
