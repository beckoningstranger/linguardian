import { Dispatch, RefObject, SetStateAction } from "react";

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
        {keys.map((key, index) => (
          <button
            key={key + index}
            id={"IPAKeys" + index} // This is used in useOutsideInputAndKeyboardClick
            onClick={() => {
              array[arrayIndex] = array[arrayIndex] + key;
              setArray(array.slice());
            }}
            className="my-2 grid h-9 w-9 place-items-center rounded-md border border-black p-2 text-sm"
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
