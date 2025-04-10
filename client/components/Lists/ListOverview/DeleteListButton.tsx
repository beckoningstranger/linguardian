"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import ConfirmCancelMobileMenu from "@/components/ConfirmCancelMobileMenu";
import ConfirmCancelModal from "@/components/ConfirmCancelModal";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenuButton";
import { useListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { removeList } from "@/lib/actions";
import paths from "@/lib/paths";

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
        <IconSidebarButton
          type="delete"
          onClick={() => {
            setShowConfirmDeleteModel(true);
          }}
        />
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
          onClick={() => {
            if (toggleMobileMenu) toggleMobileMenu();
          }}
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
