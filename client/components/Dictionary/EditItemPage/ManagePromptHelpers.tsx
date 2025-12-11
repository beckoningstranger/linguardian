"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { FormErrors } from "@/components";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUser } from "@/context/UserContext";
import {
    PromptHelpers,
    ItemWithPopulatedTranslations,
    SupportedLanguage,
} from "@/lib/contracts";
import { getFlagCodeFromLangCode } from "@/lib/utils";
import PromptHelperField from "./PromptHelperField";
import EnterPromptHelperModal from "./EnterPromptHelperModal";
import EnterPromptHelperMobile from "./EnterPromptHelperMobile";

export default function ManagePromptHelpers() {
    const label = {
        singular: "Prompt Helper",
        plural: "Prompt Helpers",
    };

    const { openMobileMenu, closeMobileMenu } = useMobileMenu();

    const { user } = useUser();
    if (!user) throw new Error("User not found");

    const allUserLanguageCodes = [user.native, ...user.learnedLanguages].map(
        (lang) => lang.code
    );

    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext<ItemWithPopulatedTranslations>();

    const {
        field: { onChange, value },
    } = useController({
        name: "promptHelpers",
        control,
    });
    const allUserLanguageCodesExceptItemLanguage = allUserLanguageCodes.filter(
        (lang) => lang !== watch("language")
    );

    const [promptHelpers, setPromptHelpers] =
        useState<PromptHelpers>(value);

    const [showModal, setShowModal] = useState(false);

    const visiblePromptHelpers = Object.fromEntries(
        Object.entries(promptHelpers || {}).filter(([code]) =>
            allUserLanguageCodes.includes(code as SupportedLanguage)
        )
    );
    // Check if all visible languages already have prompt helpers
    const allLanguagesHavePromptHelpers = allUserLanguageCodesExceptItemLanguage.every(
        (lang) => promptHelpers?.[lang]
    );
    useEffect(() => {
        onChange(promptHelpers);
    }, [promptHelpers, onChange]);

    return (
        <div id="promptHelpers">
            {showModal && (
                <EnterPromptHelperModal
                    languages={allUserLanguageCodesExceptItemLanguage}
                    closeModal={() => setShowModal(false)}
                    setPromptHelpers={setPromptHelpers}
                    promptHelpers={promptHelpers}
                />
            )}
            <div className="flex flex-col gap-2 text-sm">
                <>
                    {/* Desktop Button triggers modal */}
                    <Button
                        className="hidden gap-1 text-cmdb tablet:flex disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setShowModal(true)}
                        disabled={allLanguagesHavePromptHelpers}
                    >
                        <p className="font-semibold capitalize">
                            {Object.keys(promptHelpers || {}).length === 1 ? (
                                <span>{label.singular}</span>
                            ) : (
                                <span>{label.plural}</span>
                            )}
                        </p>
                        <PlusCircleIcon className="size-5 text-green-400" />
                    </Button>
                    {/* Mobile Button trigger pull down menu*/}
                    <Button
                        className="flex gap-1 tablet:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                            openMobileMenu(
                                <EnterPromptHelperMobile
                                    languages={
                                        allUserLanguageCodesExceptItemLanguage
                                    }
                                    closeMobileMenu={closeMobileMenu}
                                    promptHelpers={promptHelpers}
                                    setPromptHelpers={
                                        setPromptHelpers
                                    }
                                />
                            )
                        }
                        disabled={allLanguagesHavePromptHelpers}
                    >
                        <p className="font-semibold capitalize">
                            {Object.keys(promptHelpers || {}).length === 1 ? (
                                <span>{label.singular}</span>
                            ) : (
                                <span>{label.plural}</span>
                            )}
                        </p>
                        <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
                    </Button>
                </>
                <div className="flex flex-col gap-2">
                    {Object.entries(visiblePromptHelpers).map(
                        ([language, promptHelpersForLanguage]) => {
                            const langCode = language as SupportedLanguage;
                            const flagCode = getFlagCodeFromLangCode(langCode);

                            return (
                                <div
                                    key={language}
                                    className="flex flex-wrap gap-2"
                                >
                                    <PromptHelperField
                                        languageCode={langCode}
                                        promptHelper={promptHelpersForLanguage}
                                        flagCode={flagCode}
                                        setPromptHelpers={setPromptHelpers}
                                        itemLanguage={watch("language")}
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            <FormErrors field="promptHelpers" errors={errors} />
        </div>
    );
}
