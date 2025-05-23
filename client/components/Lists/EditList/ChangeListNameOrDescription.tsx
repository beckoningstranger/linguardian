import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { changeListDetails } from "@/lib/actions";
import { useOutsideClick } from "@/lib/hooks";
import { Textarea } from "@headlessui/react";

interface ChangeListNameOrDescriptionProps {
  oldString: string | undefined;
  listNumber: number;
  listProperty: "listDescription" | "listName";
  editStyling: string;
  nonEditStyling: string;
}

export default function ChangeListNameOrDescription({
  oldString,
  listNumber,
  listProperty,
  editStyling,
  nonEditStyling,
}: ChangeListNameOrDescriptionProps) {
  const [newString, setNewString] = useState(oldString || "");
  const [editMode, setEditMode] = useState(false);

  const changeIt = () => {
    if (newString === oldString) return;
    if (
      (listProperty === "listName" && newString.length > 5) ||
      listProperty === "listDescription"
    ) {
      toast.promise(
        changeListDetails({
          listNumber: listNumber,
          [listProperty]: newString?.trim(),
        }),
        {
          loading: "Loading...",
          success: `${
            listProperty === "listName" ? "Title" : "Description"
          } changed! 🎉`,
          error: (err) => err.toString(),
        }
      );
    } else {
      setNewString(oldString || "");
    }
  };

  const inputRef = useOutsideClick(() => {
    setEditMode(false);
    changeIt();
  });

  useEffect(() => {
    if (editMode && inputRef.current) {
      const inputElement = inputRef.current;

      if (
        inputElement instanceof HTMLInputElement ||
        inputElement instanceof HTMLTextAreaElement
      ) {
        inputElement.focus();
        const length = inputElement.value.length;
        inputElement.setSelectionRange(length, length);
      }
    }
  }, [editMode, inputRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditMode(false);
    changeIt();
  };

  return (
    <>
      {editMode && (
        <form onSubmit={handleSubmit} className="w-full">
          {listProperty === "listName" && (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={newString}
              onChange={(e) => setNewString(e.target.value)}
              type="text"
              name="title"
              placeholder="Enter a new title for this list"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setNewString(oldString || "");
                  setEditMode(false);
                }
              }}
              className={editStyling}
            />
          )}
          {listProperty === "listDescription" && (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={newString}
              onChange={(e) => setNewString(e.target.value)}
              name="description"
              placeholder="Enter a description for this list..."
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setNewString(oldString || "");
                  setEditMode(false);
                }
              }}
              className={editStyling}
              maxLength={200}
            />
          )}
        </form>
      )}
      {!editMode && (
        <div
          className={nonEditStyling}
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
            inputRef.current?.focus();
          }}
        >
          {newString && newString?.length > 0
            ? newString
            : "Enter a list description"}
        </div>
      )}
    </>
  );
}
