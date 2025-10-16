import React from "react";

import { useMobileMenu } from "@/context/MobileMenuContext";
import MobileMenu from "@/components/Menus/MobileMenu/MobileMenu";
import Button from "@/components/ui/Button";

interface ConfirmCancelMobileMenuProps {
  children?: React.ReactNode;
  title?: string;
  message?: string;
  doOnConfirm: Function;
}

export default function ConfirmCancelMobileMenu({
  children,
  title,
  message,
  doOnConfirm,
}: ConfirmCancelMobileMenuProps) {
  const { toggleMobileMenu } = useMobileMenu();

  return (
    <MobileMenu mode="fullscreen" fromDirection="animate-from-top">
      <div className="mx-4 text-center">
        {title && <div className="text-cxlb leading-tight">{title}</div>}
        <div>{children}</div>
        {message && (
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 text-clgm">
            {message}
          </div>
        )}
      </div>
      <div
        className="absolute bottom-4 flex w-full justify-evenly"
        id="modalBottomButtons"
      >
        <Button
          intent="secondary"
          className="min-w-[150px]"
          rounded
          onClick={(e) => {
            e.stopPropagation();
            if (toggleMobileMenu) toggleMobileMenu();
          }}
        >
          Cancel
        </Button>
        <Button
          intent="primary"
          className="min-w-[150px]"
          rounded
          onClick={(e) => {
            e.stopPropagation();
            doOnConfirm();
            if (toggleMobileMenu) toggleMobileMenu();
          }}
        >
          Confirm
        </Button>
      </div>
    </MobileMenu>
  );
}
