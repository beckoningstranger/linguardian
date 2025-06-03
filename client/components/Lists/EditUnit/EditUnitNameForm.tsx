"use client";

import { useOutsideClickWithExceptions } from "@/lib/hooks";
import {
  Dispatch,
  FormEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";

interface EditUnitNameFormProps {
  handleSubmit: FormEventHandler;
  unitName: string;
  updatedUnitName: string;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setUpdatedUnitName: Dispatch<SetStateAction<string>>;
  editUnitNameAction: Function;
}

export default function EditUnitNameForm({
  handleSubmit,
  unitName,
  updatedUnitName,
  setUpdatedUnitName,
  editMode,
  setEditMode,
  editUnitNameAction,
}: EditUnitNameFormProps) {
  const inputRef = useOutsideClickWithExceptions(() => {
    setEditMode(false);
    if (updatedUnitName !== unitName) editUnitNameAction();
  });

  useEffect(() => {
    if (editMode && inputRef) inputRef.current?.focus();
  }, [inputRef, editMode]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={unitName} className="sr-only">
        {unitName} - Click to edit
      </label>
      <input
        type="text"
        id={unitName}
        value={updatedUnitName}
        maxLength={40}
        ref={inputRef as RefObject<HTMLInputElement>}
        className="m-0 w-[calc(100%-16px)] border-0 border-b-2 border-gray-300 bg-transparent text-center focus:border-black focus:outline-none"
        onChange={(e) => {
          setUpdatedUnitName(e.target.value);
        }}
      />
    </form>
  );
}
