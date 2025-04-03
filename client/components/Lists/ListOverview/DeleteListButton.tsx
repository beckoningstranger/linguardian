"use client";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import Button from "@/components/ui/Button";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeList } from "@/lib/actions";
import paths from "@/lib/paths";
import { PopulatedList } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";

interface DeleteListButtonProps {
  listData: PopulatedList;
  userIsAuthor: boolean;
}

export default function DeleteListButton({
  listData: { listNumber, language, name },
  userIsAuthor,
}: DeleteListButtonProps) {
  const { toggleMobileMenu } = useMobileMenu();
  if (!toggleMobileMenu) throw new Error("Could not use mobile menu");
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const router = useRouter();
  if (!userIsAuthor) return null;

  const removeListAction = async () => {
    toast.promise(removeList(listNumber), {
      loading: `Deleting ${name}...`,
      success: `${name} has been deleted`,
      error: (err) => err.toString(),
    });
    router.push(paths.dashboardLanguagePath(language.code));
  };

  return (
    <>
      {/* Mobile */}
      <button
        className="relative flex h-20 w-full items-center rounded-lg bg-red-500 px-2 text-center text-clgb text-white hover:bg-red-600 tablet:hidden"
        onClick={() => {
          toggleMobileMenu();
        }}
      >
        <TbTrash className="h-16 w-16" />
        <div className="flex w-[calc(100%-144px)] justify-center">
          Delete this list{" "}
        </div>
      </button>
      {/* Desktop */}
      <Button
        intent="icon"
        color="white"
        noRing
        className="hidden shadow-xl tablet:block"
        onClick={() => {
          setShowConfirmDeleteModel(true);
        }}
      >
        {/* <TbTrash className="h-12 w-12 text-grey-800" />{" "} */}
        <Image
          src={"/icons/Trash.svg"}
          height={72}
          width={72}
          alt="Trash Icon to Delete"
        />
      </Button>
      <ConfirmCancelMobileMenu doOnConfirm={removeListAction}>
        <div className="text-2xl">
          Careful! This will delete the entire list!
        </div>
        <div className="mt-8 text-xl">Are you sure you want to delete it?</div>
      </ConfirmCancelMobileMenu>
      <ConfirmCancelModal
        title="Careful! This will delete the entire list"
        isOpen={showConfirmDeleteModal}
        setIsOpen={setShowConfirmDeleteModel}
        closeButton={false}
        doOnConfirm={removeListAction}
      >
        <div>Are you sure you want to delete</div>
        <div>&quot;{name}&quot;?</div>
      </ConfirmCancelModal>
    </>
  );
}
