"use client";

import { useLang } from "@/i18n/LanguageContext";

export default function LanguageToggle() {
    const { lang, toggleLang } = useLang();

    return (
        <button
            onClick={toggleLang}
            className="relative flex items-center gap-0 rounded-full border overflow-hidden"
            style={{
                borderColor: "var(--border)",
                height: "32px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                fontWeight: 600,
            }}
            aria-label="Toggle language"
        >
            <span
                className="relative z-10 px-3 py-1 transition-colors duration-300"
                style={{ color: lang === "ru" ? "#fff" : "var(--text-secondary)" }}
            >
                RU
            </span>
            <span
                className="relative z-10 px-3 py-1 transition-colors duration-300"
                style={{ color: lang === "en" ? "#fff" : "var(--text-secondary)" }}
            >
                EN
            </span>
            {/* Active pill */}
            <span
                className="absolute top-0 bottom-0 rounded-full transition-all duration-300 ease-out"
                style={{
                    background: "var(--accent)",
                    width: "50%",
                    left: lang === "ru" ? "0" : "50%",
                }}
            />
        </button>
    );
}
