"use client";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { changeListDetails, removeUnitFromList } from "@/lib/actions";
import { Button } from "@headlessui/react";
import { FormEvent, RefObject, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

interface UnitButtonProps {
  percentage: number;
  userIsAuthor: boolean;
  unitName: string;
  listNumber: number;
  noOfItemsInUnit: number;
  unitOrder: string[];
}

export default function UnitButton({
  percentage,
  userIsAuthor,
  unitName,
  listNumber,
  noOfItemsInUnit,
  unitOrder,
}: UnitButtonProps) {
  const [editMode, setEditMode] = useState(false);
  const [updatedUnitName, setUpdatedUnitName] = useState(unitName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    editUnitNameAction();
  };

  const inputRef = useOutsideClick(() => {
    setEditMode(false);
    if (updatedUnitName !== unitName) editUnitNameAction();
  });

  useEffect(() => {
    if (editMode && inputRef) inputRef.current?.focus();
  }, [inputRef, editMode]);

  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const fillWidth = `${clampedPercentage}%`;

  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const { toggleMobileMenu } = useMobileMenuContext();

  const removeUnitFromListAction = () =>
    toast.promise(removeUnitFromList(unitName, listNumber), {
      loading: "Removing this unit...",
      success: () => "Unit removed! ✅",
      error: (err) => err.toString(),
    });

  const editUnitNameAction = () => {
    let newUnitOrder = unitOrder.reduce((a, curr) => {
      if (curr === unitName) {
        a.push(updatedUnitName);
      } else {
        a.push(curr);
      }
      return a;
    }, [] as string[]);

    if (newUnitOrder !== unitOrder && userIsAuthor)
      toast.promise(
        changeListDetails({ listNumber: listNumber, unitOrder: newUnitOrder }),
        {
          loading: "Changing unit name...",
          success: () => "Unit name updated! ✅",
          error: (err) => err.toString(),
        }
      );
  };

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
        <span
          className="text-md py-2 pl-4 pr-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (userIsAuthor) setEditMode(true);
          }}
        >
          {!editMode && <span>{unitName}</span>}
          {editMode && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={updatedUnitName}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={(e) => {
                  setUpdatedUnitName(e.target.value);
                }}
              />
            </form>
          )}
        </span>
        {!editMode && (
          <span className="ml-2 text-xs">
            ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
          </span>
        )}
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
                removeUnitFromListAction();
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 transform p-4 md:hidden"
          >
            <FaTrashCan className="text-red-500" />
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
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform p-4 md:right-4 md:block"
          >
            <FaTrashCan className="text-red-500" />
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
      )}
    </div>
  );
}
