"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  ConfirmCancelMobileMenu,
  ConfirmCancelModal,
  IconSidebarButton,
  TopContextMenuButton,
} from "@/components";
import { useListContext } from "@/context/ListContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { deleteListAction } from "@/lib/actions/list-actions";
import paths from "@/lib/paths";

interface DeleteListButtonProps {
  mode: "desktop" | "mobile";
}

export default function DeleteListButton({ mode }: DeleteListButtonProps) {
  const { openMobileMenu } = useMobileMenu();

  const [showConfirmDeleteModal, setShowConfirmDeleteModel] = useState(false);
  const router = useRouter();
  const { listName, listNumber, listLanguage, userIsAuthor } = useListContext();
  if (!userIsAuthor) return null;

  const handleDeleteList = async () => {
    const response = await toast.promise(
      deleteListAction(listNumber, listLanguage.code),
      {
        loading: `Deleting ${listName}...`,
        success: (result) => result.message,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );
    if (response) router.push(paths.dashboardLanguagePath(listLanguage.code));
  };

  if (mode === "desktop")
    return (
      <>
        <IconSidebarButton
          mode="delete"
          onClick={() => {
            setShowConfirmDeleteModel(true);
          }}
        />
        <ConfirmCancelModal
          title="Careful! This will delete the entire list"
          isOpen={showConfirmDeleteModal}
          setIsOpen={setShowConfirmDeleteModel}
          closeButton={false}
          doOnConfirm={handleDeleteList}
        >
          <div>Are you sure you want to delete</div>
          <div>&quot;{listName}&quot;?</div>
        </ConfirmCancelModal>
      </>
    );

  if (mode === "mobile")
    return (
      <>
        <TopContextMenuButton
          mode="delete"
          onClick={() => {
            openMobileMenu(
              <ConfirmCancelMobileMenu doOnConfirm={handleDeleteList}>
                <div className="text-2xl">
                  Careful! This will delete the entire list!
                </div>
                <div className="mt-8 text-xl">
                  Are you sure you want to delete it?
                </div>
              </ConfirmCancelMobileMenu>
            );
          }}
        />
      </>
    );
}
