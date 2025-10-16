"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

import { updateUnitNameAction } from "@/lib/actions/list-actions";
import { SupportedLanguage } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface UnitNameInputProps {
  unitName: string;
  listNumber: number;
  languageCode: SupportedLanguage;
  unitOrder?: string[];
  setUnitOrder?: Dispatch<SetStateAction<string[]>>;
}

export default function UnitNameInput({
  unitName,
  listNumber,
  languageCode,
  unitOrder,
  setUnitOrder,
}: UnitNameInputProps) {
  const oldUnitName = unitName;
  const router = useRouter();
  const [newUnitName, setNewUnitName] = useState(unitName);
  const [debouncedUnitName] = useDebounce(newUnitName, 1000);

  useEffect(() => {
    const trimmedName = debouncedUnitName.trim();
    const nameChanged = trimmedName !== unitName && trimmedName.length > 0;

    if (!nameChanged) return;

    const updateUnitName = async () => {
      const previousName = unitName;

      if (unitOrder && setUnitOrder) {
        const previousUnitOrder = unitOrder;
        const newUnitOrder: string[] = previousUnitOrder?.map((uName) => {
          if (uName === previousName) return trimmedName;
          return uName;
        });

        setUnitOrder(newUnitOrder);
      }

      await toast.promise(
        updateUnitNameAction(
          listNumber,
          oldUnitName,
          trimmedName,
          languageCode
        ),
        {
          loading: "Changing unit name...",
          success: (res) => res.message,
          error: (err) => {
            setNewUnitName(previousName);

            if (unitOrder && setUnitOrder) {
              setUnitOrder(
                unitOrder.map((uName) =>
                  uName === trimmedName ? previousName : uName
                )
              );
            }
            return err instanceof Error ? err.message : err.toString();
          },
        }
      );
    };

    updateUnitName();
  }, [
    debouncedUnitName,
    unitName,
    listNumber,
    languageCode,
    router,
    oldUnitName,
    unitOrder,
    setUnitOrder,
  ]);

  return (
    <div className="flex h-20 w-full items-center">
      <input
        type="text"
        id={unitName}
        value={newUnitName}
        maxLength={50}
        className={cn(
          "mx-2 w-full border-0 border-b-2 border-gray-300 bg-transparent text-center focus:border-black focus:outline-none",
          newUnitName.length > 30 ? "text-cmdb tablet:text-clgb" : "text-clgb"
        )}
        onChange={(e) => setNewUnitName(e.target.value)}
      />
    </div>
  );
}
