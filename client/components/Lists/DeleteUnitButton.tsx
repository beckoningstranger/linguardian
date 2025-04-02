"use client";

import { TbTrash } from "react-icons/tb";
import ConfirmCancelMobileMenu from "../ConfirmCancelMobileMenu";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { removeUnitFromList } from "@/lib/actions";
import Button from "../ui/Button";
import ConfirmCancelModal from "../ConfirmCancelModal";
import Image from "next/image";

interface DeleteListButtonProps {
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
  unitName: string;
  listNumber: number;
  noOfItemsInUnit: number;
}

export default function DeleteUnitButton({
  setUnitOrder,
  unitName,
  listNumber,
  noOfItemsInUnit,
}: DeleteListButtonProps) {
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();

  const removeUnitFromListAction = () =>
    toast.promise(removeUnitFromList(unitName, listNumber), {
      loading: "Removing this unit...",
      success: () => {
        setUnitOrder((prevUnitOrder) =>
          prevUnitOrder.filter((name) => name !== unitName)
        );
        return "Unit removed! ✅";
      },
      error: (err) => err.toString(),
    });

  return (
    <>
      {/* // Mobile screens */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          if (noOfItemsInUnit > 0) {
            if (toggleMobileMenu) toggleMobileMenu();
          } else {
            removeUnitFromListAction();
          }
        }}
        className="grid h-full w-12 place-items-center text-grey-700 hover:text-red-500 tablet:hidden"
        aria-label="Click to delete this unit"
        noRing
      >
        <TbTrash className="h-8 w-8" />
      </Button>
      <ConfirmCancelMobileMenu doOnConfirm={removeUnitFromListAction}>
        <div>
          This unit contains {noOfItemsInUnit}{" "}
          {noOfItemsInUnit === 1 ? "item" : "items"}!
        </div>
        <div className="mt-8">Are you sure you want to delete it?</div>
      </ConfirmCancelMobileMenu>

      {/* Bigger screens */}
      <Button
        onClick={(e) => {
          e.preventDefault();
          if (noOfItemsInUnit > 0) {
            setShowConfirmDeleteModel(true);
          } else {
            removeUnitFromListAction();
          }
        }}
        className="hidden h-full w-16 place-items-center text-grey-700 hover:text-red-500 tablet:grid"
        aria-label="Click to delete this unit"
        noRing
      >
        <TbTrash className="h-10 w-10" />
      </Button>
      <ConfirmCancelModal
        title="Confirm unit deletion"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModel}
        closeButton={false}
        doOnConfirm={removeUnitFromListAction}
      >
        <div>
          This unit contains {noOfItemsInUnit}{" "}
          {noOfItemsInUnit === 1 ? "item" : "items"}!
        </div>
        <div className="mt-2">Are you sure you want to delete it?</div>
      </ConfirmCancelModal>
    </>
  );
}
