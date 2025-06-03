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
      <div className="mt-2 grid w-full grid-cols-6 gap-2">
        {keys.map((key) => (
          <Button
            color="blue"
            className="font-voces grid h-10 w-10 place-items-center font-light"
            key={key}
            onClick={() => {
              const newArray = [...array];
              newArray[arrayIndex] = array[arrayIndex] + key;
              setArray(newArray);
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
