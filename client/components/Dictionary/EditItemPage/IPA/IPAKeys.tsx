"use client";

import Button from "@/components/ui/Button";
import { Dispatch, SetStateAction } from "react";

interface IPAKeysProps {
  keys: string[] | undefined;
  arrayIndex: number;
  array: string[];
  setArray: Dispatch<SetStateAction<string[]>>;
}

export default function IPAKeys({
  keys,
  arrayIndex,
  array,
  setArray,
}: IPAKeysProps) {
  if (keys && keys.length > 0)
    return (
      <div className="mx-auto mt-2 grid min-h-[160px] w-full grid-cols-5 gap-2 tablet:w-[400px] tablet:grid-cols-6">
        {keys.map((key) => (
          <div key={key} className="flex justify-center">
            <Button
              color="blue"
              className="IPAKeys font-voces grid h-10 w-10 place-items-center rounded-md font-light"
              onClick={() => {
                const newArray = [...array];
                newArray[arrayIndex] = array[arrayIndex] + key;
                setArray(newArray);
              }}
            >
              {key}
            </Button>
          </div>
        ))}
      </div>
    );
  return (
    <div className="grid h-56 w-full place-items-center">Nothing to show</div>
  );
}
