import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Field, Input, Label } from "@headlessui/react";

interface SearchInputProps {
  label?: string;
  optional?: boolean;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function SearchInput({
  label = "Search",
  optional = false,
  query,
  setQuery,
}: SearchInputProps) {
  return (
    <Field className="relative flex w-full flex-col items-center border-none bg-transparent bg-white">
      <Input
        id="Search"
        name="Search"
        type="text"
        className="peer h-11 w-full rounded-lg border border-grey-500 bg-transparent px-4 placeholder-transparent focus:border-grey-600 focus:outline-none"
        placeholder={label}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <Label
        htmlFor="Search"
        className="absolute -top-6 left-0 text-base text-grey-800 transition-all duration-75 peer-placeholder-shown:top-3 peer-placeholder-shown:px-4 peer-placeholder-shown:text-cmdr peer-placeholder-shown:text-grey-800"
      >
        {label}
      </Label>
      {optional && (
        <div className="absolute -top-6 right-0 text-base text-grey-800">
          Optional
        </div>
      )}
      <Image
        src={"/icons/Sort.svg"}
        width={32}
        height={32}
        alt="Sort Icon"
        className="absolute right-3 top-1.5"
      />
      <Image
        src={"/icons/Filter.svg"}
        width={32}
        height={32}
        alt="Sort Icon"
        className="absolute right-12 top-1.5"
      />
    </Field>
  );
}
