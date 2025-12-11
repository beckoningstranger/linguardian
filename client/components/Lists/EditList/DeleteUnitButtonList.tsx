"use client";

import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbTrash } from "react-icons/tb";

import ConfirmCancelMobileMenu from "@/components/Modals/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/Modals/ConfirmCancelModal";
import { useListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import { removeUnitFromList } from "@/lib/utils/removeUnit";

interface DeleteUnitButtonProps {
  unitName: string;
  noOfItemsInUnit: number;
}

export default function DeleteUnitButton({
  unitName,
  noOfItemsInUnit,
}: DeleteUnitButtonProps) {
  const {
    unitOrder: unitOrderState,
    setUnitOrder: updateUnitOrderState,
    listNumber,
    listLanguage,
  } = useListContext();

  const router = useRouter();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { openMobileMenu } = useMobileMenu();
  const [updating, setUpdating] = useState(false);

  const handleRemoveUnitFromList = async () => {
    let previousUnitOrder = unitOrderState;
    setUpdating(true);

    const response = await removeUnitFromList({
      listNumber,
      unitName,
      languageCode: listLanguage.code,
      onOptimisticUpdate: () =>
        updateUnitOrderState(unitOrderState.filter((u) => u !== unitName)),
      onRollback: () => updateUnitOrderState(previousUnitOrder),
    });

    if (response) {
      setUpdating(false);
      router.push(paths.editListPath(listNumber));
    }
  };

  const modalText = (
    <>
      <div>
        &quot;{unitName}&quot; contains {noOfItemsInUnit}
        {noOfItemsInUnit === 1 ? " item" : " items"}!
      </div>
      <div className="">Are you sure you want to delete it?</div>
    </>
  );

  const handleClickMobile = () => {
    if (noOfItemsInUnit > 0) {
      openMobileMenu(
        <ConfirmCancelMobileMenu doOnConfirm={handleRemoveUnitFromList}>
          {modalText}
        </ConfirmCancelMobileMenu>
      );
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

  return (
    <>
      {/* Only one of the buttons is rendered depending on viewport size */}
      <Button
        className="grid size-full place-items-center tablet:hidden"
        onClick={handleClickMobile}
        disabled={updating}
      >
        <TbTrash className="size-8" />
      </Button>
      <Button
        className="hidden size-full place-items-center tablet:grid"
        onClick={handleClickDesktop}
        disabled={updating}
      >
        <TbTrash className="size-8" />
      </Button>
      <ConfirmCancelModal
        title="Confirm unit deletion"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModal}
        closeButton={false}
        doOnConfirm={handleRemoveUnitFromList}
      >
        {modalText}
      </ConfirmCancelModal>
    </>
  );
}
