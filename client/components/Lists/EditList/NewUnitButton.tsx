"use client";

import { addUnitToList } from "@/lib/actions";
import { Input } from "@headlessui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewUnitButtonProps {
  listNumber: number;
  unitOrder: string[];
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
}

export default function NewUnitButton({
  listNumber,
  unitOrder,
  setUnitOrder,
}: NewUnitButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [unitName, setUnitName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsActive(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.blur();
    }
    const isDuplicate = unitOrder.includes(unitName.trim());
    if (isDuplicate) toast.error("This unit name already exists");
    if (!isDuplicate && unitName.trim().length > 0)
      toast.promise(addUnitToList(unitName, listNumber), {
        loading: "Adding new unit...",
        success: () => {
          const newUnitOrder = [...unitOrder, unitName];
          setUnitOrder(newUnitOrder);
          return "Unit added! 🎉";
        },
        error: (err) => {
          return `Failed to add item: ${err.message}`;
        },
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center">
      <Input
        value={unitName}
        onChange={(e) => setUnitName(e.target.value)}
        ref={inputRef}
        className={`bg-white/90 hover:bg-white duration-300 transition-colors flex h-[90px] mb-2 tablet:my-2 w-full items-center justify-center rounded-lg  text-cmdb tablet:text-clgm py-2 text-center placeholder-black shadow-lg hover:cursor-pointer ${
          isActive ? "focus:placeholder-transparent" : ""
        }`}
        placeholder="Add a new unit"
        onFocus={() => {
          setIsActive(true);
        }}
        onBlur={() => {
          setIsActive(false);
          setUnitName("");
        }}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}
