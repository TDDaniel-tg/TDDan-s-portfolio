"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Lang } from "./translations";

interface LanguageContextType {
    lang: Lang;
    toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "ru",
    toggleLang: () => { },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("ru");

    const toggleLang = useCallback(() => {
        setLang((prev) => (prev === "en" ? "ru" : "en"));
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
