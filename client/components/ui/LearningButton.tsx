import { cn } from "@/lib/helperFunctionsClient";
import learningButtonConfig from "@/lib/learningButtonConfig";
import paths from "@/lib/paths";
import { LearningMode } from "@/lib/types";
import { Button as HeadLessUiButton } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

interface LearningButtonProps {
  mode: LearningMode;
  itemNumber: number;
  listNumber: number;
  showExpand?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  global?: boolean;
}
export default function LearningButton({
  mode,
  itemNumber,
  listNumber,
  showExpand = false,
  showIcon = false,
  showLabel = false,
  disabled = false,
  rounded = false,
  global = false,
}: LearningButtonProps) {
  const buttonConfig = learningButtonConfig.find(
    (config) => config.name === mode
  );

  return (
    <div
      className={cn(
        buttonConfig?.color,
        buttonConfig?.hoverColor,
        "flex flex-1 h-[90px] transition-colors duration-200 ease-in-out",
        disabled && "bg-grey-600",
        rounded && "rounded-md"
      )}
    >
      <Link
        href={paths.learnListPath(mode, listNumber)}
        className="flex w-full"
      >
        <HeadLessUiButton
          className="flex h-[90px] w-full items-center justify-center pl-1 font-playfair text-xl font-semibold text-white"
          disabled={disabled}
          aria-label={`Start a learning session in ${mode} mode`}
        >
          {showIcon && (
            <Image
              src={buttonConfig?.iconPath || ""}
              width={showExpand ? 60 : 80}
              height={showExpand ? 60 : 80}
              alt={buttonConfig?.label + " icon"}
            />
          )}
          {showLabel && (
            <div
              className={`flex flex-1  flex-col ${
                !showIcon && showExpand ? "pl-6" : ""
              }`}
            >
              <h4>
                {global ? buttonConfig?.globalLabel : buttonConfig?.label}
              </h4>
              <h4>{" (" + itemNumber + " left)"}</h4>
            </div>
          )}
        </HeadLessUiButton>
      </Link>
    </div>
  );
}
