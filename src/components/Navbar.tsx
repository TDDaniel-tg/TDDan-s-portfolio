"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import LanguageToggle from "./LanguageToggle";

const NAV_ITEMS = ["about", "skills", "projects", "experience", "contact"] as const;

export default function Navbar() {
    const [visible, setVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.nav;

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll("[data-section]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.getAttribute("data-section") || "");
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px" }
        );

        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
                style={{
                    transform: visible ? "translateY(0)" : "translateY(-100%)",
                    opacity: visible ? 1 : 0,
                    backdropFilter: "blur(16px)",
                    background: "rgba(10, 10, 10, 0.8)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#" className="font-display text-2xl text-text-primary tracking-wider">
                        DT
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                className="font-mono text-xs tracking-wider uppercase transition-colors duration-300"
                                style={{
                                    color: activeSection === item ? "var(--accent)" : "var(--text-secondary)",
                                }}
                            >
                                {t[item][lang]}
                            </a>
                        ))}
                        <LanguageToggle />
                        <a
                            href="#contact"
                            className="magnetic-btn text-sm"
                            style={{ padding: "10px 20px" }}
                        >
                            {t.cta[lang]}
                            <span className="arrow">→</span>
                        </a>
                    </div>

                    {/* Mobile: toggle + burger */}
                    <div className="flex md:hidden items-center gap-4">
                        <LanguageToggle />
                        <button
                            className="flex flex-col gap-[5px] w-7"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <span
                                className="block w-full h-[2px] bg-text-primary transition-all duration-300"
                                style={{
                                    transform: mobileOpen ? "rotate(45deg) translateY(3.5px)" : "none",
                                    background: "var(--text-primary)",
                                }}
                            />
                            <span
                                className="block w-full h-[2px] bg-text-primary transition-all duration-300"
                                style={{
                                    transform: mobileOpen ? "rotate(-45deg) translateY(-3.5px)" : "none",
                                    background: "var(--text-primary)",
                                }}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Fullscreen Overlay */}
            <div
                className="fixed inset-0 z-[99] flex items-center justify-center transition-all duration-500 md:hidden"
                style={{
                    opacity: mobileOpen ? 1 : 0,
                    pointerEvents: mobileOpen ? "all" : "none",
                    background: "rgba(10, 10, 10, 0.97)",
                }}
            >
                <div className="flex flex-col items-center gap-8">
                    {NAV_ITEMS.map((item, i) => (
                        <a
                            key={item}
                            href={`#${item}`}
                            onClick={() => setMobileOpen(false)}
                            className="font-display text-4xl text-text-primary transition-all duration-300"
                            style={{
                                transform: mobileOpen ? "translateY(0)" : `translateY(${30 + i * 10}px)`,
                                opacity: mobileOpen ? 1 : 0,
                                transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms",
                            }}
                        >
                            {t[item][lang]}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
