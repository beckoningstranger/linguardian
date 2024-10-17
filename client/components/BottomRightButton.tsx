"use client";

import { Button } from "@headlessui/react";
import { MouseEventHandler } from "react";
import { FaPlus } from "react-icons/fa";

interface BottomRightButtonProps {
  onClickDoThis?: Function;
  icon?: JSX.Element;
  disabled?: boolean;
  styles?: string;
  ariaLabel: string;
}

export default function BottomRightButton({
  onClickDoThis,
  icon,
  disabled,
  styles,
  ariaLabel,
}: BottomRightButtonProps) {
  return (
    <Button
      className={`fixed bottom-1 right-1 m-2 grid h-16 w-16 place-items-center rounded-full border border-white ${
        disabled ? "bg-slate-300" : "bg-green-400"
      } p-3 ${styles}`}
      onClick={onClickDoThis as MouseEventHandler}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon ? icon : <FaPlus className="text-2xl font-semibold text-white" />}
    </Button>
  );
}
