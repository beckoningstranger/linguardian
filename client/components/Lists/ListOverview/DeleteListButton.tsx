"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { TbTrash } from "react-icons/tb";

import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import { useListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeList } from "@/lib/actions";
import paths from "@/lib/paths";
import { Button } from "@headlessui/react";
import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenuButton";

interface DeleteListButtonProps {
  mode: "desktop" | "mobile";
}

export default function DeleteListButton({ mode }: DeleteListButtonProps) {
  const { toggleMobileMenu } = useMobileMenu();
  if (!toggleMobileMenu) throw new Error("Could not use mobile menu");
  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const router = useRouter();
  const {
    listData: { listNumber, language, name },
    userIsAuthor,
  } = useListContext();
  if (!userIsAuthor) return null;

  const removeListAction = async () => {
    toast.promise(removeList(listNumber), {
      loading: `Deleting ${name}...`,
      success: `${name} has been deleted`,
      error: (err) => err.toString(),
    });
    router.push(paths.dashboardLanguagePath(language.code));
  };

  if (mode === "desktop")
    return (
      <>
        <Button
          className="duration-800 group flex size-[72px] items-center justify-center rounded-lg bg-white/90 text-grey-800 shadow-xl transition-all ease-in-out hover:w-[300px] hover:bg-red-500 hover:px-4 hover:text-white"
          onClick={() => {
            setShowConfirmDeleteModel(true);
          }}
        >
          <TbTrash className="h-12 w-12" />

          <div className="hidden w-full justify-center rounded-lg font-serif text-hmd group-hover:flex">
            Delete this list
          </div>
        </Button>
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

  if (mode === "mobile")
    return (
      <>
        <TopContextMenuButton
          label="Delete this list"
          onClick={() => {
            if (toggleMobileMenu) toggleMobileMenu();
          }}
          icon={<TbTrash className="h-16 w-16" />}
          mode="delete"
        />
        <ConfirmCancelMobileMenu doOnConfirm={removeListAction}>
          <div className="text-2xl">
            Careful! This will delete the entire list!
          </div>
          <div className="mt-8 text-xl">
            Are you sure you want to delete it?
          </div>
        </ConfirmCancelMobileMenu>
      </>
    );
}
