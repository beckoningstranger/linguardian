import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";

interface ListSearchInputProps {
  label?: string;
  optional?: boolean;
}

export default function ListSearchInput({
  label = "Search in Lists",
  optional = false,
}: ListSearchInputProps) {
  return (
    <Field className="relative flex w-full flex-col items-center border-none bg-transparent bg-white">
      <Input
        id="listSearch"
        name="listSearch"
        type="text"
        className="peer h-11 w-full rounded-lg border border-grey-500 bg-transparent px-2 placeholder-transparent focus:border-grey-600 focus:outline-none"
        placeholder={label}
      />
      <Label
        htmlFor="listSearch"
        className="absolute -top-6 left-0 text-base text-grey-800 transition-all duration-75 peer-placeholder-shown:top-2 peer-placeholder-shown:px-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-grey-900"
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
