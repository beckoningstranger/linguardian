import Link from "next/link";
import Image from "next/image";
import { Button as HeadLessUiButton } from "@headlessui/react";

import learningButtonConfig from "@/lib/learningButtonConfig";
import paths from "@/lib/paths";
import { cn } from "@/lib/helperFunctionsClient";
import { LearningMode } from "@/lib/types";

interface LearningButtonProps {
  mode: LearningMode;
  itemNumber: number;
  listNumber: number;
  unitNumber?: number;
  showExpand?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  global?: boolean;
  from: "dashboard" | number;
}
export default function LearningButton({
  mode,
  itemNumber,
  unitNumber,
  listNumber,
  showExpand = false,
  showIcon = false,
  showLabel = false,
  disabled = false,
  rounded = false,
  global = false,
  from,
}: LearningButtonProps) {
  const buttonConfig = learningButtonConfig.find(
    (config) => config.name === mode
  );

  const bgColor = "bg-" + buttonConfig?.color;
  const hoverColor = "hover:bg-" + buttonConfig?.hoverColor;
  const miniLabelBgColor = disabled
    ? "bg-grey-700"
    : "bg-" + buttonConfig?.hoverColor;

  return (
    <Link
      href={
        unitNumber
          ? paths.learnUnitPath(mode, listNumber, unitNumber) + `?from=${from}`
          : paths.learnListPath(mode, listNumber) + `?from=${from}`
      }
      data-label={buttonConfig?.label}
      className={cn(
        bgColor,
        hoverColor,
        "flex h-[90px] w-full overflow-hidden duration-800 ease-in-out transition-all",
        disabled &&
          "bg-grey-600 hover:bg-grey-600 pointer-events-none cursor-not-allowed",
        rounded && "rounded-md",
        showIcon && !showLabel && "group w-[90px] hover:w-[378px]"
      )}
    >
      {showIcon && !showLabel && (
        <HeadLessUiButton
          className={cn(
            "hidden group-hover:flex items-center justify-center px-1 text-white w-[378px]"
          )}
          aria-label={`Start a learning session in ${mode} mode`}
        >
          <Image
            src={buttonConfig?.iconPath || ""}
            width={showExpand || from === "dashboard" ? 60 : 80}
            height={showExpand || from === "dashboard" ? 60 : 80}
            alt={buttonConfig?.label + " icon"}
          />
          <div className="flex w-[378px] flex-col justify-center font-serif text-hsm">
            <h4>{buttonConfig?.label}</h4>
            <h4>
              ({itemNumber} {mode === "learn" ? "left" : "ready to review"})
            </h4>
          </div>
        </HeadLessUiButton>
      )}
      <HeadLessUiButton
        className={cn(
          "relative flex h-[90px] w-full items-center justify-center px-1 font-serif text-white"
        )}
        disabled={disabled}
        aria-label={`Start a learning session in ${mode} mode`}
      >
        {!showLabel && (
          <div
            id="miniLabel"
            className={cn(
              "text-sans absolute right-0 top-0 text-cmdb font-sans rounded-bl-lg px-2 group-hover:hidden",
              miniLabelBgColor
            )}
          >
            {itemNumber}
          </div>
        )}
        {showIcon && (
          <Image
            src={buttonConfig?.iconPath || ""}
            width={showExpand || from === "dashboard" ? 60 : 80}
            height={showExpand || from === "dashboard" ? 60 : 80}
            alt={buttonConfig?.label + " icon"}
          />
        )}
        {showLabel && (
          <div
            className={`flex flex-1 flex-col text-hsm ${
              !showIcon && showExpand ? "pl-6" : ""
            }`}
          >
            <h4>{global ? buttonConfig?.globalLabel : buttonConfig?.label}</h4>
            {!disabled && <h4>{" (" + itemNumber + " left)"}</h4>}
          </div>
        )}
      </HeadLessUiButton>
    </Link>
  );
}
