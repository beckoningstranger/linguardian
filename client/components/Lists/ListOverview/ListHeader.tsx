"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
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
              <ChangeTitle listTitle={name} listNumber={listNumber} />
            ) : (
              <h1 className="text-center text-xl sm:text-2xl">{name}</h1>
            ))}
          {!added && !showDetails && (
            <h3 className="text-center text-xs">{numberOfItems} items</h3>
          )}
          {showDetails && (
            <h3 className={`mx-2 max-w-md text-xs`}>{description}</h3>
          )}
          {authorData && !showDetails && (
            <CreatedByLine authorData={authorData} />
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="relative m-2 flex rounded-md bg-slate-100 p-6">
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
                <ChangeTitle listTitle={name} listNumber={listNumber} />
              ) : (
                <h1 className="m-2 mb-0 text-center text-xl sm:text-2xl">
                  {name}
                </h1>
              )}
              {!added && <h3 className="text-sm">{numberOfItems} items</h3>}
              <h3
                className={`mx-2 mt-2 max-w-md text-sm ${authorData && "mb-4"}`}
              >
                {description}
              </h3>
            </div>
            {authorData && <CreatedByLine authorData={authorData} />}
          </div>
        </div>
      </div>
    </>
  );
}

interface ChangeTitleProps {
  listTitle: string;
  listNumber: number;
}
function ChangeTitle({ listTitle, listNumber }: ChangeTitleProps) {
  const [newListTitle, setNewListTitle] = useState(listTitle);
  const [editMode, setEditMode] = useState(false);

  const changeTitle = () => {
    if (newListTitle !== listTitle)
      toast.promise(
        changeListDetails({ listNumber: listNumber, listName: newListTitle }),
        {
          loading: "Loading...",
          success: "Title changed! 🎉",
          error: (err) => err.toString(),
        }
      );
  };

  const inputRef = useOutsideClick(() => {
    setEditMode(false);
    changeTitle();
  });

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode, inputRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditMode(false);
    changeTitle();
  };

  return (
    <>
      {editMode && (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            type="text"
            name="title"
            placeholder="Enter a new title for this list"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setNewListTitle(listTitle);
                setEditMode(false);
              }
            }}
            className={`text-center text-xl sm:text-2xl`}
          />
        </form>
      )}
      {!editMode && (
        <div
          className="cursor-pointer text-center text-xl sm:text-2xl"
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
            inputRef.current?.focus();
          }}
        >
          {listTitle}
        </div>
      )}
    </>
  );
}
