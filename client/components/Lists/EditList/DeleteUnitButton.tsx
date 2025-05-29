"use client";

import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";

import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeUnitFromList } from "@/lib/actions";
import paths from "@/lib/paths";
import ConfirmCancelMobileMenu from "../../ConfirmCancelMobileMenu";
import ConfirmCancelModal from "../../ConfirmCancelModal";
import IconSidebarButton from "../../IconSidebar/IconSidebarButton";
import TopContextMenuButton from "../../Menus/TopMenu/TopContextMenuButton";
import { useUnitContext } from "@/context/UnitContext";

interface DeleteUnitButtonProps {
  setUnitOrder?: Dispatch<SetStateAction<string[]>>;
  listNumber: number;
  mode?: "desktop" | "mobile" | "inCard";
  unitName?: string;
  noOfItemsInUnit?: number;
}

export default function DeleteUnitButton({
  setUnitOrder,
  listNumber,
  mode,
  unitName: passedUnitName,
  noOfItemsInUnit: passedNoOfItemsInUnit,
}: DeleteUnitButtonProps) {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();
  const [updating, setUpdating] = useState(false);

  const context = useUnitContext();
  const unitName = passedUnitName ?? context.unitName;
  const noOfItemsInUnit =
    passedNoOfItemsInUnit !== undefined
      ? passedNoOfItemsInUnit
      : context.noOfItemsInUnit;

  const removeUnitFromListAction = () => {
    setUpdating(true);
    toast.promise(removeUnitFromList(unitName, listNumber), {
      loading: "Removing this unit...",
      success: () => {
        if (setUnitOrder) {
          setUnitOrder((prevUnitOrder) =>
            prevUnitOrder.filter((name) => name !== unitName)
          );
        } else {
          redirect(paths.editListPath(listNumber));
        }
        return "Unit removed! ✅";
      },
      error: (err) => err.toString(),
    });
    setUpdating(false);
  };

  const handleClickMobile = () => {
    if (noOfItemsInUnit > 0) {
      if (toggleMobileMenu) toggleMobileMenu();
    } else {
      removeUnitFromListAction();
    }
  };

  const handleClickDesktop = () => {
    setShowConfirmDeleteModal(true);
    // if (noOfItemsInUnit > 0) {
    //   setShowConfirmDeleteModal(true);
    // } else {
    //   removeUnitFromListAction();
    // }
  };

  let button;

  if (mode === "inCard")
    button = (
      <button
        className="grid size-full place-items-center"
        onClick={handleClickDesktop}
        disabled={updating}
      >
        <TbTrash className="z-50 size-8" />
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
        doOnConfirm={removeUnitFromListAction}
      >
        {modalText}
      </ConfirmCancelModal>
      <ConfirmCancelMobileMenu doOnConfirm={removeUnitFromListAction}>
        {modalText}
      </ConfirmCancelMobileMenu>
    </>
  );
}
