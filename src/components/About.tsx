"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.about;

    useEffect(() => {
        const init = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);

                const section = sectionRef.current;
                if (!section) return;

                // Line-by-line text reveal
                const lines = section.querySelectorAll(".about-line");
                lines.forEach((line) => {
                    gsap.fromTo(
                        line,
                        { opacity: 0.15 },
                        {
                            opacity: 1,
                            duration: 0.6,
                            scrollTrigger: {
                                trigger: line,
                                start: "top 85%",
                                end: "top 60%",
                                scrub: true,
                            },
                        }
                    );
                });

                // Stats counter animation
                const statEls = section.querySelectorAll(".about-stat-value");
                statEls.forEach((el) => {
                    const target = el.getAttribute("data-value") || "0";
                    const numericPart = parseInt(target);
                    const suffix = target.replace(/\d+/, "");

                    gsap.fromTo(
                        el,
                        { innerText: "0" },
                        {
                            innerText: numericPart,
                            duration: 1.5,
                            ease: "power2.out",
                            snap: { innerText: 1 },
                            scrollTrigger: {
                                trigger: el,
                                start: "top 90%",
                                toggleActions: "play none none none",
                            },
                            onUpdate: function () {
                                (el as HTMLElement).textContent =
                                    Math.floor(parseFloat((el as HTMLElement).textContent || "0")) + suffix;
                            },
                        }
                    );
                });

                // Background text parallax
                const bgText = section.querySelector(".about-bg-text");
                if (bgText) {
                    gsap.to(bgText, {
                        y: -80,
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    });
                }
            } catch {
                // Fallback: show everything
            }
        };

        init();
    }, []);

    const paragraphs = t.paragraphs[lang];
    const stats = t.stats[lang];

    return (
        <section
            ref={sectionRef}
            id="about"
            data-section="about"
            className="relative py-32 lg:py-48 px-6 lg:px-10 overflow-hidden"
        >
            {/* Background text */}
            <div
                className="about-bg-text absolute top-[10%] left-[-5%] section-label select-none"
                aria-hidden="true"
            >
                {t.label[lang]}
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
                    {/* Left: Section info */}
                    <div className="lg:col-span-4">
                        <span className="section-number">{t.number}</span>
                        <h2 className="font-display text-section text-text-primary mt-2 mb-8">
                            {t.label[lang]}
                        </h2>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-8 mt-12">
                            {stats.map((stat) => (
                                <div key={stat.label}>
                                    <span
                                        className="about-stat-value font-display text-4xl lg:text-5xl text-accent"
                                        data-value={stat.value}
                                    >
                                        0
                                    </span>
                                    <p className="font-body text-text-secondary text-sm mt-2">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="lg:col-span-8 lg:pt-12">
                        <div className="space-y-8">
                            {paragraphs.map((para, i) => (
                                <p
                                    key={i}
                                    className="about-line font-body text-text-secondary text-lg lg:text-xl leading-relaxed"
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
