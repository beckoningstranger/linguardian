import {
  AddItemsToUnitButton,
  DeleteUnitButton,
  EditUnitHeader,
  IconSidebar,
  IconSidebarButton,
  TopContextMenu,
  TopContextMenuButton,
  UnitItems,
} from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { TopContextMenuContextProvider } from "@/context/TopContextMenuContext";
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
      <MobileMenuContextProvider>
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
                <DeleteUnitButton
                  listNumber={listNumber}
                  mode="desktop"
                  unitName={unitName}
                  listLanguageCode={listLanguage.code}
                  noOfItemsInUnit={unitItems.length}
                />
              </>
            )}
          </IconSidebar>
          <div className="flex flex-1 flex-col justify-center tablet:my-2 tablet:gap-2 tablet:pr-2">
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

          <TopContextMenuContextProvider>
            <TopContextMenu>
              <TopContextMenuButton
                target="unit"
                mode="back"
                link={paths.unitDetailsPath(listNumber, unitNumber)}
              />
              {userIsAuthor && (
                <>
                  <AddItemsToUnitButton mode="mobile" />
                  <DeleteUnitButton
                    listNumber={listNumber}
                    mode="mobile"
                    unitName={unitName}
                    listLanguageCode={listLanguage.code}
                    noOfItemsInUnit={unitItems.length}
                  />
                </>
              )}
            </TopContextMenu>
          </TopContextMenuContextProvider>
        </div>
      </MobileMenuContextProvider>
    </UnitContextProvider>
  );
}
