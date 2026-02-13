"use client";

import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Footer() {
    const { lang } = useLang();
    const t = translations.footer;

    return (
        <footer className="border-t px-6 lg:px-10 py-8" style={{ borderColor: "var(--border)" }}>
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="font-mono text-text-muted text-xs tracking-wider">
                    © {new Date().getFullYear()} Daniel Tashmatov. {t.rights[lang]}
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "#22c55e" }}
                    />
                    <span className="font-mono text-text-secondary text-xs tracking-wider">
                        {t.available[lang]}
                    </span>
                </div>
            </div>
        </footer>
    );
}
