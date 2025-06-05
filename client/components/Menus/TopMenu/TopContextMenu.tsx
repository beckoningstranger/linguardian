"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";

import DeleteListButton from "@/components/Lists/EditList/DeleteListButton";
import DeleteUnitButton from "@/components/Lists/EditList/DeleteUnitButton";
import StopLearningListButton from "@/components/Lists/ListOverview/StopLearningListButton";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import paths from "@/lib/paths";
import TopContextMenuButton from "./TopContextMenuButton";

interface TopContextMenuProps {
  userIsAuthor?: boolean;
  userIsLearningList?: boolean;
  editMode?: boolean;
  comingFrom?: string;
  itemSlug?: string;
}

export default function TopContextMenu({
  userIsAuthor,
  userIsLearningList,
  editMode,
  comingFrom,
  itemSlug,
}: TopContextMenuProps) {
  const ref = useOutsideClick(() => setContextExpanded(false));
  const currentBaseUrl = usePathname();
  let showTopContextMenu: boolean = false;
  const [contextExpanded, setContextExpanded] = useState(false);

  let displayTheseElements = <></>;

  if (currentBaseUrl.includes("lists/")) {
    showTopContextMenu = true;
    const urlSegments = currentBaseUrl.split("/");
    const listNumber = Number(urlSegments[2]);
    const unitNumber = Number(urlSegments[3]) || false;

    if (!userIsAuthor && !userIsLearningList && !unitNumber) return null;

    displayTheseElements = (
      <>
        {unitNumber && (
          <>
            {editMode && (
              <>
                <TopContextMenuButton
                  mode="back"
                  target="unit"
                  link={paths.unitDetailsPath(listNumber, unitNumber)}
                  setContextExpanded={setContextExpanded}
                />
                <MobileMenuContextProvider>
                  <DeleteUnitButton listNumber={listNumber} mode="mobile" />
                </MobileMenuContextProvider>
              </>
            )}
            {!editMode && (
              <>
                <TopContextMenuButton
                  mode="back"
                  link={paths.listDetailsPath(listNumber)}
                  setContextExpanded={setContextExpanded}
                />
                <TopContextMenuButton
                  mode="edit"
                  target="unit"
                  setContextExpanded={setContextExpanded}
                  link={paths.editUnitPath(listNumber, unitNumber)}
                />
              </>
            )}
          </>
        )}
        {!unitNumber && (
          <>
            {!editMode && userIsLearningList && (
              <StopLearningListButton mode="mobile" />
            )}
            {userIsAuthor && (
              <>
                {!editMode && (
                  <TopContextMenuButton
                    mode="edit"
                    link={paths.editListPath(listNumber)}
                    setContextExpanded={setContextExpanded}
                  />
                )}
                {editMode && (
                  <>
                    <TopContextMenuButton
                      mode="back"
                      target="list"
                      link={paths.listDetailsPath(listNumber)}
                    />
                    <DeleteListButton mode="mobile" />
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  }

  if (currentBaseUrl.includes("dictionary/") && itemSlug) {
    showTopContextMenu = true;
    displayTheseElements = (
      <>
        <TopContextMenuButton
          mode="back"
          target="item"
          link={comingFrom || paths.dictionaryPath()}
        />
        <TopContextMenuButton
          mode="edit"
          target="item"
          link={paths.editDictionaryItemPath(itemSlug)}
        />
      </>
    );
  }

  return (
    <div
      id="TopContextMenu"
      ref={ref as RefObject<HTMLDivElement>}
      className={showTopContextMenu ? "tablet:hidden" : "hidden"}
    >
      <div className="fixed inset-x-64 top-0 z-10 grid h-[112px] place-items-center">
        <Image
          alt="Context Menu"
          height={90}
          width={90}
          src={"/icons/Context.svg"}
          onClick={() => setContextExpanded((prev) => !prev)}
          priority
        />
      </div>
      {contextExpanded && (
        <div className="fixed inset-x-0 top-[112px] grid w-full gap-2 px-2 py-4 backdrop-blur transition-all">
          {displayTheseElements}
        </div>
      )}
    </div>
  );
}
