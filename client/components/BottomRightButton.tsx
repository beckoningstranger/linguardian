"use client";

import { MouseEventHandler } from "react";
import { FaPlus } from "react-icons/fa";

interface BottomRightButtonProps {
  onClickDoThis?: Function;
  icon?: JSX.Element;
}

export default function BottomRightButton({
  onClickDoThis,
  icon,
}: BottomRightButtonProps) {
  return (
    <div
      className={`fixed bottom-1 right-1 m-2 grid h-16 w-16 place-items-center rounded-full border border-white bg-green-400 p-3`}
      onClick={onClickDoThis as MouseEventHandler}
    >
      {icon ? icon : <FaPlus className="text-2xl font-semibold text-white" />}
    </div>
  );
}
