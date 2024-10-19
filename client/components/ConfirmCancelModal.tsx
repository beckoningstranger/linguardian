import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";
import Button from "./ui/Button";

interface ConfirmCancelModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  closeButton?: boolean;
  doOnConfirm: Function;
  title: string;
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
      <div className="fixed z-50 flex items-center justify-center md:inset-x-32 md:inset-y-56">
        {closeButton && (
          <Button
            className="absolute right-8 top-8"
            aria-label="Close this modal"
          >
            <XMarkIcon className="h-8 w-8" />
          </Button>
        )}
        <DialogPanel className="relative flex w-full max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-md border bg-white p-4">
          <DialogTitle className="mb-4 text-center text-2xl font-bold">
            {title}
          </DialogTitle>
          <div className="flex flex-col gap-5 text-lg">
            <div className="relative mx-12 rounded-md text-center text-lg font-semibold">
              {children}
            </div>
            <div className="flex w-full gap-5">
              <Button
                intent="secondary"
                className="flex-1 p-3 px-5"
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
