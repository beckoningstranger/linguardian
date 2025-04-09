"use client";

import { useListContext } from "@/context/ListContext";
import { changeListDetails } from "@/lib/actions";
import { useOutsideClick } from "@/lib/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatedByLine from "./CreatedByLine";

interface ListHeaderProps {}

export default function ListHeader({}: ListHeaderProps) {
  const {
    listData: {
      name,
      language,
      listNumber,
      description = "Dans Ensemble, c’est tout, quatre personnages blessés – Camille, Philibert, Franck et Paulette – trouvent espoir et bonheur en vivant ensemble...",
      // description = "",
      image = "/images/ListDefaultImage.webp",
      units,
    },
    userIsAuthor,
    authorData,
    userIsLearningThisList,
  } = useListContext();

  const numberOfItems = units.length;

  const formattedDescription = description
    ?.split("\n")
    .map((paragraph, index) => (
      <p key={index} className="my-2">
        {paragraph}
      </p>
    ));

  return (
    <>
      <div className="relative flex max-h-[150px] w-screen gap-2 overflow-hidden bg-white/90 py-1 tablet:col-span-2 tablet:max-h-[200px] tablet:w-auto tablet:rounded-lg tablet:p-4">
        <Image
          src={image}
          alt="List image"
          height={200}
          width={200}
          priority
          className="h-[150px] w-[150px] rounded-md tablet:rounded-2xl tablet:shadow-xl"
        />
        <div className="flex w-full flex-col gap-2 tablet:my-4">
          <div className="my-1 leading-[1] tablet:leading-[1.2]">
            <CreatedByLine authorData={authorData} />
            <h2 className="font-serif text-hsm tablet:text-hmd">{name}</h2>
          </div>
          <h4 className="text-csmr tablet:text-cmdr">{description}</h4>
        </div>
        {/* <div className="flex h-full w-full flex-col justify-center gap-2 md:mt-4">
          {userIsAuthor ? (
            <ChangeListNameOrDescription
              oldString={name}
              listNumber={listNumber}
              listProperty="listName"
              editStyles="text-center"
              nonEditStyles="cursor-pointer text-center"
            />
          ) : (
            <h2 className="text-center">{name}</h2>
          )}
          {!userIsLearningThisList && (
            <h3 className="text-center text-xs">{numberOfItems} items</h3>
          )} */}
        {/* {
            <div>
              {userIsAuthor ? (
                <ChangeListNameOrDescription
                  oldString={description}
                  listNumber={listNumber}
                  listProperty="listDescription"
                  nonEditStyles={`mx-2 mt-2 max-w-md ${authorData && "mb-4"}`}
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
          } */}
        {/* {authorData && <CreatedByLine authorData={authorData} />} */}
      </div>
      {/* </div> */}
      {/* <div className="hidden sm:block">
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
              {!userIsLearningThisList && (
                <h3 className="text-sm">{numberOfItems} items</h3>
              )}

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
      </div> */}
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
    <p key={index} className="my-2 font-serif text-xl">
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
              className={editStyles + " text-center w-full font-serif"}
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
