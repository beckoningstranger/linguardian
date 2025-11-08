"use client";

import toast from "react-hot-toast";

import { deleteUnitAction } from "@/lib/actions/list-actions";
import { SupportedLanguage } from "@/lib/contracts";

export async function removeUnitFromList({
  listNumber,
  unitName,
  languageCode,
  onOptimisticUpdate,
  onRollback,
}: {
  listNumber: number;
  unitName: string;
  languageCode: SupportedLanguage;
  onOptimisticUpdate?: () => void;
  onRollback?: () => void;
}) {
  // optimistic update if provided
  onOptimisticUpdate?.();

  const response = await toast.promise(
    deleteUnitAction(listNumber, unitName, languageCode),
    {
      loading: "Removing this unit...",
      success: (response) => response.message,
      error: (err) => {
        onRollback?.();
        return err instanceof Error ? err.message : err.toString();
      },
    }
  );

  return response;
}
