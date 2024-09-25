"use client";

import paths from "@/lib/paths";
import { LanguageWithFlag, SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ActiveLanguageContext {
  activeLanguage: SupportedLanguage;
  setActiveLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
}

const ActiveLanguageContext = createContext<ActiveLanguageContext>({
  activeLanguage: "FR",
  setActiveLanguage: () => {},
});

export const ActiveLanguageProvider = ({ children }: PropsWithChildren) => {
  const { data, status } = useSession();
  const router = useRouter();
  const sessionUser = data?.user as SessionUser;
  const prevIsLearning = useRef<LanguageWithFlag[]>(sessionUser?.isLearning);
  // if (prevIsLearning.current && sessionUser.isLearning) {
  //   console.log("PREV", prevIsLearning.current, prevIsLearning.current.length);
  //   console.log("NOW", sessionUser?.isLearning, sessionUser?.isLearning.length);
  // }

  const initialLanguage = sessionUser?.isLearning?.[0]?.name || "FR";
  const [activeLanguage, setActiveLanguage] =
    useState<SupportedLanguage>(initialLanguage);

  useEffect(() => {
    // Check for added languages

    // Check for added languages
    if (sessionUser?.isLearning?.length > prevIsLearning.current.length) {
      // console.log("Added a language");
      const addedLanguages = sessionUser.isLearning.filter(
        (item) => !prevIsLearning.current.includes(item)
      );

      if (addedLanguages.length > 0) {
        setActiveLanguage(addedLanguages[0].name);
        router.push(paths.dashboardLanguagePath(addedLanguages[0].name));
        prevIsLearning.current = sessionUser?.isLearning;
      }
    }

    // Check for removed languages
    if (sessionUser?.isLearning?.length < prevIsLearning.current.length) {
      // console.log("Stopped learning language");
      setActiveLanguage(sessionUser.isLearning[0].name);
      prevIsLearning.current = sessionUser.isLearning;
      router.push(paths.profilePath(sessionUser.usernameSlug));
    }
  }, [sessionUser?.isLearning, sessionUser?.usernameSlug, router]);

  return status === "authenticated" ? (
    <ActiveLanguageContext.Provider
      value={{ activeLanguage, setActiveLanguage }}
    >
      {children}
    </ActiveLanguageContext.Provider>
  ) : null;
};

export const useActiveLanguage = () => {
  const context = useContext(ActiveLanguageContext);
  if (!context)
    throw new Error("ActiveLanguageContext was used outside of its provider!");
  return context;
};
