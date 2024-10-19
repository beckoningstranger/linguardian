import { Input } from "@headlessui/react";

import React, { forwardRef, PropsWithChildren } from "react";

type LandingPageInputProps = {
  type: string;
  id: string;
  placeholder:
    | "Enter your email"
    | "Enter your username"
    | "Enter your password"
    | "Enter your password again";
} & React.InputHTMLAttributes<HTMLInputElement>;

export const LandingPageInput = forwardRef<
  HTMLInputElement,
  LandingPageInputProps
>(({ type, placeholder, id, ...props }, ref) => {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className="text-md w-full rounded-md border px-4 py-2 pr-4 tracking-normal"
        ref={ref}
        {...props}
      />
    </>
  );
});
LandingPageInput.displayName = "LandingPageInput";

export function LandingPageFormContainer({ children }: PropsWithChildren) {
  return (
    <div className="absolute bottom-0 w-full rounded-lg bg-white bg-opacity-60 bg-cover px-8 py-2 sm:bottom-3 sm:right-3 sm:w-96">
      {children}
    </div>
  );
}

export function LandingPageFormHeader({ title }: { title: string }) {
  return <h1 className="py-4 text-xl text-blue-800">{title}</h1>;
}
