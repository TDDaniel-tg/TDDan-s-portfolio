"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.experience;
    const items = t.items[lang];

    useEffect(() => {
        const init = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);

                const section = sectionRef.current;
                if (!section) return;

                // Line draw animation
                const line = section.querySelector(".exp-line");
                if (line) {
                    const lineEl = line as SVGPathElement;
                    const length = lineEl.getTotalLength();
                    gsap.set(lineEl, { strokeDasharray: length, strokeDashoffset: length });
                    gsap.to(lineEl, {
                        strokeDashoffset: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 60%",
                            end: "bottom 80%",
                            scrub: 1,
                        },
                    });
                }

                // Content fade in
                const cards = section.querySelectorAll(".exp-card");
                cards.forEach((card) => {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });
            } catch { }
        };

        init();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="experience"
            data-section="experience"
            className="py-32 lg:py-48 px-6 lg:px-10"
        >
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16 lg:mb-20">
                    <span className="section-number">{t.number}</span>
                    <h2 className="font-display text-section text-text-primary mt-2">
                        {t.label[lang]}
                    </h2>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <svg
                        className="absolute left-0 lg:left-8 top-0 bottom-0 w-[2px] h-full"
                        viewBox="0 0 2 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            className="exp-line"
                            d="M1 0 V100"
                            stroke="var(--accent)"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>

                    {/* Experience items */}
                    <div className="space-y-16 pl-8 lg:pl-20">
                        {items.map((item, i) => (
                            <div key={i} className="exp-card relative">
                                {/* Dot on timeline */}
                                <div
                                    className="absolute w-3 h-3 rounded-full -left-8 lg:-left-[52px] top-2"
                                    style={{
                                        background: "var(--accent)",
                                        boxShadow: "0 0 12px rgba(255, 77, 0, 0.3)",
                                    }}
                                />

                                <span className="font-mono text-accent text-xs tracking-wider">
                                    {item.period}
                                </span>
                                <h3 className="font-display text-4xl lg:text-5xl text-text-primary mt-2">
                                    {item.role}
                                </h3>
                                <p className="font-body text-accent text-lg mt-1">
                                    {item.company}
                                </p>
                                <p className="font-body text-text-secondary mt-4 max-w-[600px] leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-6">
                                    {item.stack.map((tech) => (
                                        <span key={tech} className="skill-pill text-xs">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
