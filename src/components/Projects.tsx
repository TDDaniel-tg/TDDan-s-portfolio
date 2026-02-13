"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const GRADIENTS = [
    "linear-gradient(135deg, #FF4D00 0%, #FF6B2B 50%, #1a1a2e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #FF4D00 50%, #0A0A0A 100%)",
    "linear-gradient(135deg, #FF6B2B 0%, #1a1a2e 50%, #FF4D00 100%)",
    "linear-gradient(135deg, #0A0A0A 0%, #FF4D00 40%, #1a1a2e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #FF6B2B 60%, #0A0A0A 100%)",
    "linear-gradient(135deg, #FF4D00 0%, #0A0A0A 50%, #FF6B2B 100%)",
    "linear-gradient(135deg, #FF6B2B 0%, #0A0A0A 40%, #1a1a2e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #FF4D00 70%, #FF6B2B 100%)",
];

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.projects;
    const items = t.items[lang];

    useEffect(() => {
        const init = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);

                const section = sectionRef.current;
                if (!section) return;

                const cards = section.querySelectorAll(".project-card");
                cards.forEach((card, i) => {
                    gsap.fromTo(
                        card,
                        { y: 80, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                                toggleActions: "play none none none",
                            },
                            delay: (i % 2) * 0.15,
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
            id="projects"
            data-section="projects"
            className="py-32 lg:py-48 px-6 lg:px-10"
        >
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16 lg:mb-20">
                    <span className="section-number">{t.number}</span>
                    <h2 className="font-display text-section text-text-primary mt-2">
                        {t.label[lang]}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {items.map((project, i) => (
                        <div
                            key={i}
                            className="project-card border-trace group rounded-2xl overflow-hidden"
                            style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            {/* Image placeholder */}
                            <div
                                className="aspect-[16/10] relative overflow-hidden"
                                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-mono text-xs text-white/30">
                                        {`{PROJECT_IMAGE_${i + 1}}`}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 lg:p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="font-mono text-[11px] text-accent tracking-wider py-1 px-3 rounded-full"
                                            style={{ border: "1px solid rgba(255, 77, 0, 0.2)" }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-display text-3xl lg:text-4xl text-text-primary mb-3">
                                    {project.title}
                                </h3>
                                <p className="font-body text-text-secondary text-sm leading-relaxed">
                                    {project.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
