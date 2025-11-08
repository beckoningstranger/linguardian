"use client";

import { Button as HeadlessUiButton } from "@headlessui/react";
import { ReactNode } from "react";

import { Spinner } from "@/components";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children?: ReactNode;
  intent?:
    | "primary"
    | "secondary"
    | "icon"
    | "danger"
    | "success"
    | "warning"
    | "bottomRightButton";
  color?: "white" | "blue" | "green" | "transparent";
  rounded?: boolean;
  noRing?: boolean;
  fullWidth?: boolean;
  busy?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  intent,
  color,
  noRing,
  fullWidth,
  rounded,
  busy,
  ...props
}: ButtonProps) {
  const remainingProps = { ...props };
  delete remainingProps.className;

  const styling = {
    "hover:bg-gradient-to-r bg-green-500 from-green-500 to-green-700 hover:ring-green-500":
      intent === "primary",
    "hover:bg-gradient-to-r text-amber-300 bg-amber-300 text-white from-amber-300 to-amber-500 hover:ring-amber-300":
      intent === "secondary",
    "hover:bg-gradient-to-r border border-red-500 text-red-500 from-red-500 to-red-700 hover:ring-red-500 hover:text-white":
      intent === "danger",
    "grid place-items-center p-0 text-grey-800 active:scale-100":
      intent === "icon",
    "fixed rounded-full grid size-[90px] place-items-center shadow-xl bottom-4 right-8 bg-green-500 hover:ring-green-700 hover:scale-105 active:scale-100":
      intent === "bottomRightButton",
    "w-full text-clgm": fullWidth,
  };

  const colorStyling = {
    "hover:bg-gradient-to-r bg-white/90 text-blue-800 hover:bg-white/100 from-white to-white":
      color === "white",
    "hover:bg-gradient-to-r bg-blue-500 from-blue-500 to-blue-600 hover:ring-blue-500":
      color === "blue",
    "hover:bg-gradient-to-r bg-green-500 text-white hover:ring-white":
      color === "green",
    "bg-transparent": color === "transparent",
  };

  const roundedStyling = rounded && "rounded-lg";

  const disabledStyling =
    props.disabled &&
    "hover:cursor-not-allowed hover:ring-0 hover:ring-offset-0 text-grey-100 bg-grey-500 pointer-events-none";

  const noRingStyling =
    noRing && "hover:ring-0 hover:ring-offset-0 focus:ring-0 active:ring-0";

  return (
    <HeadlessUiButton
      className={cn(
        "relative text-clgr text-white h-12 transition-all duration-300 ring-2 ring-transparent hover:ring-current hover:ring-offset-1 hover:ring-offset-white focus:ring-offset-2 focus:ring-current focus:ring-offset-white",
        styling,
        roundedStyling,
        colorStyling,
        disabledStyling,
        noRingStyling,
        props.className
      )}
      tabIndex={props.disabled ? -1 : undefined}
      aria-disabled={props.disabled}
      {...remainingProps}
    >
      {busy ? (
        <div className="flex justify-center">
          <Spinner mini />
        </div>
      ) : (
        <>{children}</>
      )}
    </HeadlessUiButton>
  );
}
