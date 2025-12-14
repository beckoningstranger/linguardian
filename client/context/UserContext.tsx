"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { LanguageWithFlagAndName } from "@linguardian/shared/contracts";
import { User } from "@linguardian/shared/contracts";
import { usePathname } from "next/navigation";
import { allLanguageFeatures } from "@linguardian/shared/constants";

interface UserContextProps {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    activeLanguage: LanguageWithFlagAndName | null;
    setActiveLanguage: Dispatch<SetStateAction<LanguageWithFlagAndName | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

type UserContextProviderProps = {
    children: ReactNode;
    initialUser?: User | null;
};

export const UserContextProvider = ({
    children,
    initialUser = null,
}: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(initialUser);

    const pathName = usePathname();

    const [activeLanguage, setActiveLanguage] =
        useState<LanguageWithFlagAndName | null>(
            user ? getActiveLanguage(user) : null
        );

    useEffect(() => {
        setUser(initialUser ?? null);
    }, [initialUser]);

    const contextValue = useMemo(
        () => ({ user, setUser, activeLanguage, setActiveLanguage }),
        [user, activeLanguage]
    );

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );

    function getActiveLanguage(user: User): LanguageWithFlagAndName {
        const fromPathName = allLanguageFeatures.find(
            (lang) => lang.langCode === pathName.slice(-2)
        );
        if (fromPathName)
            return {
                name: fromPathName.langName,
                code: fromPathName.langCode,
                flag: fromPathName.flagCode,
            };
        else return user.learnedLanguages[0];
    }
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within its provider!");
    }
    return context;
};
