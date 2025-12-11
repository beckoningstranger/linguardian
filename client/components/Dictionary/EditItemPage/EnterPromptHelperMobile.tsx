"use client";

import { Dispatch, RefObject, SetStateAction, useRef, useState, useEffect } from "react";

import StyledInput from "@/components/Forms/StyledInput";
import { PromptHelpers, SupportedLanguage } from "@/lib/contracts";
import { cn, getFlagCodeFromLangCode } from "@/lib/utils";
import Flag from "react-world-flags";

interface EnterPromptHelperMobileProps {
    promptHelpers?: PromptHelpers;
    languages: SupportedLanguage[];
    closeMobileMenu: () => void;
    setPromptHelpers: Dispatch<SetStateAction<PromptHelpers>>;
}
export default function EnterPromptHelperMobile({
    languages,
    closeMobileMenu,
    setPromptHelpers,
    promptHelpers,
}: EnterPromptHelperMobileProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
        languages[0]
    );
    const [newPH, setNewPH] = useState(
        promptHelpers?.[selectedLanguage] || ""
    );
    const [error, setError] = useState<string | null>(null);

    // Update input when selected language changes
    useEffect(() => {
        setNewPH(promptHelpers?.[selectedLanguage] || "");
        setError(null);
    }, [selectedLanguage, promptHelpers]);
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
        const errorMsg = validateInput(newPH);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        setPromptHelpers((prev) => {
            const trimmed = newPH.trim();
            if (!trimmed || trimmed.length < 1) return prev;
            return {
                ...prev,
                [selectedLanguage]: trimmed,
            };
        });

        closeMobileMenu();
    }

    return (
        <div className="relative flex grow flex-col gap-y-4 px-4 py-4">
            <h2 className="text-clgm font-semibold">
                Add a new prompt helper
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
                            // Pre-fill with existing value if it exists
                            setNewPH(promptHelpers?.[lang] || "");
                        }}
                    />
                ))}
            </div>
            <div className="relative mt-6 flex w-full flex-col gap-2">
                <StyledInput
                    ref={inputRef as RefObject<HTMLInputElement>}
                    label="Enter a new prompt helper"
                    type="text"
                    placeholder="Enter a new prompt helper"
                    spellCheck={false}
                    id="newPromptHelper"
                    name="newPromptHelper"
                    onChange={(e) => {
                        const value = e.target.value;

                        setNewPH(value);
                        setError(validateInput(value));
                    }}
                    value={newPH}
                    autoFocus={newPH === ""}
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
                    Add prompt helper
                </button>
            </div>
        </div>
    );
}
