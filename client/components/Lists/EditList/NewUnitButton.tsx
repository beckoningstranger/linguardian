"use client";

import { createUnitAction } from "@/lib/actions/list-actions";
import { SupportedLanguage } from "@linguardian/shared/contracts";
import { Input } from "@headlessui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewUnitButtonProps {
  listNumber: number;
  unitOrder: string[];
  listLanguage: SupportedLanguage;
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
}

export default function NewUnitButton({
  listNumber,
  unitOrder,
  listLanguage,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.blur();
    }
    const newUnitName = unitName.trim();
    const isDuplicate = unitOrder.includes(newUnitName);
    if (isDuplicate) toast.error("This unit name already exists");
    if (!isDuplicate && newUnitName.length > 0) {
      const updatedUnitOrder = [...unitOrder, newUnitName];
      const response = await toast.promise(
        createUnitAction(listNumber, newUnitName, listLanguage),
        {
          loading: "Adding new unit...",
          success: (response) => response.message,
          error: (err) => (err instanceof Error ? err.message : err.toString()),
        }
      );
      if (response) {
        setUnitOrder(updatedUnitOrder);
      }
    }
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
