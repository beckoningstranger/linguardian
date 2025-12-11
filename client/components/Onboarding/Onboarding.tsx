"use client";

import { ListboxOption } from "@headlessui/react";
import { MouseEventHandler, useState } from "react";
import Flag from "react-world-flags";

import LanguagePicker from "@/components/Onboarding/LanguagePicker";
import OnboardingSubmitButton from "@/components/Onboarding/OnboardingSubmitButton";
import { LanguageWithFlagAndName } from "@/lib/contracts";
import { allLanguageFeatures } from "@/lib/siteSettings";

export default function Onboarding() {
  const [userNative, setUserNative] = useState<LanguageWithFlagAndName | null>(
    null
  );
  const [languageToLearn, setLanguageToLearn] =
    useState<LanguageWithFlagAndName | null>(null);
  const [step, setStep] = useState<number>(1);

  const allLanguagesAndFlags: LanguageWithFlagAndName[] =
    allLanguageFeatures.map((lang) => ({
      code: lang.langCode,
      flag: lang.flagCode,
      name: lang.langName,
    }));
  const allLanguagesExceptPickedNative: LanguageWithFlagAndName[] =
    allLanguagesAndFlags.filter((lang) => lang.code !== userNative?.code);

  const allLanguagesAndFlagsExceptPicked: LanguageWithFlagAndName[] =
    allLanguagesAndFlags.filter(
      (lang) =>
        lang.code !== userNative?.code && lang.code !== languageToLearn?.code
    );

  const allLanguageOptions = allLanguagesExceptPickedNative.map((item) =>
    menuItemWithFlag(item, () => {
      setUserNative(item);
      if (languageToLearn?.code === item.code) setLanguageToLearn(null);
      if (step < 2) setStep(2);
    })
  );
  const allLanguageOptionsExceptPicked = allLanguagesAndFlagsExceptPicked.map(
    (item) =>
      menuItemWithFlag(item, () => {
        setLanguageToLearn(item);
        setStep(3);
      })
  );

  return (
    <div className="flex h-full flex-col gap-2 px-2">
      {step >= 1 && (
        <LanguagePicker
          allOptions={allLanguageOptions}
          initialString="Select your native language"
          languageObject={userNative}
          pickedString={`My native language is ${userNative?.name}`}
        />
      )}
      {step >= 2 && (
        <LanguagePicker
          allOptions={allLanguageOptionsExceptPicked}
          initialString="Select a language to learn"
          languageObject={languageToLearn}
          pickedString={`I want to learn ${languageToLearn?.name}`}
        />
      )}

      {step === 3 && userNative && languageToLearn && (
        <div className="h-16 rounded-lg bg-green-50 hover:shadow-lg active:translate-y-1 active:scale-95">
          <OnboardingSubmitButton
            userNative={userNative}
            languageToLearn={languageToLearn}
          />
        </div>
      )}
    </div>
  );

  function menuItemWithFlag(item: LanguageWithFlagAndName, onclick: Function) {
    return (
      <ListboxOption key={item.name} value={item}>
        {({ focus }) => (
          <div
            className={`${
              focus && "bg-white"
            } text-center flex items-center gap-4 rounded-md px-3 py-2`}
            onClick={onclick as MouseEventHandler}
          >
            <Flag
              code={item.flag}
              key={item.name}
              className="my-2 h-12 w-12 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110"
            />
            <div className="pl-4">{item.name}</div>
          </div>
        )}
      </ListboxOption>
    );
  }
}
