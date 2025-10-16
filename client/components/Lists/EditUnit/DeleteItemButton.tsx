"use client";

import { ConfirmCancelMobileMenu, ConfirmCancelModal } from "@/components";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUnitContext } from "@/context/UnitContext";
import { deleteItemFromListAction } from "@/lib/actions/list-actions";

import { Button } from "@headlessui/react";
import { MouseEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";

interface DeleteItemButtonProps {
  itemId: string;
  itemName: string;
}

export default function DeleteItemButton({
  itemId,
  itemName,
}: DeleteItemButtonProps) {
  const { toggleMobileMenu } = useMobileMenu();
  const { listNumber, listLanguage, listName } = useUnitContext();
  if (!toggleMobileMenu) throw new Error("Could not use mobile menu");
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);

  const handleDeleteItemFromList = () => {
    toast.promise(
      deleteItemFromListAction(listNumber, itemId, listLanguage.code),
      {
        loading: "Deleting the item...",
        success: (res) => res.message,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );
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
      <ConfirmCancelMobileMenu doOnConfirm={handleDeleteItemFromList}>
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
        doOnConfirm={handleDeleteItemFromList}
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
