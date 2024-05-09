"use client";

import Image from "next/image";
import { useState } from "react";

interface ListHeaderProps {
  name: string;
  description?: string;
  authors: string;
  numberOfItems: number;
  image?: string;
  added?: boolean;
}

export default function ListHeader({
  name,
  description,
  authors,
  numberOfItems,
  image = "https://picsum.photos/200?grayscale",
  added,
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
        <div className="m-2 flex h-full w-full flex-col justify-center md:mt-4">
          {!showDetails && (
            <h1 className="text-center text-xl sm:text-2xl">{name}</h1>
          )}
          {!added && !showDetails && (
            <h3 className="text-center text-xs">{numberOfItems} items</h3>
          )}
          {showDetails && (
            <h3 className={`mx-2 max-w-md text-xs`}>{description}</h3>
          )}
          {authors && !showDetails && (
            <h5 className="absolute bottom-1 right-1 text-xs">
              <span>created by </span>
              {authors}
            </h5>
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="relative flex border-y-2 border-slate-300">
          <Image
            src={image}
            alt="List image"
            height={200}
            width={200}
            priority
          />
          <div className="m-2 flex h-full w-full flex-col md:mt-4">
            <div className="flex w-full flex-col items-center">
              <h1 className="m-2 mb-0 text-center text-xl sm:text-2xl">
                {name}
              </h1>
              {!added && <h3 className="text-sm">{numberOfItems} items</h3>}
              <h3 className={`mx-2 mt-2 max-w-md text-sm ${authors && "mb-4"}`}>
                {description}
              </h3>
            </div>
            {authors && (
              <h5 className="absolute bottom-1 right-1 text-xs">
                <span>created by </span>
                {authors}
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
