"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

interface ProjectData {
    id: string;
    titleEn: string;
    titleRu: string;
    descEn: string;
    descRu: string;
    detailsEn: string;
    detailsRu: string;
    tags: string[];
    price: string;
    link: string;
    visible: boolean;
}

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

const POPUP_TEXT = {
    details: { en: "Project Details", ru: "Подробнее о проекте" },
    tech: { en: "Technologies", ru: "Технологии" },
    price: { en: "Budget", ru: "Бюджет" },
    viewLive: { en: "View Project", ru: "Открыть проект" },
    close: { en: "Close", ru: "Закрыть" },
};

// Fallback — use translations.ts if no DB projects exist
const FALLBACK_PRICES = ["$2,000", "$3,500", "$1,500", "$1,200", "$2,800", "$4,000", "$5,000", "$800"];

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.projects;
    const staticItems = t.items[lang];

    const [dbProjects, setDbProjects] = useState<ProjectData[] | null>(null);
    const [sectionHidden, setSectionHidden] = useState(false);
    const [selectedProject, setSelectedProject] = useState<{
        title: string;
        desc: string;
        details: string;
        tags: string[];
        price: string;
        link: string;
    } | null>(null);

    useEffect(() => {
        // Fetch settings (section visibility)
        fetch("/api/settings")
            .then((r) => r.json())
            .then((s) => {
                if (s.showProjects === false) setSectionHidden(true);
            })
            .catch(() => { });

        // Fetch DB projects
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data: ProjectData[]) => {
                if (Array.isArray(data) && data.length > 0) {
                    setDbProjects(data.filter((p) => p.visible));
                }
            })
            .catch(() => { });
    }, []);

    // Refresh GSAP ScrollTrigger when section visibility changes
    useEffect(() => {
        const refresh = async () => {
            try {
                const { ScrollTrigger } = await import("gsap/ScrollTrigger");
                setTimeout(() => ScrollTrigger.refresh(), 100);
            } catch { }
        };
        refresh();
    }, [sectionHidden]);

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
    }, [dbProjects]);

    // Build items list
    const items = dbProjects
        ? dbProjects.map((p, i) => ({
            title: lang === "en" ? p.titleEn : p.titleRu,
            desc: lang === "en" ? p.descEn : p.descRu,
            details: lang === "en" ? p.detailsEn : p.detailsRu,
            tags: p.tags,
            price: p.price,
            link: p.link,
            gradient: GRADIENTS[i % GRADIENTS.length],
        }))
        : staticItems.map((p, i) => ({
            title: p.title,
            desc: p.desc,
            details: "",
            tags: p.tags,
            price: FALLBACK_PRICES[i] || "",
            link: "",
            gradient: GRADIENTS[i % GRADIENTS.length],
        }));

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                data-section="projects"
                className="py-32 lg:py-48 px-6 lg:px-10"
                style={sectionHidden ? { display: "none" } : undefined}
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
                                className="project-card border-trace group rounded-2xl overflow-hidden cursor-pointer"
                                style={{
                                    background: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    transition: "transform 0.3s, border-color 0.3s",
                                }}
                                onClick={() =>
                                    setSelectedProject({
                                        title: project.title,
                                        desc: project.desc,
                                        details: project.details,
                                        tags: [...project.tags],
                                        price: project.price,
                                        link: project.link,
                                    })
                                }
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.borderColor = "rgba(255, 77, 0, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = "var(--border)";
                                }}
                            >
                                {/* Image placeholder */}
                                <div
                                    className="aspect-[16/10] relative overflow-hidden"
                                    style={{ background: project.gradient }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-mono text-xs text-white/30">
                                            {`{PROJECT_IMAGE_${i + 1}}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6 lg:p-8">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="font-mono text-[11px] text-accent tracking-wider py-1 px-3 rounded-full"
                                                    style={{
                                                        border: "1px solid rgba(255, 77, 0, 0.2)",
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Price badge */}
                                        {project.price && (
                                            <span
                                                className="font-mono text-[12px] font-semibold shrink-0 py-1.5 px-4 rounded-full"
                                                style={{
                                                    background: "rgba(34, 197, 94, 0.1)",
                                                    color: "#22c55e",
                                                    border: "1px solid rgba(34, 197, 94, 0.2)",
                                                }}
                                            >
                                                {project.price}
                                            </span>
                                        )}
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

            {/* Project Popup Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="relative w-full max-w-[700px] mx-4 rounded-2xl overflow-hidden"
                        style={{
                            background: "#0F0F1A",
                            border: "1px solid rgba(255,255,255,0.08)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            animation: "popupIn 0.3s ease-out",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedProject(null)}
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#888",
                                fontSize: "18px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                            }}
                        >
                            ×
                        </button>

                        <div className="p-8 lg:p-10">
                            {/* Title + price */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <h2 className="font-display text-3xl lg:text-4xl text-text-primary">
                                    {selectedProject.title}
                                </h2>
                                {selectedProject.price && (
                                    <span
                                        className="font-mono text-sm font-semibold shrink-0 py-2 px-5 rounded-full"
                                        style={{
                                            background: "rgba(34, 197, 94, 0.1)",
                                            color: "#22c55e",
                                            border: "1px solid rgba(34, 197, 94, 0.2)",
                                        }}
                                    >
                                        {selectedProject.price}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="font-body text-text-secondary text-base leading-relaxed mb-8">
                                {selectedProject.desc}
                            </p>

                            {/* Details */}
                            {selectedProject.details && (
                                <div className="mb-8">
                                    <h4
                                        className="font-mono text-xs tracking-wider mb-3"
                                        style={{ color: "#666" }}
                                    >
                                        {POPUP_TEXT.details[lang]}
                                    </h4>
                                    <p
                                        className="font-body text-[15px] leading-relaxed"
                                        style={{
                                            color: "#bbb",
                                            whiteSpace: "pre-wrap",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.05)",
                                        }}
                                    >
                                        {selectedProject.details}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="mb-8">
                                <h4
                                    className="font-mono text-xs tracking-wider mb-3"
                                    style={{ color: "#666" }}
                                >
                                    {POPUP_TEXT.tech[lang]}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="font-mono text-[12px] text-accent py-1.5 px-4 rounded-full"
                                            style={{
                                                border: "1px solid rgba(255, 77, 0, 0.25)",
                                                background: "rgba(255, 77, 0, 0.06)",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {selectedProject.link && (
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-body font-semibold text-sm"
                                        style={{
                                            padding: "12px 28px",
                                            borderRadius: "12px",
                                            background: "#FF4D00",
                                            color: "#fff",
                                            textDecoration: "none",
                                            transition: "opacity 0.2s",
                                        }}
                                    >
                                        {POPUP_TEXT.viewLive[lang]} →
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="font-body text-sm"
                                    style={{
                                        padding: "12px 28px",
                                        borderRadius: "12px",
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#888",
                                        cursor: "pointer",
                                    }}
                                >
                                    {POPUP_TEXT.close[lang]}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes popupIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
