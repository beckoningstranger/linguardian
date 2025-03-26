import { cn } from "@/lib/helperFunctionsClient";
import { Button as HeadlessUiButton } from "@headlessui/react";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  intent?: "primary" | "secondary" | "danger" | "success" | "warning";
  color?: "white" | "blue" | "green";
  noRing?: boolean;
  bottomRightButton?: boolean;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  intent,
  color,
  noRing,
  bottomRightButton,
  fullWidth,
  ...props
}: ButtonProps) {
  const remainingProps = { ...props };
  delete remainingProps.className;

  const styling = {
    "bg-primarygreen from-primarygreen to-green-700 hover:ring-primarygreen":
      intent === "primary",
    "text-amber-300 bg-amber-300 text-white from-amber-300 to-amber-500 hover:ring-amber-300":
      intent === "secondary",
    "rounded-md border border-red-500 text-red-500 from-red-500 to-red-700 hover:ring-red-500 hover:text-white":
      intent === "danger",
    "w-full": fullWidth,
    "fixed rounded-full bottom-4 right-4 bg-green-600 from-green-600 to-green-700 hover:ring-green-700 disabled:after:rounded-full":
      bottomRightButton,
  };

  const colorStyling = {
    "bg-white text-blue-800 from-white to-gray-200 hover:ring-white":
      color === "white",
    "bg-blue-500 from-blue-500 to-blue-600 hover:ring-blue-500":
      color === "blue",
    "bg-green-500 text-white rounded-full hover:ring-white": color === "green",
  };
  const disabledStyling =
    props.disabled &&
    "hover:cursor-not-allowed hover:ring-0 hover:ring-offset-0 from-gray-400 to-gray-400 after:absolute after:inset-0 after:rounded-md after:bg-gray-200 after:opacity-50 after:content-['']";

  const noRingStyling =
    noRing && "hover:ring-0 hover:ring-offset-0 focus:ring-0 active:ring-0";

  return (
    <HeadlessUiButton
      className={cn(
        "text-white px-3 relative py-1.5 rounded-md hover:bg-gradient-to-r hover:ring-1 hover:ring-transparent ring-offset-current transition-all active:scale-95 hover:ring-offset-2",
        styling,
        colorStyling,
        disabledStyling,
        noRingStyling,
        props.className
      )}
      {...remainingProps}
    >
      {children}
    </HeadlessUiButton>
  );
}
