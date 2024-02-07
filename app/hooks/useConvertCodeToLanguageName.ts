"use client";

import { useContext } from "react";
import { GlobalContext, SupportedLanguage } from "../context/GlobalContext";

export default function useConvertCodeToLanguageName(code: SupportedLanguage) {
  const { languageFeatures } = useContext(GlobalContext);

  const languageName = languageFeatures.map((lang) => {
    if (lang.code === code) {
      return lang.name;
    }
  });

  return languageName.join("");
}
