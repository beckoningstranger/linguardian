"use client";

import { setNativeLanguage } from "@/app/actions";
import { LanguageFeatures, SupportedLanguage } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Flag from "react-world-flags";

interface NativeLanguageFormProps {
  supportedLanguages: SupportedLanguage[];
  allLanguageFeatures: LanguageFeatures[];
}

export default function NativeLanguageForm({
  supportedLanguages,
  allLanguageFeatures,
}: NativeLanguageFormProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>();
  const { data: session } = useSession();
  const userId: number = session?.user.id;

  const langData = allLanguageFeatures
    .filter((language) => language.langCode === selectedLanguage)
    .find((x) => x);
  const selectedLanguageName = langData?.langName;

  const renderedFlags = supportedLanguages?.map((lang) => {
    const languageFeatures = allLanguageFeatures
      .filter((language) => language.langCode === lang)
      .find((x) => x);

    return (
      <Flag
        code={languageFeatures?.flagCode}
        className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125 ${
          selectedLanguage === languageFeatures?.langCode && "scale-125"
        } ${
          selectedLanguage &&
          selectedLanguage !== languageFeatures?.langCode &&
          "scale-75"
        } 
        `}
        key={languageFeatures?.flagCode}
        onClick={() => setSelectedLanguage(languageFeatures?.langCode)}
      />
    );
  });

  const setNativeLanguageForUser = setNativeLanguage.bind(null, {
    language: selectedLanguage as SupportedLanguage,
    userId: userId,
  });

  return (
    <div className="grid h-screen place-items-center transition-all">
      <div className="mx-5 grid grid-cols-2 justify-around gap-5">
        {renderedFlags}
      </div>
      {selectedLanguage && (
        <form action={setNativeLanguageForUser}>
          <button className="rounded-md bg-green-500 p-6 text-white transition-all hover:scale-125">
            I am a native speaker of {selectedLanguageName}
          </button>
        </form>
      )}
    </div>
  );
}
