"use client";

import { cn } from "@/lib/helperFunctionsClient";
import learningButtonConfig from "@/lib/learningButtonConfig";
import paths from "@/lib/paths";
import { LearningMode } from "@/lib/types";
import { Button as HeadLessUiButton } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  const [iconButtonHovered, setIconButtonHovered] = useState(false);

  const bgColor = "bg-" + buttonConfig?.color;
  const hoverColor = "hover:bg-" + buttonConfig?.hoverColor;
  const miniLabelBgColor = "bg-" + buttonConfig?.hoverColor;

  const handleMouseOver = () => {
    if (showIcon && !showLabel) setIconButtonHovered((prev) => !prev);
  };

  return (
    <div
      data-label={buttonConfig?.label}
      className={cn(
        bgColor,
        hoverColor,
        "flex h-[90px] overflow-hidden duration-800 ease-in-out transition-all text-hsm",
        showIcon && !showLabel && "w-[90px]",
        disabled && "bg-grey-600 hover:bg-grey-600",
        rounded && "rounded-md",
        iconButtonHovered && "w-[378px]"
      )}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
    >
      <Link
        href={paths.learnListPath(mode, listNumber)}
        className="flex w-full"
      >
        {iconButtonHovered ? (
          <HeadLessUiButton
            className={cn("flex items-center justify-center px-1 text-white")}
            aria-label={`Start a learning session in ${mode} mode`}
          >
            <Image
              src={buttonConfig?.iconPath || ""}
              width={showExpand ? 60 : 80}
              height={showExpand ? 60 : 80}
              alt={buttonConfig?.label + " icon"}
            />
            <div className="flex w-[378px] flex-col justify-center font-serif text-hsm">
              <h4>{buttonConfig?.label}</h4>
              <h4>({itemNumber} left)</h4>
            </div>
          </HeadLessUiButton>
        ) : (
          <HeadLessUiButton
            className={cn(
              "relative flex h-[90px] w-full items-center justify-center px-1 font-serif text-hsm text-white"
            )}
            disabled={disabled}
            aria-label={`Start a learning session in ${mode} mode`}
          >
            {iconButtonHovered ? (
              <>
                <Image
                  src={buttonConfig?.iconPath || ""}
                  width={showExpand ? 60 : 80}
                  height={showExpand ? 60 : 80}
                  alt={buttonConfig?.label + " icon"}
                />
                <div className="flex h-[90px] w-[378px] flex-col justify-center font-serif text-hsm">
                  <h4>{buttonConfig?.label}</h4>
                  <h4>({itemNumber} left)</h4>
                </div>
              </>
            ) : (
              <>
                {!showLabel && (
                  <div
                    className={cn(
                      "text-sans absolute right-0 top-0 text-cmdb font-sans rounded-bl-lg px-2",
                      miniLabelBgColor
                    )}
                  >
                    {itemNumber}
                  </div>
                )}
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
                    className={`flex flex-1 flex-col ${
                      !showIcon && showExpand ? "pl-6" : ""
                    }`}
                  >
                    <h4>
                      {global ? buttonConfig?.globalLabel : buttonConfig?.label}
                    </h4>
                    {!disabled && <h4>{" (" + itemNumber + " left)"}</h4>}
                  </div>
                )}
              </>
            )}
          </HeadLessUiButton>
        )}
      </Link>
    </div>
  );
}
