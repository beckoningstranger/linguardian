"use client";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Flag from "react-world-flags";

import { useUser } from "@/context/UserContext";
import {
    AlternativeAnswers,
    SupportedLanguage,
} from "@linguardian/shared/contracts";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import MinusIcon from "./MinusIcon";
import TinyLanguagePicker from "./TinyLanguagePicker";

interface AlternativeAnswerFieldProps {
    languageCode: SupportedLanguage;
    flagCode: string;
    alternativeAnswer: string;
    setAlternativeAnswers: Dispatch<SetStateAction<AlternativeAnswers>>;
    itemLanguage: SupportedLanguage;
}

export default function AlternativeAnswerField({
    languageCode,
    flagCode,
    alternativeAnswer,
    setAlternativeAnswers,
    itemLanguage,
}: AlternativeAnswerFieldProps) {
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

    const ref = useOutsideClick(() => setShowLanguagePicker(false));

    const handleSetNewHelper = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setAlternativeAnswers((prev) => {
            const currentForLang = (prev || {})[languageCode] ?? [];
            const index = currentForLang.indexOf(alternativeAnswer);
            if (index === -1) {
                // if not found, just append (or you could ignore)
                return {
                    ...prev,
                    [languageCode]: [...currentForLang, newValue],
                };
            }

            const updatedForLang = [...currentForLang];
            updatedForLang[index] = newValue;

            return {
                ...prev,
                [languageCode]: updatedForLang,
            };
        });
    };

    const handleSetNewLanguage = (lang: SupportedLanguage) => {
        setAlternativeAnswers((prev) => {
            if (!prev || !prev[languageCode]) return;

            return {
                ...prev,
                [languageCode]: prev[languageCode].filter(
                    (helper) => helper !== alternativeAnswer
                ),
                [lang]: [...(prev[lang] ?? []), alternativeAnswer],
            };
        });
    };

    function removeAlternativeAnswer(
        helperToRemove: string,
        language: SupportedLanguage
    ) {
        setAlternativeAnswers((prev) => {
            const current = (prev || {})[language] ?? [];
            const updatedForLanguage = current.filter(
                (helper) => helper !== helperToRemove
            );

            return {
                ...prev,
                [language]: updatedForLanguage,
            };
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
                id={`${languageCode}-${alternativeAnswer}`}
                type="text"
                placeholder="Enter an alternative answer"
                className="h-full w-[200px] px-1"
                value={alternativeAnswer}
                onChange={handleSetNewHelper}
            />

            <MinusIcon
                onClick={() =>
                    removeAlternativeAnswer(alternativeAnswer, languageCode)
                }
            />
        </div>
    );
}
