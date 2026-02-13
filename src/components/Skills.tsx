"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const CATEGORIES = [
    {
        title: "Frontend",
        skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "GSAP", "Three.js", "React Native"],
    },
    {
        title: "Backend",
        skills: ["Python", "Django", "Node.js", "FastAPI", "REST APIs", "WebSockets", "Celery"],
    },
    {
        title: "AI & ML",
        skills: ["GPT-4 / OpenAI", "LangChain", "RAG Systems", "Prompt Engineering", "Computer Vision", "TensorFlow", "Hugging Face"],
    },
    {
        title: "Databases",
        skills: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Prisma", "SQLAlchemy"],
    },
    {
        title: "Tools",
        skills: ["Git / GitHub", "Docker", "Linux / SSH", "Vercel", "Nginx", "CI/CD", "Figma", "VS Code"],
    },
];

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const { lang } = useLang();
    const t = translations.skills;

    useEffect(() => {
        const init = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                gsap.registerPlugin(ScrollTrigger);

                const section = sectionRef.current;
                const line = lineRef.current;
                if (!section || !line) return;

                // Animate the central line growing
                gsap.fromTo(
                    line,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 60%",
                            end: "bottom 80%",
                            scrub: 0.5,
                        },
                    }
                );

                // Animate each branch
                const branches = section.querySelectorAll(".tree-branch");
                branches.forEach((branch, i) => {
                    const isLeft = i % 2 === 0;
                    gsap.fromTo(
                        branch,
                        {
                            opacity: 0,
                            x: isLeft ? -60 : 60,
                        },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: branch,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );

                    // Animate pills inside each branch
                    const pills = branch.querySelectorAll(".skill-pill");
                    gsap.fromTo(
                        pills,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            stagger: 0.05,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: branch,
                                start: "top 80%",
                                toggleActions: "play none none none",
                            },
                        }
                    );

                    // Animate the connector dot
                    const dot = branch.parentElement?.querySelector(".tree-dot");
                    if (dot) {
                        gsap.fromTo(
                            dot,
                            { scale: 0 },
                            {
                                scale: 1,
                                duration: 0.3,
                                ease: "back.out(2)",
                                scrollTrigger: {
                                    trigger: branch,
                                    start: "top 85%",
                                    toggleActions: "play none none none",
                                },
                            }
                        );
                    }
                });
            } catch {
                // Fallback: everything just shows
            }
        };

        init();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="skills"
            data-section="skills"
            className="py-32 lg:py-48 px-6 lg:px-10"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="section-number">{t.number}</span>
                    <h2 className="font-display text-section text-text-primary mt-2">
                        {t.label[lang]}
                    </h2>
                </div>

                {/* Skill Tree */}
                <div className="relative">
                    {/* Central vertical line */}
                    <div
                        ref={lineRef}
                        className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 origin-top"
                        style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-warm), var(--accent))" }}
                    />

                    {/* Branches */}
                    <div className="relative flex flex-col gap-20 lg:gap-32">
                        {CATEGORIES.map((cat, i) => {
                            const isLeft = i % 2 === 0;

                            return (
                                <div key={cat.title} className="relative" style={{ minHeight: "120px" }}>
                                    {/* Connector dot on the center line */}
                                    <div
                                        className="tree-dot absolute left-1/2 top-4 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                                        style={{
                                            background: "var(--accent)",
                                            boxShadow: "0 0 20px rgba(255, 77, 0, 0.4)",
                                        }}
                                    />

                                    {/* Horizontal connector line from dot to branch */}
                                    <div
                                        className="hidden lg:block absolute top-[22px] h-[2px] z-[5]"
                                        style={{
                                            background: "var(--accent)",
                                            opacity: 0.3,
                                            ...(isLeft
                                                ? { right: "calc(50% + 8px)", width: "60px" }
                                                : { left: "calc(50% + 8px)", width: "60px" }),
                                        }}
                                    />

                                    {/* Branch content — positioned on one side */}
                                    <div
                                        className="tree-branch"
                                        style={{
                                            maxWidth: "100%",
                                            paddingLeft: isLeft ? "0" : undefined,
                                            paddingRight: isLeft ? undefined : "0",
                                        }}
                                    >
                                        {/* On mobile: full width. On desktop: half width on proper side */}
                                        <div
                                            className="lg:absolute"
                                            style={{
                                                ...(isLeft
                                                    ? { right: "calc(50% + 40px)", left: "0", textAlign: "right" }
                                                    : { left: "calc(50% + 40px)", right: "0", textAlign: "left" }),
                                            }}
                                        >
                                            {/* Category number + title */}
                                            <div className={`flex items-center gap-3 mb-5 ${isLeft ? "lg:justify-end" : "lg:justify-start"}`}>
                                                <span className="font-mono text-accent text-xs tracking-widest">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <h3 className="font-display text-4xl lg:text-5xl text-text-primary">
                                                    {cat.title}
                                                </h3>
                                            </div>

                                            {/* Skills */}
                                            <div className={`flex flex-wrap gap-2 ${isLeft ? "lg:justify-end" : "lg:justify-start"}`}>
                                                {cat.skills.map((skill) => (
                                                    <span key={skill} className="skill-pill">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom cap */}
                    <div
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                            background: "var(--accent)",
                            boxShadow: "0 0 15px rgba(255, 77, 0, 0.3)",
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
