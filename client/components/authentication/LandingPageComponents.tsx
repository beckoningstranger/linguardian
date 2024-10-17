import { Input } from "@headlessui/react";

import React, { forwardRef, PropsWithChildren } from "react";

type LandingPageInputProps = {
  type: string;
  placeholder:
    | "Please enter your email"
    | "Please enter your username"
    | "Please enter your password"
    | "Please enter your password again";
} & React.InputHTMLAttributes<HTMLInputElement>;

export const LandingPageInput = forwardRef<
  HTMLInputElement,
  LandingPageInputProps
>(({ type, placeholder, ...props }, ref) => {
  return (
    <>
      <label htmlFor={placeholder} className="sr-only">
        {placeholder}
      </label>
      <Input
        type={type}
        id={placeholder}
        placeholder={placeholder}
        className="text-md w-80 rounded-md border px-4 py-2 pr-4 tracking-normal"
        ref={ref}
        {...props}
      />
    </>
  );
});
LandingPageInput.displayName = "LandingPageInput";

export function LandingPageContainer({ children }: PropsWithChildren) {
  return (
    <div className="absolute bottom-0 w-full rounded-lg bg-white bg-opacity-60 bg-cover px-8 py-2 sm:bottom-3 sm:right-3 sm:w-auto">
      {children}
    </div>
  );
}

export function LandingPageFormHeader({ title }: { title: string }) {
  return <h1 className="py-4 text-xl text-blue-800">{title}</h1>;
}
