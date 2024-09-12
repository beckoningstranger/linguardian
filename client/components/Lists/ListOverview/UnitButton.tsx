"use client";

import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import MobileMenu from "@/components/Menus/MobileMenu/MobileMenu";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { removeUnitFromList } from "@/lib/actions";
import { Button } from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

interface UnitButtonProps {
  percentage: number;
  userIsAuthor: boolean;
  unitName: string;
  listNumber: number;
  noOfItemsInUnit: number;
}

export default function UnitButton({
  percentage,
  userIsAuthor,
  unitName,
  listNumber,
  noOfItemsInUnit,
}: UnitButtonProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const fillWidth = `${clampedPercentage}%`;

  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const { toggleMobileMenu } = useMobileMenuContext();

  const doOnConfirm = () =>
    toast.promise(removeUnitFromList(unitName, listNumber), {
      loading: "Removing this unit...",
      success: () => "Unit removed! ✅",
      error: (err) => err.toString(),
    });

  return (
    <div
      className={`relative flex h-14 w-11/12 items-center justify-center rounded-lg border border-slate-800 py-2 text-center shadow-lg hover:shadow-2xl`}
    >
      <div
        className={`absolute inset-0 z-0 rounded-lg bg-green-300`}
        style={{
          width: fillWidth,
        }}
      />
      <div className={`relative z-10 flex items-baseline rounded-lg px-4 py-2`}>
        <span className="text-md">{unitName}</span>
        <span className="ml-2 text-xs">
          ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
        </span>
      </div>
      {userIsAuthor && (
        <>
          {/* // Mobile screens */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (noOfItemsInUnit > 0) {
                if (toggleMobileMenu) toggleMobileMenu();
              } else {
                doOnConfirm();
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 transform p-4 md:hidden"
          >
            <FaTrashCan className="text-red-500" />
          </Button>
          <MobileMenu mode="fullscreen" fromDirection="animate-from-top">
            <div className="relative mx-12 rounded-md text-center text-3xl font-bold">
              <div>
                This unit contains {noOfItemsInUnit}{" "}
                {noOfItemsInUnit === 1 ? "item" : "items"}!
              </div>
              <div className="mt-8">Are you sure you want to delete it?</div>
            </div>
            <div className="absolute bottom-24 mx-12 mt-32 flex w-full justify-evenly">
              <button
                className="rounded-md bg-red-500 px-6 py-3 text-xl text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (toggleMobileMenu) toggleMobileMenu();
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-green-400 px-6 py-3 text-xl text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  doOnConfirm();
                  if (toggleMobileMenu) toggleMobileMenu();
                }}
              >
                Confirm
              </button>
            </div>
          </MobileMenu>

          {/* Bigger screens */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (noOfItemsInUnit > 0) {
                setShowConfirmDeleteModel(true);
              } else {
                doOnConfirm();
              }
            }}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform p-4 md:right-4 md:block"
          >
            <FaTrashCan className="text-red-500" />
          </Button>
          <ConfirmCancelModal
            title="Confirm unit deletion"
            prompt={
              <div className="relative mx-12 rounded-md text-center text-xl font-semibold">
                <div>
                  This unit contains {noOfItemsInUnit}{" "}
                  {noOfItemsInUnit === 1 ? "item" : "items"}!
                </div>
                <div className="mt-2">Are you sure you want to delete it?</div>
              </div>
            }
            isOpen={showConfirmDeleteModal}
            setIsOpen={setShowConfirmDeleteModel}
            closeButton={false}
            doOnConfirm={doOnConfirm}
          />
        </>
      )}
    </div>
  );
}
