import { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";

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
      <div className="mt-2 grid w-full grid-cols-6 gap-2">
        {keys.map((key) => (
          <Button
            color="blue"
            className="grid h-10 w-10 place-items-center font-voces font-light"
            key={key}
            id={"IPAKeys-" + key} // This is used in useOutsideInputAndKeyboardClick in hooks.ts
            onClick={() => {
              array[arrayIndex] = array[arrayIndex] + key;
              setArray(array.slice());
            }}
          >
            {key}
          </Button>
        ))}
      </div>
    );
  return (
    <div className="grid h-56 w-full place-items-center">Nothing to show</div>
  );
}
