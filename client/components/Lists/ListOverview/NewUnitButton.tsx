"use client";

import { addUnitToList } from "@/lib/actions";
import { Input } from "@headlessui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewUnitButtonProps {
  listNumber: number;
  unitNames: string[];
  unitOrder: string[];
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
}

export default function NewUnitButton({
  listNumber,
  unitNames,
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
    const isDuplicate = unitNames.includes(unitName.trim());
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
        className={`relative flex h-14 w-11/12 items-center justify-center rounded-lg border border-slate-800 py-2 text-center placeholder-black shadow-lg hover:cursor-pointer hover:shadow-2xl ${
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
