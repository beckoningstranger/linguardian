"use client";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Flag from "react-world-flags";

import { useUser } from "@/context/UserContext";
import { PromptHelpers, SupportedLanguage } from "@/lib/contracts";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import MinusIcon from "./MinusIcon";
import TinyLanguagePicker from "./TinyLanguagePicker";

interface PromptHelperFieldProps {
    languageCode: SupportedLanguage;
    flagCode: string;
    promptHelper: string;
    setPromptHelpers: Dispatch<SetStateAction<PromptHelpers>>;
    itemLanguage: SupportedLanguage;
}

export default function PromptHelperField({
    languageCode,
    flagCode,
    promptHelper,
    setPromptHelpers,
    itemLanguage,
}: PromptHelperFieldProps) {
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);

    const { user } = useUser();
    if (!user) throw new Error("User not found");
    const allUserLanguageCodes = [user.native, ...user.learnedLanguages].map(
        (lang) => lang.code
    );
    const languageWOitemLanguageAndCurrentLanguage =
        allUserLanguageCodes.filter(
            (lang) => lang !== itemLanguage && lang !== languageCode
        );


    const handleSetNewHelper = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPromptHelpers((prev) => {
            return {
                ...prev,
                [languageCode]: newValue,
            };
        });
    };

    const handleSetNewLanguage = (lang: SupportedLanguage) => {
        setPromptHelpers((prev) => {
            if (!prev || !prev[languageCode]) return prev;

            return {
                ...prev,
                [languageCode]: undefined,
                [lang]: promptHelper,
            };
        });
    };

    function removePromptHelper(language: SupportedLanguage) {
        setPromptHelpers((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated[language];
            return updated;
        });
    }

    if (showLanguagePicker)
        return (
            <TinyLanguagePicker
                languages={languageWOitemLanguageAndCurrentLanguage}
                onClick={handleSetNewLanguage}
                setShowLanguagePicker={setShowLanguagePicker}
            />
        );

    return (
        <div className="relative flex w-[300px] items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-md">
            <Flag
                code={flagCode}
                className="size-6 rounded-full object-cover"
                onClick={() => {
                    languageWOitemLanguageAndCurrentLanguage.length < 2
                        ? handleSetNewLanguage(
                              languageWOitemLanguageAndCurrentLanguage[0]
                          )
                        : setShowLanguagePicker((prev) => !prev);
                }}
            />

            <input
                id={`${languageCode}-${promptHelper}`}
                type="text"
                placeholder="Enter a prompt helper"
                className="h-full w-[200px] px-1"
                value={promptHelper}
                onChange={handleSetNewHelper}
            />

            <MinusIcon
                onClick={() => removePromptHelper(languageCode)}
            />
        </div>
    );
}
