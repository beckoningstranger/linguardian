"use client";

import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeUnitFromList } from "@/lib/actions";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";
import ConfirmCancelMobileMenu from "../ConfirmCancelMobileMenu";
import ConfirmCancelModal from "../ConfirmCancelModal";
import Button from "../ui/Button";
import { cn } from "@/lib/helperFunctionsClient";
import { redirect } from "next/navigation";
import paths from "@/lib/paths";

interface DeleteUnitButtonProps {
  setUnitOrder?: Dispatch<SetStateAction<string[]>>;
  unitName: string;
  listNumber: number;
  noOfItemsInUnit: number;
  mode?: "standalone" | "inCard";
}

export default function DeleteUnitButton({
  setUnitOrder,
  unitName,
  listNumber,
  noOfItemsInUnit,
  mode,
}: DeleteUnitButtonProps) {
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();

  const removeUnitFromListAction = () =>
    toast.promise(removeUnitFromList(unitName, listNumber), {
      loading: "Removing this unit...",
      success: () => {
        if (setUnitOrder) {
          setUnitOrder((prevUnitOrder) =>
            prevUnitOrder.filter((name) => name !== unitName)
          );
        } else {
          redirect(paths.listDetailsPath(listNumber));
        }
        return "Unit removed! ✅";
      },
      error: (err) => err.toString(),
    });

  return (
    <div
      className={cn(
        mode === "standalone" &&
          "bg-white/90 w-[72px] h-[72px] grid place-items-center rounded-lg hover:bg-white"
      )}
    >
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
        className="grid h-full w-12 place-items-center text-grey-800 hover:text-red-500 tablet:hidden"
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
        className="hidden h-full w-16 place-items-center text-grey-800 hover:text-red-500 tablet:grid"
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
    </div>
  );
}
