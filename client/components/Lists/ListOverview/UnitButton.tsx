"use client";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useOutsideClick } from "@/lib/hooks";
import { changeListDetails, removeUnitFromList } from "@/lib/actions";
import { Button } from "@headlessui/react";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";
import { useListContext } from "@/context/ListContext";

interface UnitButtonProps {
  learnedItemsPercentage: number;
  unitName: string;
  noOfItemsInUnit: number;
  unitOrder: string[];
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
}

export default function UnitButton({
  learnedItemsPercentage,
  unitName,
  noOfItemsInUnit,
  unitOrder,
  setUnitOrder,
}: UnitButtonProps) {
  const {
    listData: { listNumber },
    userIsAuthor,
  } = useListContext();
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

  const clampedLearnedItemsPercentage = Math.max(
    0,
    Math.min(100, learnedItemsPercentage)
  );
  const fillWidth = `${clampedLearnedItemsPercentage}%`;

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
      className={`relative flex h-[90px] w-full items-center justify-center rounded-lg text-center text-cmdb shadow-lg hover:shadow-2xl tablet:text-clgb`}
    >
      <div
        className={`absolute inset-0 z-0 rounded-lg bg-white/90`}
        // style={{
        //   width: fillWidth,
        // }}
      />
      <div
        className={`z-10 flex flex-col w-full rounded-lg ${
          userIsAuthor ? " cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (userIsAuthor) setEditMode(true);
          }}
        >
          {!editMode && <span className="cursor-pointer">{unitName}</span>}
          {editMode && (
            <form onSubmit={handleSubmit}>
              <label htmlFor={unitName} className="sr-only">
                {unitName} - Click to edit
              </label>
              <input
                type="text"
                id={unitName}
                value={updatedUnitName}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={(e) => {
                  setUpdatedUnitName(e.target.value);
                }}
              />
            </form>
          )}
        </div>
        {!editMode && (
          <div className="text-center text-csmr">
            ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
          </div>
        )}
        <div
          style={{
            width: fillWidth,
          }}
          className="absolute bottom-0 h-2 w-full rounded-b-lg bg-green-300"
        ></div>
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
            aria-label="Click to delete this unit"
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
            className="absolute right-0 hidden md:right-4 md:block"
            aria-label="Click to delete this unit"
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
