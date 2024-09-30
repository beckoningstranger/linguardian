"use client";

import { useOutsideClick } from "@/lib/hooks";
import { changeListDetails } from "@/lib/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatedByLine from "./CreatedByLine";

interface ListHeaderProps {
  name: string;
  listNumber: number;
  description?: string;
  authorData: { username: string; usernameSlug: string }[];
  numberOfItems: number;
  image?: string;
  added?: boolean;
  userIsAuthor: boolean;
}

export default function ListHeader({
  name,
  listNumber,
  description,
  authorData,
  numberOfItems,
  image = "https://picsum.photos/200?grayscale",
  added,
  userIsAuthor,
}: ListHeaderProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const formattedDescription = description
    ?.split("\n")
    .map((paragraph, index) => (
      <p key={index} className="my-2">
        {paragraph}
      </p>
    ));

  return (
    <>
      <div
        className="relative flex items-center border-y-2 border-slate-300 sm:hidden"
        onClick={() => {
          if (description) setShowDetails(!showDetails);
        }}
      >
        <Image src={image} alt="List image" height={200} width={200} priority />
        <div className="m-2 flex h-full w-full flex-col justify-center gap-y-2 md:mt-4">
          {!showDetails &&
            (userIsAuthor ? (
              <ChangeListNameOrDescription
                oldString={name}
                listNumber={listNumber}
                listProperty="listName"
                editStyles="text-center text-xl sm:text-2xl"
                nonEditStyles="cursor-pointer text-center text-xl sm:text-2xl"
              />
            ) : (
              <h1 className="text-center text-xl sm:text-2xl">{name}</h1>
            ))}
          {!added && !showDetails && (
            <h3 className="text-center text-xs">{numberOfItems} items</h3>
          )}
          {showDetails && (
            <div>
              {userIsAuthor ? (
                <ChangeListNameOrDescription
                  oldString={description}
                  listNumber={listNumber}
                  listProperty="listDescription"
                  nonEditStyles={`mx-2 mt-2 max-w-md text-sm ${
                    authorData && "mb-4"
                  }`}
                  editStyles="w-96 text-sm h-24 block"
                />
              ) : (
                <h3
                  className={`mx-2 mt-2 max-w-md text-sm ${
                    authorData && "mb-4"
                  }`}
                >
                  {formattedDescription}
                </h3>
              )}
            </div>
          )}
          {authorData && !showDetails && (
            <CreatedByLine authorData={authorData} />
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="relative m-2 flex items-center justify-center rounded-md bg-slate-100 p-6">
          <Image
            src={image}
            alt="List image"
            height={150}
            width={150}
            priority
            className="rounded-md"
          />
          <div className="m-2 flex h-full w-full flex-col md:mt-4">
            <div className="flex w-full flex-col items-center">
              {userIsAuthor ? (
                <ChangeListNameOrDescription
                  oldString={name}
                  listNumber={listNumber}
                  listProperty="listName"
                  editStyles="text-center text-xl sm:text-2xl"
                  nonEditStyles="cursor-pointer text-center text-xl sm:text-2xl"
                />
              ) : (
                <h1 className="m-2 mb-0 text-center text-xl sm:text-2xl">
                  {name}
                </h1>
              )}
              {!added && <h3 className="text-sm">{numberOfItems} items</h3>}

              {userIsAuthor ? (
                <ChangeListNameOrDescription
                  oldString={description}
                  listNumber={listNumber}
                  listProperty="listDescription"
                  nonEditStyles={`mx-2 mt-2 max-w-md text-sm ${
                    authorData && "mb-4"
                  }`}
                  editStyles="w-96 text-sm h-24 block px-2"
                />
              ) : (
                <h3
                  className={`mx-2 mt-2 max-w-md text-sm ${
                    authorData && "mb-4"
                  }`}
                >
                  {formattedDescription}
                </h3>
              )}
            </div>
            {authorData && <CreatedByLine authorData={authorData} />}
          </div>
        </div>
      </div>
    </>
  );
}

interface ChangeListNameOrDescriptionProps {
  oldString: string | undefined;
  listNumber: number;
  listProperty: "listDescription" | "listName";
  editStyles: string;
  nonEditStyles: string;
}
function ChangeListNameOrDescription({
  oldString,
  listNumber,
  listProperty,
  editStyles,
  nonEditStyles,
}: ChangeListNameOrDescriptionProps) {
  const [newString, setNewString] = useState(oldString);
  const [editMode, setEditMode] = useState(false);

  const formattedString = newString?.split("\n").map((paragraph, index) => (
    <p key={index} className="my-2">
      {paragraph}
    </p>
  ));

  const changeIt = () => {
    if (newString !== oldString)
      toast.promise(
        changeListDetails({
          listNumber: listNumber,
          [listProperty]: newString,
        }),
        {
          loading: "Loading...",
          success: `${
            listProperty === "listName" ? "Title" : "Description"
          } changed! 🎉`,
          error: (err) => err.toString(),
        }
      );
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
          {listProperty === "listName" ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={newString}
              onChange={(e) => setNewString(e.target.value)}
              type="text"
              name="title"
              placeholder="Enter a new title for this list"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setNewString(oldString);
                  setEditMode(false);
                }
              }}
              className={editStyles + " text-center w-full"}
            />
          ) : (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={newString}
              onChange={(e) => setNewString(e.target.value)}
              name="title"
              placeholder="Enter a new title for this list"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setNewString(oldString);
                  setEditMode(false);
                }
              }}
              className={editStyles + " w-full"}
              maxLength={200}
            />
          )}
        </form>
      )}
      {!editMode && (
        <div
          className={nonEditStyles}
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
            inputRef.current?.focus();
          }}
        >
          {formattedString}
        </div>
      )}
    </>
  );
}
