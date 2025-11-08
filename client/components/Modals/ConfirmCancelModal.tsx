"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, RefObject, SetStateAction } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/ui/Button";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

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
  const ref = useOutsideClick(() => setIsOpen(false));

  if (!isOpen) return null;
  return createPortal(
    <>
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className="fixed inset-x-16 top-1/2 z-50 min-w-[300px] -translate-y-1/2 desktop:inset-x-32 desktopxl:inset-x-64"
      >
        {closeButton && (
          <Button
            className="absolute right-8 top-8"
            aria-label="Close this modal"
          >
            <XMarkIcon className="h-8 w-8" />
          </Button>
        )}
        <div className="relative flex w-full max-w-[calc(100%-2rem)] flex-col gap-2 rounded-md border border-grey-500 bg-white px-4 py-8 shadow-lg">
          {title && <p className="text-center text-2xl font-bold">{title}</p>}
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
        </div>
      </div>
    </>,
    document.body
  );
}
