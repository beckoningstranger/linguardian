"use client";

import { useMemo } from "react";
import { Button } from "@headlessui/react";

import { cn } from "@/lib/utils";
import { Gender, GrammaticalCase } from "@/lib/contracts";

type CaseGenderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  mode: Gender | GrammaticalCase;
};

export default function CaseGenderButton({
  mode,
  onClick,
}: CaseGenderButtonProps) {
  const userIsOnMobileDevice = useMemo(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    []
  );

  const config: {
    [key in Gender | GrammaticalCase]: {
      beginning?: string;
      key: string;
      end: string;
      textColor?: string;
      accentColor?: string;
      bgColor?: string;
    };
  } = {
    // Gender
    masculine: {
      key: "m",
      end: "asculine",
      bgColor: "bg-blue-500",
    },
    feminine: {
      key: "f",
      end: "eminine",
      bgColor: "bg-pink-400",
    },
    neuter: { key: "n", end: "euter" },
    animate: { key: "a", end: "nimate" },
    inanimate: { key: "i", end: "nanimate" },
    common: { key: "c", end: "ommon" },
    // Cases
    accusative: { key: "a", end: "accusative" },
    "accusative & dative": {
      beginning: "accusative ",
      key: "&",
      end: " dative",
    },
    dative: { key: "d", end: "ative" },
    genitive: { key: "g", end: "enitive" },
    instrumental: { key: "i", end: "nstrumental" },
    nominative: { key: "n", end: "ominative" },
    locative: { key: "l", end: "ocative" },
    vocative: { key: "v", end: "ocative" },
  };

  return (
    <Button
      className={cn(
        "py-4 rounded-md text-clgm",
        config[mode].bgColor || "bg-grey-800"
      )}
      onClick={onClick}
    >
      <span className={config[mode].textColor || "text-white"}>
        <span>{config[mode].beginning}</span>
        <strong
          className={cn(
            config[mode].accentColor || "text-grey-100",
            !userIsOnMobileDevice && "underline"
          )}
        >
          {config[mode].key}
        </strong>
        <span>{config[mode].end}</span>
      </span>
    </Button>
  );
}
