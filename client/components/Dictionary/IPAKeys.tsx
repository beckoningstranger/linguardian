import { Dispatch, RefObject, SetStateAction } from "react";

interface IPAKeysProps {
  keys: string[] | undefined;
  inputFieldRef: RefObject<HTMLDivElement | HTMLInputElement>;
  inputFieldValue: string;
  inputFieldValueSetter: Dispatch<SetStateAction<string>>;
}

export default function IPAKeys({
  keys,
  inputFieldRef,
  inputFieldValue,
  inputFieldValueSetter,
}: IPAKeysProps) {
  if (keys && keys.length > 0)
    return (
      <div className="m-2 grid h-48 grid-cols-8 py-4">
        {keys.map((key, index) => (
          <button
            key={key + index}
            id={"IPAKeys" + index}
            onClick={() => {
              inputFieldValueSetter(inputFieldValue + key);
              inputFieldRef.current?.focus();
            }}
            className="grid h-9 w-9 place-items-center rounded-md border border-black p-2 text-sm"
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
