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
      <div className="grid h-48 grid-cols-8 place-content-start">
        {keys.map((key) => (
          <button
            key={key}
            id={"IPAKeys-" + key} // This is used in useOutsideInputAndKeyboardClick in hooks.ts
            onClick={() => {
              array[arrayIndex] = array[arrayIndex] + key;
              setArray(array.slice());
            }}
            className="my-2 grid h-9 w-9 place-items-center rounded-md border border-black p-2 font-voces font-normal"
          >
            {key}
          </button>
        ))}
      </div>
    );
  return (
    <div className="grid h-56 w-full place-items-center">Nothing to show</div>
  );
}
