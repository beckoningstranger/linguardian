"use client";

import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

import StyledInput from "@/components/Forms/StyledInput";
import {
  AlternativeAnswers,
  SupportedLanguage,
} from "@linguardian/shared/contracts";
import { cn, getFlagCodeFromLangCode } from "@/lib/utils";
import Flag from "react-world-flags";

interface EnterAlternativeAnswerMobileProps {
    languages: SupportedLanguage[];
    closeMobileMenu: () => void;
    setAlternativeAnswers: Dispatch<SetStateAction<AlternativeAnswers>>;
}

export default function EnterAlternativeAnswerMobile({
    languages,
    closeMobileMenu,
    setAlternativeAnswers,
}: EnterAlternativeAnswerMobileProps) {
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
                [selectedLanguage]: [
                    ...(prev[selectedLanguage] || []),
                    trimmed,
                ],
            };
        });

        closeMobileMenu();
    }

    return (
        <div className="relative flex grow flex-col gap-y-4 px-4 py-4">
            <h2 className="text-clgm font-semibold">
                Add a new alternative answer
            </h2>
            <div className="flex gap-8">
                {languages.map((lang) => (
                    <Flag
                        className={cn(
                            "size-12 rounded-full object-cover drop-shadow-md",
                            selectedLanguage === lang
                                ? "scale-125"
                                : "grayscale "
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
            <div className="relative mt-6 flex w-full flex-col gap-2">
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
                {error && (
                    <div className="pl-2 text-csmr text-red-500">{error}</div>
                )}
            </div>
            <div className="absolute inset-x-2 bottom-2 flex flex-col gap-3">
                <button
                    className="h-16 rounded-md bg-red-500 py-2 text-white hover:ring-2 hover:ring-red-500 hover:ring-offset-2"
                    onClick={() => closeMobileMenu()}
                >
                    Cancel
                </button>
                <button
                    disabled={!!error}
                    className="h-16 rounded-md bg-green-400 py-2 text-white hover:ring-2 hover:ring-green-400 hover:ring-offset-2 disabled:bg-grey-500 disabled:ring-0"
                    onClick={handleBlur}
                >
                    Add alternative answer
                </button>
            </div>
        </div>
    );
}
