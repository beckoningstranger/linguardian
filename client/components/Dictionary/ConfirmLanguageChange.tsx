import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MouseEventHandler } from "react";

interface ConfirmLanguageChangeProps {
  confirmFunction: Function;
  closeFunction: Function;
}
export default function ConfirmLanguageChange({
  closeFunction,
  confirmFunction,
}: ConfirmLanguageChangeProps) {
  return (
    <Dialog
      open={true}
      onClose={() => closeFunction()}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center sm:p-2">
        <DialogPanel className="max-w-lg space-y-4 rounded-md border bg-white p-12">
          <DialogTitle className="text-2xl font-semibold">
            Changing item language
          </DialogTitle>
          <Description>
            This will create a new item with all the provided data in the
            language you selected and delete the old item.
          </Description>
          <div className="flex justify-between">
            <button
              onClick={closeFunction as MouseEventHandler}
              className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
            <button
              onClick={confirmFunction as MouseEventHandler}
              className="rounded-md bg-green-500 px-4 py-2 text-white"
            >
              Change language
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
