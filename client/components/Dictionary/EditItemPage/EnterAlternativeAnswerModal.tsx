"use client";

import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

import StyledInput from "@/components/Forms/StyledInput";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { createPortal } from "react-dom";
import { AlternativeAnswers, SupportedLanguage } from "@/lib/contracts";
import Flag from "react-world-flags";
import { cn, getFlagCodeFromLangCode } from "@/lib/utils";

interface EnterAlternativeAnswerModalProps {
  languages: SupportedLanguage[];
  closeModal: () => void;
  setAlternativeAnswers: Dispatch<SetStateAction<AlternativeAnswers>>;
}

export default function EnterAlternativeAnswerModal({
  languages,
  closeModal,
  setAlternativeAnswers,
}: EnterAlternativeAnswerModalProps) {
  const modalRef = useOutsideClick(handleBlur);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newAA, setNewAA] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    languages[0]
  );
  const [error, setError] = useState<string | null>(null);

  const validateInput = (value: string): string | null => {
    if (value.length < 1) return null;
    const ONLY_LETTERS_AND_SPACES_REGEX = /^[\p{L} ]+$/u;

    const trimmed = value.trim();

    if (trimmed.length > 40) return "Maximum length is 40 characters";

    if (!ONLY_LETTERS_AND_SPACES_REGEX.test(trimmed))
      return "Only letters are allowed";

    return null;
  };

  function handleBlur() {
    const errorMsg = validateInput(newAA);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setAlternativeAnswers((prev) => {
      const trimmed = newAA.trim();
      if (!trimmed || trimmed.length < 1) return prev;
      if (!prev) return { [selectedLanguage]: [trimmed] };
      return {
        ...prev,
        [selectedLanguage]: [...(prev[selectedLanguage] || []), trimmed],
      };
    });

    closeModal();
  }

  return createPortal(
    <div
      ref={modalRef as RefObject<HTMLDivElement>}
      className="fixed inset-x-16 top-1/2 z-50 flex min-w-[300px] -translate-y-1/2 flex-col gap-y-4 rounded-md border border-gray-700 bg-white px-8 py-4 drop-shadow-lg desktop:inset-x-32 desktopxl:inset-x-64"
    >
      <h2 className="text-cxlr font-semibold">Add a new alternative answer</h2>
      <div className="flex gap-8">
        {languages.map((lang) => (
          <Flag
            className={cn(
              "size-12 rounded-full object-cover drop-shadow-md",
              selectedLanguage === lang ? "scale-125" : "grayscale "
            )}
            key={lang}
            code={getFlagCodeFromLangCode(lang)}
            onClick={() => {
              setSelectedLanguage(lang);
              inputRef.current?.focus();
            }}
          />
        ))}
      </div>
      <div className="relative mt-6 flex w-[45ch] flex-col gap-2">
        <StyledInput
          ref={inputRef as RefObject<HTMLInputElement>}
          label="Enter a new alternative answer"
          type="text"
          placeholder="Enter a new alternative answer"
          spellCheck={false}
          id="newAlternativeAnswer"
          name="newAlternativeAnswer"
          onChange={(e) => {
            const value = e.target.value;

            setNewAA(value);
            setError(validateInput(value));
          }}
          value={newAA}
          autoFocus={newAA === ""}
          onKeyDown={(e) => {
            switch (e.key) {
              case "Escape":
              case "Enter":
              case "Tab":
                handleBlur();
            }
          }}
          maxLength={40}
          pattern="/^[\p{L} ]+$/u"
        />
        {error && <div className="pl-2 text-csmr text-red-500">{error}</div>}
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <button
          className="rounded-md bg-red-500 py-2 text-white hover:ring-2 hover:ring-red-500 hover:ring-offset-2"
          onClick={() => closeModal()}
        >
          Cancel
        </button>
        <button
          disabled={!!error}
          className="rounded-md bg-green-400 py-2 text-white hover:ring-2 hover:ring-green-400 hover:ring-offset-2 disabled:bg-grey-500 disabled:ring-0"
          onClick={handleBlur}
        >
          Add alternative answer
        </button>
      </div>
    </div>,
    document.body
  );
}
