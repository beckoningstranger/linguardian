import React from "react";
import MobileMenu from "./Menus/MobileMenu/MobileMenu";
import { useMobileMenu } from "@/context/MobileMenuContext";
import Button from "./ui/Button";

interface ConfirmCancelMobileMenuProps {
  children: React.ReactNode;
  doOnConfirm: Function;
}

export default function ConfirmCancelMobileMenu({
  children,
  doOnConfirm,
}: ConfirmCancelMobileMenuProps) {
  const { toggleMobileMenu } = useMobileMenu();

  return (
    <MobileMenu mode="fullscreen" fromDirection="animate-from-top">
      <div className="relative mx-12 rounded-md text-center text-3xl font-bold">
        {children}
      </div>
      <div className="absolute bottom-24 mx-12 mt-32 flex w-full justify-evenly">
        <Button
          intent="secondary"
          className="mx-4 flex-1 py-4"
          // className="rounded-md bg-red-500 px-6 py-3 text-xl text-white"
          onClick={(e) => {
            e.stopPropagation();
            if (toggleMobileMenu) toggleMobileMenu();
          }}
        >
          Cancel
        </Button>
        <Button
          intent="primary"
          className="mx-4 flex-1 py-4"
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
