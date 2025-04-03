"use client";

import DeleteListButton from "@/components/Lists/ListOverview/DeleteListButton";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { cn } from "@/lib/helperFunctionsClient";
import { PopulatedList } from "@/lib/types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import TopContextMenuButton from "./TopContextMenuButton";

interface TopContextMenuProps {
  opacity?: 50 | 80 | 90;
  listData?: PopulatedList;
  userIsAuthor: boolean;
}

// TODO: Add Stop Learning List button!

export default function TopContextMenu({
  opacity,
  listData,
  userIsAuthor,
}: TopContextMenuProps) {
  const currentBaseUrl = usePathname();
  let showTopContextMenu: boolean = false;
  const [contextExpanded, setContextExpanded] = useState(false);
  let displayTheseElements = <></>;

  if (currentBaseUrl.includes("lists/")) {
    showTopContextMenu = true;
    const urlSegments = currentBaseUrl.split("/");
    const listNumber = urlSegments[2];
    const unitNumber = urlSegments[3];
    displayTheseElements = (
      <>
        {unitNumber && (
          <TopContextMenuButton
            label="Back To List Overview"
            href={"/lists/" + listNumber}
          />
        )}
        <MobileMenuContextProvider>
          {listData && (
            <DeleteListButton listData={listData} userIsAuthor={userIsAuthor} />
          )}
        </MobileMenuContextProvider>
      </>
    );
  }

  if (currentBaseUrl.includes("dictionary/")) {
    showTopContextMenu = true;
    displayTheseElements = <>dictionary</>;
  }

  return (
    <div
      className={showTopContextMenu ? "tablet:hidden flex flex-col" : "hidden"}
    >
      <Image
        alt="Context Menu"
        height={90}
        width={90}
        src={"/icons/Context.svg"}
        onClick={() => setContextExpanded((prev) => !prev)}
      />
      {contextExpanded && (
        <div
          className={cn(
            "absolute top-[112px] left-0 z-50 w-screen flex flex-col px-2 py-4 gap-2",
            `bg-white/${opacity}`
          )}
        >
          {displayTheseElements}
        </div>
      )}
    </div>
  );
}
