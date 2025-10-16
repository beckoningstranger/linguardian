"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";

import {
  ConfirmCancelMobileMenu,
  ConfirmCancelModal,
  IconSidebarButton,
  TopContextMenuButton,
} from "@/components";
import { useOptionalListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { deleteUnitAction } from "@/lib/actions/list-actions";
import { SupportedLanguage } from "@/lib/contracts";
import paths from "@/lib/paths";

interface DeleteUnitButtonProps {
  listNumber: number;
  mode: "desktop" | "mobile" | "inCard";
  unitName: string;
  listLanguageCode: SupportedLanguage;
  noOfItemsInUnit: number;
}

export default function DeleteUnitButton({
  listNumber,
  mode,
  unitName,
  listLanguageCode,
  noOfItemsInUnit,
}: DeleteUnitButtonProps) {
  let unitOrderState: string[];
  let updateUnitOrderState: Dispatch<SetStateAction<string[]>>;

  const listContext = useOptionalListContext();

  if (listContext) {
    unitOrderState = listContext.unitOrder;
    updateUnitOrderState = listContext.setUnitOrder;
  }

  if (
    noOfItemsInUnit === undefined ||
    unitName === undefined ||
    listLanguageCode === undefined
  )
    throw new Error(`Something went wrong in DeleteUnitButton`);

  const router = useRouter();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();
  const [updating, setUpdating] = useState(false);

  const handleRemoveUnitFromList = async () => {
    let previousUnitOrder = unitOrderState;
    setUpdating(true);
    if (listContext) {
      const newUnitOrder = unitOrderState.filter(
        (unit) => !(unit === unitName)
      );
      updateUnitOrderState(newUnitOrder);
    }

    const response = await toast.promise(
      deleteUnitAction(listNumber, unitName, listLanguageCode),
      {
        loading: "Removing this unit...",
        success: (response) => response.message,
        error: (err) => {
          // set unit order state back if possible
          if (listContext) updateUnitOrderState(previousUnitOrder);
          return err instanceof Error ? err.message : err.toString();
        },
      }
    );
    if (response) {
      setUpdating(false);
      router.push(paths.editListPath(listNumber));
    }
  };

  const handleClickMobile = () => {
    if (noOfItemsInUnit > 0 && toggleMobileMenu) {
      toggleMobileMenu();
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

  if (mode === "inCard")
    button = (
      <button
        className="grid size-full place-items-center"
        onClick={handleClickDesktop}
        disabled={updating}
      >
        <TbTrash className="z-30 size-8" />
      </button>
    );

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
      <ConfirmCancelMobileMenu doOnConfirm={handleRemoveUnitFromList}>
        {modalText}
      </ConfirmCancelMobileMenu>
    </>
  );
}
