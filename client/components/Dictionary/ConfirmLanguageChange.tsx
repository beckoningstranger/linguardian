import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MouseEventHandler } from "react";
import Button from "../ui/Button";

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
          <div className="flex items-stretch justify-between gap-x-5">
            <Button
              onClick={closeFunction as MouseEventHandler}
              intent="secondary"
              className="w-full flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmFunction as MouseEventHandler}
              intent="primary"
              className="w-full flex-1"
            >
              Change language
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
