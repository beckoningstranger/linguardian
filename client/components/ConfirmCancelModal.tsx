import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";

interface ConfirmCancelModalProps {
  prompt: JSX.Element;
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
  prompt,
  title,
}: ConfirmCancelModalProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed z-50 flex items-center justify-center md:inset-x-32 md:inset-y-56">
        {closeButton && (
          <Button className="absolute right-8 top-8">
            <XMarkIcon className="h-8 w-8" />
          </Button>
        )}
        <DialogPanel className="relative flex h-full max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-md border bg-white p-8">
          <DialogTitle className="mb-4 text-center text-2xl font-bold">
            {title}
          </DialogTitle>
          <div className="grid gap-2 text-lg">{prompt}</div>
          <div className="absolute bottom-6 flex w-full max-w-[calc(100%-2rem)] justify-evenly">
            <button
              className="rounded-md bg-red-500 px-8 py-3 text-lg text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-green-400 px-8 py-3 text-lg text-white"
              onClick={(e) => {
                e.stopPropagation();
                doOnConfirm();
                setIsOpen(false);
              }}
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
