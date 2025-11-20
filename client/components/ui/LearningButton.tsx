import { Button as HeadLessUiButton } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

import { LearningModeWithInfo, SupportedLanguage } from "@/lib/contracts";
import learningButtonConfig from "@/lib/learningButtonConfig";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

interface LearningButtonProps {
  modeWithInfo: LearningModeWithInfo;
  listNumber?: number;
  langCode?: SupportedLanguage;
  unitNumber?: number;
  usedWithExpandButton?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  global?: boolean;
  from: "dashboard" | number;
}
export default function LearningButton({
  modeWithInfo,
  unitNumber,
  listNumber,
  langCode,
  usedWithExpandButton = false,
  showIcon = false,
  showLabel = false,
  disabled = false,
  rounded = false,
  global = false,
  from,
}: LearningButtonProps) {
  const buttonConfig = learningButtonConfig.find(
    (config) => config.name === modeWithInfo.mode
  );

  const bgColor = "bg-" + buttonConfig?.color;
  const hoverColor = "hover:bg-" + buttonConfig?.hoverColor;
  const miniLabelBgColor = disabled
    ? "bg-grey-700"
    : "bg-" + buttonConfig?.hoverColor;

  const buttonLabel = (
    <h4 className="text-balance">
      <span>
        {global
          ? modeWithInfo.overstudy
            ? buttonConfig?.overstudyLabel
            : buttonConfig?.globalLabel
          : modeWithInfo.overstudy
          ? buttonConfig?.overstudyLabel
          : buttonConfig?.label}{" "}
      </span>
      <p className="font-serif">
        <span className="font-sans text-clgm">{modeWithInfo.info}</span>
        {modeWithInfo.mode !== "overstudy" && (
          <span>
            {!modeWithInfo.overstudy
              ? modeWithInfo.mode === "learn"
                ? " left"
                : " ready to review"
              : " items available"}
          </span>
        )}
      </p>
    </h4>
  );

  return (
    <Link
      href={
        global && langCode
          ? paths.reviewLanguagePath(modeWithInfo.mode, langCode) +
            `?from=${from}&overstudy=${modeWithInfo.overstudy}`
          : modeWithInfo.mode === "overstudy"
          ? "#"
          : unitNumber && listNumber
          ? paths.learnUnitPath(modeWithInfo.mode, listNumber, unitNumber) +
            `?from=${from}&overstudy=${modeWithInfo.overstudy}`
          : listNumber
          ? paths.learnListPath(modeWithInfo.mode, listNumber) +
            `?from=${from}&overstudy=${modeWithInfo.overstudy}`
          : "#"
      }
      data-label={buttonConfig?.label}
      className={cn(
        bgColor,
        hoverColor,
        "flex h-[90px] w-full overflow-hidden duration-800 ease-in-out transition-all",
        disabled &&
          "bg-grey-600 hover:bg-grey-600 pointer-events-none cursor-not-allowed",
        rounded && "rounded-md",
        showIcon && !showLabel && "group w-[90px] hover:w-[378px]",
        global && "w-full tablet:max-w-[724px] desktop:max-w-[740px]"
      )}
    >
      {showIcon && !showLabel && (
        <HeadLessUiButton
          className={cn(
            "hidden group-hover:flex items-center justify-center px-1 text-white w-[378px]",
            global && "max-w-[600px]"
          )}
          aria-label={`Start a learning session in ${modeWithInfo.mode} mode`}
        >
          {!showLabel && modeWithInfo.mode !== "overstudy" && (
            <div
              id="miniLabel"
              className={cn(
                "text-sans absolute right-0 top-0 text-cmdb font-sans rounded-bl-lg px-2 group-hover:hidden",
                miniLabelBgColor
              )}
            >
              {modeWithInfo.info}
            </div>
          )}
          <Image
            src={buttonConfig?.iconPath || ""}
            width={usedWithExpandButton ? 60 : 80}
            height={usedWithExpandButton ? 60 : 80}
            alt={buttonConfig?.label + " icon"}
          />
          <div className="flex w-[378px] flex-col justify-center font-serif text-hsm">
            {buttonLabel}
          </div>
        </HeadLessUiButton>
      )}
      <HeadLessUiButton
        className={cn(
          "relative flex h-[90px] w-full items-center font-serif text-white"
        )}
        disabled={disabled}
        aria-label={`Start a learning session in ${modeWithInfo.mode} mode`}
      >
        {!showLabel && (
          <div
            id="miniLabel"
            className={cn(
              "text-sans absolute right-0 top-0 text-cmdb font-sans rounded-bl-lg px-2 group-hover:hidden",
              miniLabelBgColor
            )}
          >
            {modeWithInfo.info}
          </div>
        )}
        {showIcon && (
          <Image
            src={buttonConfig?.iconPath || ""}
            width={usedWithExpandButton ? 60 : 80}
            height={usedWithExpandButton ? 60 : 80}
            alt={buttonConfig?.label + " icon"}
          />
        )}
        {showLabel && (
          <div
            className={cn(
              "flex flex-1 flex-col text-hsm",
              !showIcon && usedWithExpandButton && "pl-6"
            )}
          >
            {buttonLabel}
          </div>
        )}
      </HeadLessUiButton>
    </Link>
  );
}
