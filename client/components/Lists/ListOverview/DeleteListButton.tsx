"use client";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { removeList } from "@/lib/actions";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

interface DeleteListButtonProps {
  listNumber: number;
  listLanguage: SupportedLanguage;
  listName: string;
}

export default function DeleteListButton({
  listNumber,
  listLanguage,
  listName,
}: DeleteListButtonProps) {
  const router = useRouter();
  const removeListAction = async () => {
    toast.promise(removeList(listNumber), {
      loading: `Deleting ${listName}...`,
      success: `${listName} has been deleted`,
      error: (err) => err.toString(),
    });
    router.push(paths.dashboardLanguagePath(listLanguage));
  };

  const { toggleMobileMenu } = useMobileMenuContext();
  if (!toggleMobileMenu) throw new Error("Could not use mobile menu");
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  return (
    <>
      <div
        className="md:hidden"
        onClick={(e) => {
          toggleMobileMenu();
        }}
      >
        <div className="absolute left-1/2 top-6 w-36 -translate-x-1/2 transform text-center text-[1rem] leading-tight md:hidden">
          <span>
            Delete <br /> List
          </span>
        </div>
      </div>
      <div
        className="absolute top-24 hidden md:left-0 md:block lg:left-12"
        onClick={(e) => {
          setShowConfirmDeleteModel(true);
        }}
      >
        <div className="ml-2 mt-2 grid h-16 w-16 place-items-center rounded-md border-2 border-slate-300 bg-slate-100 p-4 text-2xl text-red-500 hover:scale-105 hover:bg-slate-200 active:scale-95">
          <FaTrashCan />
        </div>
      </div>
      <ConfirmCancelMobileMenu doOnConfirm={removeListAction}>
        <div>Careful! This will delete the entire list!</div>
        <div className="mt-8">Are you sure you want to delete it?</div>
      </ConfirmCancelMobileMenu>
      <ConfirmCancelModal
        title="Careful! This will delete the entire list"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModel}
        closeButton={false}
        doOnConfirm={removeListAction}
      >
        <div>Are you sure you want to delete</div>
        <div>&quot;{listName}&quot;?</div>
      </ConfirmCancelModal>
    </>
  );
}