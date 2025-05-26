"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import DeleteListButton from "@/components/Lists/EditList/DeleteListButton";
import StopLearningListButton from "@/components/Lists/ListOverview/StopLearningListButton";
import { cn } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import TopContextMenuButton from "./TopContextMenuButton";
import DeleteUnitButton from "@/components/Lists/EditList/DeleteUnitButton";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";

interface TopContextMenuProps {
  opacity?: 50 | 80 | 90;
  userIsAuthor?: boolean;
  userIsLearningList?: boolean;
  editMode?: boolean;
  comingFrom?: string;
  itemSlug?: string;
}

export default function TopContextMenu({
  opacity,
  userIsAuthor,
  userIsLearningList,
  editMode,
  comingFrom,
  itemSlug,
}: TopContextMenuProps) {
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
    <>
      <div
        className={
          showTopContextMenu
            ? "tablet:hidden z-50 absolute top-[0px] h-[112px] left-1/2 -translate-x-1/2 justify-center flex flex-col"
            : "hidden"
        }
      >
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
        <div
          className={cn(
            "absolute top-[112px] h-0 transition-all left-0 z-50 w-full",
            `bg-white/${opacity}`
          )}
        >
          <div className="flex w-full flex-col gap-2 bg-white px-2 py-4">
            {displayTheseElements}
          </div>
        </div>
      )}
    </>
  );
}
