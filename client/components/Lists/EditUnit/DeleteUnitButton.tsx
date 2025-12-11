"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ConfirmCancelMobileMenu from "@/components/Modals/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/Modals/ConfirmCancelModal";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenuButton";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUnitContext } from "@/context/UnitContext";
import paths from "@/lib/paths";
import { removeUnitFromList } from "@/lib/utils/removeUnit";

interface DeleteUnitButtonProps {
  mode: "desktop" | "mobile";
}

export default function DeleteUnitButton({ mode }: DeleteUnitButtonProps) {
  const router = useRouter();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { openMobileMenu } = useMobileMenu();
  const [updating, setUpdating] = useState(false);
  const { noOfItemsInUnit, unitName, listNumber, listLanguage } =
    useUnitContext();

  const handleRemoveUnitFromList = async () => {
    setUpdating(true);

    const response = await removeUnitFromList({
      listNumber,
      unitName,
      languageCode: listLanguage.code,
    });

    if (response) {
      setUpdating(false);
      router.push(paths.editListPath(listNumber));
    }
  };

  const handleClickMobile = () => {
    if (noOfItemsInUnit > 0) {
      openMobileMenu(
        <ConfirmCancelMobileMenu doOnConfirm={handleRemoveUnitFromList}>
          {modalText}
        </ConfirmCancelMobileMenu>
      );
    } else {
      handleRemoveUnitFromList();
    }
  };

  const handleClickDesktop = () => {
    if (noOfItemsInUnit > 0) {
      setShowConfirmDeleteModal(true);
    } else {
      handleRemoveUnitFromList();
    }
  };

  let button;

  if (mode === "desktop")
    button = (
      <IconSidebarButton
        mode="delete"
        label="Delete this unit"
        disabled={updating}
        onClick={handleClickDesktop}
      />
    );

  if (mode === "mobile")
    button = (
      <TopContextMenuButton
        onClick={handleClickMobile}
        mode="delete"
        target="unit"
      />
    );

  const modalText = (
    <>
      <div>
        &quot;{unitName}&quot; contains {noOfItemsInUnit}
        {noOfItemsInUnit === 1 ? " item" : " items"}!
      </div>
      <div className="">Are you sure you want to delete it?</div>
    </>
  );

  return (
    <>
      {button}
      <ConfirmCancelModal
        title="Confirm unit deletion"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModal}
        closeButton={false}
        doOnConfirm={handleRemoveUnitFromList}
      >
        {modalText}
      </ConfirmCancelModal>
    </>
  );
}
