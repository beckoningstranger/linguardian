"use client";

import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeItemFromList } from "@/lib/actions";
import { ListAndUnitData } from "@/lib/types";
import { Types } from "mongoose";
import { MouseEventHandler, useState } from "react";
import toast from "react-hot-toast";
import ConfirmCancelMobileMenu from "../../ConfirmCancelMobileMenu";
import ConfirmCancelModal from "../../ConfirmCancelModal";
import { TbTrash } from "react-icons/tb";
import { Button } from "@headlessui/react";

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
  const { toggleMobileMenu } = useMobileMenu();
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
      <Button
        className="absolute right-0 grid h-full w-[64px] place-items-center rounded-r-lg text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white md:hidden"
        onClick={(e) => {
          e.preventDefault();
          toggleMobileMenu() as MouseEventHandler;
        }}
      >
        <TbTrash className="size-8" />
      </Button>
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
      <Button
        className="absolute right-0 hidden h-full w-[64px] place-items-center rounded-r-lg text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white md:grid"
        onClick={async (e) => {
          e.preventDefault();
          setShowConfirmDeleteModel(true);
        }}
      >
        <TbTrash className="size-8" />
      </Button>
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
