"use client";

import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Marquee() {
    const { lang } = useLang();
    const items = translations.marquee.items[lang];
    const row = items.join(" · ") + " · ";
    const doubled = row + row;

    return (
        <section className="py-8 border-y overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {/* Row 1 — left */}
            <div className="marquee-track" style={{ animation: "marquee-left 30s linear infinite" }}>
                {[0, 1].map((k) => (
                    <div key={k} className="marquee-item">
                        {doubled}
                    </div>
                ))}
            </div>
            {/* Row 2 — right */}
            <div className="marquee-track mt-4" style={{ animation: "marquee-right 35s linear infinite" }}>
                {[0, 1].map((k) => (
                    <div key={k} className="marquee-item" style={{ color: "var(--accent)", opacity: 0.2 }}>
                        {doubled}
                    </div>
                ))}
            </div>
        </section>
    );
}
