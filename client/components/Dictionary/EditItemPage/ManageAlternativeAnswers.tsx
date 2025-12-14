"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import FormErrors from "@/components/Forms/FormErrors";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useUser } from "@/context/UserContext";
import {
    AlternativeAnswers,
    ItemWithPopulatedTranslations,
    SupportedLanguage,
} from "@linguardian/shared/contracts";
import { getFlagCodeFromLangCode } from "@/lib/utils";
import AlternativeAnswerField from "./AlternativeAnswerField";
import EnterAlternativeAnswerModal from "./EnterAlternativeAnswerModal";
import EnterAlternativeAnswerMobile from "./EnterAlternativeAnswersMobile";

export default function ManageAlternativeAnswers() {
    const label = {
        singular: "Alternative Answer",
        plural: "Alternative Answers",
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
        name: "alternativeAnswers",
        control,
    });
    const allUserLanguageCodesExceptItemLanguage = allUserLanguageCodes.filter(
        (lang) => lang !== watch("language")
    );

    const [alternativeAnswers, setAlternativeAnswers] =
        useState<AlternativeAnswers>(value);

    const [showModal, setShowModal] = useState(false);

    const visibleAlternativeAnswers = Object.fromEntries(
        Object.entries(alternativeAnswers || {}).filter(([code]) =>
            allUserLanguageCodes.includes(code as SupportedLanguage)
        )
    );
    useEffect(() => {
        onChange(alternativeAnswers);
    }, [alternativeAnswers, onChange]);

    return (
        <div id="alternativeAnswers">
            {showModal && (
                <EnterAlternativeAnswerModal
                    languages={allUserLanguageCodesExceptItemLanguage}
                    closeModal={() => setShowModal(false)}
                    setAlternativeAnswers={setAlternativeAnswers}
                />
            )}
            <div className="flex flex-col gap-2 text-sm">
                <>
                    {/* Desktop Button triggers modal */}
                    <Button
                        className="hidden gap-1 text-cmdb tablet:flex"
                        onClick={() => setShowModal(true)}
                    >
                        <p className="font-semibold capitalize">
                            {Object.values(alternativeAnswers || {}).flat()
                                .length === 1 ? (
                                <span>{label.singular}</span>
                            ) : (
                                <span>{label.plural}</span>
                            )}
                        </p>
                        <PlusCircleIcon className="size-5 text-green-400" />
                    </Button>
                    {/* Mobile Button trigger pull down menu*/}
                    <Button
                        className="flex gap-1 tablet:hidden"
                        onClick={() =>
                            openMobileMenu(
                                <EnterAlternativeAnswerMobile
                                    languages={
                                        allUserLanguageCodesExceptItemLanguage
                                    }
                                    closeMobileMenu={closeMobileMenu}
                                    setAlternativeAnswers={
                                        setAlternativeAnswers
                                    }
                                />
                            )
                        }
                    >
                        <p className="font-semibold capitalize">
                            {Object.values(alternativeAnswers || {}).flat()
                                .length === 1 ? (
                                <span>{label.singular}</span>
                            ) : (
                                <span>{label.plural}</span>
                            )}
                        </p>
                        <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
                    </Button>
                </>
                <div className="flex flex-col gap-2">
                    {Object.entries(visibleAlternativeAnswers).map(
                        ([language, alternativeAnswersForLanguage]) => {
                            const langCode = language as SupportedLanguage;
                            const flagCode = getFlagCodeFromLangCode(langCode);

                            return (
                                <div
                                    key={language}
                                    className="flex flex-wrap gap-2"
                                >
                                    {alternativeAnswersForLanguage.map(
                                        (alternativeAnswer, index) => (
                                            <AlternativeAnswerField
                                                key={`${language}-${index}`}
                                                languageCode={langCode}
                                                alternativeAnswer={
                                                    alternativeAnswer
                                                }
                                                flagCode={flagCode}
                                                setAlternativeAnswers={
                                                    setAlternativeAnswers
                                                }
                                                itemLanguage={watch("language")}
                                            />
                                        )
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            <FormErrors field="alternativeAnswers" errors={errors} />
        </div>
    );
}
