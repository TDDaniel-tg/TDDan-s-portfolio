"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { useMagnetic } from "@/hooks/useMagnetic";

const PROJECT_TYPES = {
    en: ["Web App", "Telegram Bot", "AI Integration", "Mobile App", "E-Commerce", "Other"],
    ru: ["Веб-приложение", "Telegram бот", "AI интеграция", "Мобильное приложение", "E-Commerce", "Другое"],
};

const BUDGETS = {
    en: ["< $500", "$500 – $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Let's discuss"],
    ru: ["< $500", "$500 – $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Обсудим"],
};

const FORM_TEXT = {
    name: { en: "Your name", ru: "Ваше имя" },
    telegram: { en: "Telegram @username", ru: "Telegram @username" },
    projectType: { en: "Project type", ru: "Тип проекта" },
    budget: { en: "Budget", ru: "Бюджет" },
    description: { en: "Tell me about your project...", ru: "Расскажите о вашем проекте..." },
    send: { en: "Send message", ru: "Отправить" },
    sending: { en: "Sending...", ru: "Отправка..." },
    success: { en: "Message sent! I'll get back to you soon.", ru: "Отправлено! Я свяжусь с вами в ближайшее время." },
    error: { en: "Something went wrong. Try again.", ru: "Что-то пошло не так. Попробуйте ещё раз." },
};

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
    const ref = useMagnetic();
    return (
        <a
            ref={ref as React.RefObject<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link group relative inline-block font-body text-text-primary text-xl lg:text-2xl transition-colors duration-300 hover:text-accent"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />
        </a>
    );
}

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.contact;
    const ft = FORM_TEXT;

    const [form, setForm] = useState({
        name: "",
        telegram: "",
        projectType: "",
        budget: "",
        description: "",
    });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus("success");
                setForm({ name: "", telegram: "", projectType: "", budget: "", description: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);

                const section = sectionRef.current;
                if (!section) return;

                const bgText = section.querySelector(".contact-bg-text");
                if (bgText) {
                    gsap.to(bgText, {
                        y: -100,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    });
                }

                const items = section.querySelectorAll(".contact-reveal");
                items.forEach((item, i) => {
                    gsap.fromTo(
                        item,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            delay: i * 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: section,
                                start: "top 60%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });
            } catch { }
        };
        init();
    }, []);

    const inputStyle: React.CSSProperties = {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "14px 18px",
        color: "var(--text-primary)",
        fontSize: "14px",
        fontFamily: "var(--font-body)",
        outline: "none",
        width: "100%",
        transition: "border-color 0.3s",
    };

    const projectTypes = PROJECT_TYPES[lang];
    const budgets = BUDGETS[lang];

    return (
        <section
            ref={sectionRef}
            id="contact"
            data-section="contact"
            className="relative py-32 lg:py-48 px-6 lg:px-10 overflow-hidden"
        >
            <div
                className="contact-bg-text absolute top-[20%] left-[-5%] section-label select-none"
                aria-hidden="true"
            >
                {t.bgText[lang]}
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="mb-16 lg:mb-20">
                    <span className="section-number">{t.number}</span>
                    <h2 className="font-display text-section text-text-primary mt-2">
                        {t.label[lang]}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                    {/* Left: info & links */}
                    <div className="contact-reveal">
                        <h3 className="font-display text-4xl lg:text-5xl text-text-primary mb-4">
                            {t.heading[lang]}
                        </h3>
                        <p className="font-body text-text-secondary text-lg lg:text-xl max-w-[500px] mb-12">
                            {t.subheading[lang]}
                        </p>

                        <div className="space-y-5">
                            <MagneticLink href={`mailto:${t.email}`}>
                                {t.email}
                            </MagneticLink>
                            <br />
                            <MagneticLink href={`https://t.me/${t.telegram.replace("@", "")}`}>
                                {t.telegram}
                            </MagneticLink>
                            <br />
                            <MagneticLink href={`https://${t.github}`}>
                                {t.github}
                            </MagneticLink>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="contact-reveal">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder={ft.name[lang]}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                                <input
                                    type="text"
                                    placeholder={ft.telegram[lang]}
                                    value={form.telegram}
                                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select
                                    value={form.projectType}
                                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                                    style={{
                                        ...inputStyle,
                                        color: form.projectType ? "var(--text-primary)" : "var(--text-muted)",
                                        appearance: "none",
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 16px center",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                >
                                    <option value="" disabled>
                                        {ft.projectType[lang]}
                                    </option>
                                    {projectTypes.map((pt) => (
                                        <option key={pt} value={pt} style={{ background: "#1a1a2e", color: "#fff" }}>
                                            {pt}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={form.budget}
                                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                    style={{
                                        ...inputStyle,
                                        color: form.budget ? "var(--text-primary)" : "var(--text-muted)",
                                        appearance: "none",
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 16px center",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                >
                                    <option value="" disabled>
                                        {ft.budget[lang]}
                                    </option>
                                    {budgets.map((b) => (
                                        <option key={b} value={b} style={{ background: "#1a1a2e", color: "#fff" }}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <textarea
                                placeholder={ft.description[lang]}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                                rows={5}
                                style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                            />

                            <button
                                type="submit"
                                disabled={sending}
                                className="magnetic-btn text-base w-full sm:w-auto"
                                style={{
                                    padding: "16px 40px",
                                    opacity: sending ? 0.6 : 1,
                                    cursor: sending ? "not-allowed" : "pointer",
                                }}
                            >
                                {sending ? ft.sending[lang] : ft.send[lang]}
                                {!sending && <span className="arrow">→</span>}
                            </button>

                            {status === "success" && (
                                <p className="font-body text-sm" style={{ color: "#22c55e" }}>
                                    ✓ {ft.success[lang]}
                                </p>
                            )}
                            {status === "error" && (
                                <p className="font-body text-sm" style={{ color: "#ef4444" }}>
                                    ✗ {ft.error[lang]}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
