"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import DeleteListButton from "@/components/Lists/ListOverview/DeleteListButton";
import StopLearningListButton from "@/components/Lists/ListOverview/StopLearningListButton";
import { cn } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import TopContextMenuButton from "./TopContextMenuButton";

interface TopContextMenuProps {
  opacity?: 50 | 80 | 90;
  userIsAuthor: boolean;
  userIsLearningList: boolean;
}

export default function TopContextMenu({
  opacity,
  userIsAuthor,
  userIsLearningList,
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
      <div className="flex w-full flex-col gap-2 bg-white px-2 py-4">
        {unitNumber && (
          <>
            <TopContextMenuButton
              mode="back"
              link={paths.listDetailsPath(listNumber)}
              setContextExpanded={setContextExpanded}
            />
          </>
        )}
        {!unitNumber && (
          <>
            {userIsLearningList && <StopLearningListButton mode="mobile" />}
            {userIsAuthor && (
              <>
                <TopContextMenuButton
                  mode="edit"
                  link={paths.editListPath(listNumber)}
                  setContextExpanded={setContextExpanded}
                />
                <DeleteListButton mode="mobile" />
              </>
            )}
          </>
        )}
      </div>
    );
  }

  if (currentBaseUrl.includes("dictionary/")) {
    showTopContextMenu = true;
    displayTheseElements = <div>dictionary</div>;
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
        />
      </div>
      {contextExpanded && (
        <div
          className={cn(
            "absolute top-[112px] h-0 transition-all left-0 z-50 w-full",
            `bg-white/${opacity}`
          )}
        >
          {displayTheseElements}
        </div>
      )}
    </>
  );
}
