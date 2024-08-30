"use client";

import { FaPlus } from "react-icons/fa";

export default function ListAddItemButton() {
  return (
    <button
      className="flex w-full flex-col items-center justify-center rounded-md bg-slate-100 p-1"
      onClick={() => {
        console.log("BEEP");
      }}
    >
      <div
        className={`m-1 grid h-12 w-12 place-items-center rounded-full border border-white bg-green-400`}
      >
        <FaPlus className="text-2xl font-semibold text-white" />
      </div>
    </button>
  );
}
