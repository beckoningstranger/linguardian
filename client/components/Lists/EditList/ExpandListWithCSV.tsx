"use client";

import { RefObject, useState } from "react";

import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenuButton";
import ExpandListWithCsvForm from "@/components/Forms/ExpandListForm";
import { useListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface ExpandListWithCSVButtonProps {
  mode: "desktop" | "mobile";
}

export default function ExpandListWithCSVButton({
  mode,
}: ExpandListWithCSVButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const ref = useOutsideClick(() => setShowModal(false));
  const { openMobileMenu } = useMobileMenu();
  const { listNumber, listLanguage, userIsAuthor } = useListContext();
  if (!userIsAuthor) return null;

  if (mode === "desktop")
    return (
      <>
        <IconSidebarButton
          mode="uploadCSV"
          onClick={() => {
            setShowModal(true);
          }}
        />
        {showModal && (
          <div
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center rounded-md bg-white/90"
            ref={ref as RefObject<HTMLDivElement>}
          >
            <ExpandListWithCsvForm
              listNumber={listNumber}
              listLanguageCode={listLanguage.code}
            />
          </div>
        )}
      </>
    );

  if (mode === "mobile")
    return (
      <>
        <TopContextMenuButton
          mode="uploadCSV"
          onClick={(e) => {
            e.stopPropagation();
            openMobileMenu(
              <ExpandListWithCsvForm
                listNumber={listNumber}
                listLanguageCode={listLanguage.code}
              />
            );
          }}
        />
      </>
    );
}
