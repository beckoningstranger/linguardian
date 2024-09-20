"use client";

import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { removeItemFromList } from "@/lib/actions";
import { ListAndUnitData } from "@/lib/types";
import { Types } from "mongoose";
import { MouseEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";
import ConfirmCancelMobileMenu from "../ConfirmCancelMobileMenu";
import ConfirmCancelModal from "../ConfirmCancelModal";

interface DeleteItemButtonProps {
  listAndUnitData: ListAndUnitData;
  itemId: Types.ObjectId;
  listName: string;
  itemName: string;
}

export default function DeleteItemButton({
  listAndUnitData,
  itemId,
  itemName,
  listName,
}: DeleteItemButtonProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  if (!toggleMobileMenu) throw new Error("Could not use mobile menu");
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);

  const deleteItemAction = () => {
    toast.promise(removeItemFromList(listAndUnitData, itemId), {
      loading: "Deleting the item...",
      success: () => "Item deleted! 🎉",
      error: (err) => err.toString(),
    });
  };

  return (
    <>
      {/* Mobile */}
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 transform p-3 text-2xl hover:text-red-500 md:hidden"
        onClick={(e) => {
          e.preventDefault();
          toggleMobileMenu() as MouseEventHandler;
        }}
      >
        <FaTrashCan />
      </button>
      <ConfirmCancelMobileMenu doOnConfirm={deleteItemAction}>
        <div className="text-2xl">Confirm to delete item from list</div>
        <div className="mt-8 text-xl">
          <div>
            Are you sure you want to delete &quot;{itemName}&quot; from{" "}
            {listName}?
          </div>
        </div>
      </ConfirmCancelMobileMenu>

      {/* Desktop */}
      <button
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 transform p-3 text-2xl hover:text-red-500 md:block"
        onClick={async (e) => {
          e.preventDefault();
          setShowConfirmDeleteModel(true);
        }}
      >
        <FaTrashCan />
      </button>
      <ConfirmCancelModal
        title="Confirm to delete item from list"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModel}
        closeButton={false}
        doOnConfirm={deleteItemAction}
      >
        <div>Are you sure you want to delete</div>
        <div>
          <span>&quot;{itemName}&quot;</span>
          <span> from {listName}?</span>
        </div>
      </ConfirmCancelModal>
    </>
  );
}
