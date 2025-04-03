"use client";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import Button from "@/components/ui/Button";
import { useListContext } from "@/context/ListContext";
import {
  MobileMenuContextProvider,
  useMobileMenu,
} from "@/context/MobileMenuContext";
import { removeList } from "@/lib/actions";
import paths from "@/lib/paths";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

interface DeleteListButtonProps {}

export default function DeleteListButton({}: DeleteListButtonProps) {
  const {
    listData: { listNumber, language, name },
    userIsAuthor,
  } = useListContext();
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
      <div
        className="tablet:hidden"
        onClick={() => {
          toggleMobileMenu();
        }}
      >
        <div className="w-36 text-center tablet:hidden">
          <span>
            Delete <br /> List
          </span>
        </div>
      </div>
      {/* Desktop */}
      <Button
        intent="icon"
        color="white"
        noRing
        className="shadow-xl"
        onClick={(e) => {
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
