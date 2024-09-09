"use client";

import { MouseEventHandler } from "react";
import { FaPlus } from "react-icons/fa";

interface BottomRightButtonProps {
  onClickDoThis?: Function;
  icon?: JSX.Element;
  disabled?: boolean;
  styles?: string;
}

export default function BottomRightButton({
  onClickDoThis,
  icon,
  disabled,
  styles,
}: BottomRightButtonProps) {
  return (
    <button
      className={`fixed bottom-1 right-1 m-2 grid h-16 w-16 place-items-center rounded-full border border-white ${
        disabled ? "bg-slate-300" : "bg-green-400"
      } p-3 ${styles}`}
      onClick={onClickDoThis as MouseEventHandler}
      disabled={disabled}
    >
      {icon ? icon : <FaPlus className="text-2xl font-semibold text-white" />}
    </button>
  );
}
