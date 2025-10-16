"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";

import Button from "@/components/ui/Button";

interface ConfirmCancelModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  closeButton?: boolean;
  doOnConfirm: Function;
  title?: string;
  message?: string;
}

export default function ConfirmCancelModal({
  isOpen,
  setIsOpen,
  closeButton = false,
  doOnConfirm,
  children,
  title,
}: ConfirmCancelModalProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed z-50 flex items-center justify-center tablet:inset-x-32 tablet:inset-y-56">
        {closeButton && (
          <Button
            className="absolute right-8 top-8"
            aria-label="Close this modal"
          >
            <XMarkIcon className="h-8 w-8" />
          </Button>
        )}
        <DialogPanel className="relative flex w-full max-w-[calc(100%-2rem)] flex-col gap-2 rounded-md border border-grey-500 bg-white px-4 py-8 shadow-lg">
          {title && (
            <DialogTitle className="text-center text-2xl font-bold">
              {title}
            </DialogTitle>
          )}
          <div className="flex flex-col gap-5 text-lg">
            <div className="relative rounded-md text-center text-lg font-semibold">
              {children}
            </div>
            <div className="flex w-full gap-5">
              <Button
                intent="secondary"
                rounded
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                aria-label="Cancel and close this modal"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                rounded
                intent="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  doOnConfirm();
                  setIsOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
