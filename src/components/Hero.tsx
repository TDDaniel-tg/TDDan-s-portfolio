"use client";

import { useEffect, useRef } from "react";
import NeuralNetwork from "./NeuralNetwork";
import { useLang } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();
    const t = translations.hero;

    useEffect(() => {
        const animate = async () => {
            try {
                const gsap = (await import("gsap")).default;
                const section = sectionRef.current;
                if (!section) return;

                const tl = gsap.timeline({
                    delay: 2.8,
                    defaults: { ease: "power3.out" },
                });

                tl.fromTo(
                    ".hero-pretitle",
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4 }
                )
                    .fromTo(
                        ".hero-photo",
                        { opacity: 0, x: 40 },
                        { opacity: 1, x: 0, duration: 1.2, ease: "power2.out" },
                        "-=0.2"
                    )
                    .fromTo(
                        ".hero-title-1 span",
                        { y: 100, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.7, stagger: 0.04 },
                        "-=0.9"
                    )
                    .fromTo(
                        ".hero-title-2 span",
                        { y: 100, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.7, stagger: 0.04 },
                        "-=0.4"
                    )
                    .fromTo(
                        ".hero-desc",
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6 },
                        "-=0.3"
                    )
                    .fromTo(
                        ".hero-stat",
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
                        "-=0.2"
                    )
                    .fromTo(
                        ".scroll-indicator",
                        { opacity: 0 },
                        { opacity: 1, duration: 0.5 },
                        "-=0.1"
                    );
            } catch {
                const section = sectionRef.current;
                if (section) {
                    section.querySelectorAll("[style]").forEach((el) => {
                        (el as HTMLElement).style.opacity = "1";
                        (el as HTMLElement).style.transform = "none";
                    });
                }
            }
        };

        animate();
    }, []);

    const splitToSpans = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block" style={{ opacity: 0 }}>
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    const stats = t.stats[lang];
    const descLines = t.desc[lang].split("\n");

    return (
        <section
            ref={sectionRef}
            className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
            data-section="hero"
        >
            <NeuralNetwork />

            {/* Portrait Photo */}
            <div
                className="hero-photo absolute right-0 bottom-0 top-0 hidden lg:flex items-end justify-end pointer-events-none z-[2]"
                style={{ opacity: 0, width: "45%" }}
            >
                <div
                    className="relative h-full w-full"
                    style={{
                        maskImage: "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%), linear-gradient(to top, transparent 0%, black 25%, black 100%)",
                        maskComposite: "intersect",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 30%, black 70%, transparent 100%)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/me.png"
                        alt="Daniel Tashmatov"
                        className="absolute bottom-0 right-0 h-[90%] w-auto object-contain object-bottom"
                        style={{
                            filter: "grayscale(30%) contrast(1.1) brightness(0.7)",
                            mixBlendMode: "luminosity",
                        }}
                    />
                    <div
                        className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(255, 77, 0, 0.12) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
                    <div className="flex-1">
                        <p
                            className="hero-pretitle font-mono text-accent text-sm mb-6 tracking-wider"
                            style={{ opacity: 0 }}
                        >
                            {t.pretitle[lang]}
                        </p>
                        <h1>
                            <span className="hero-title-1 block font-display text-hero-xl text-text-primary leading-[0.9]">
                                {splitToSpans(t.title1[lang])}
                            </span>
                            <span className="hero-title-2 block font-display text-hero-xl text-text-primary leading-[0.9]">
                                {splitToSpans(t.title2[lang])}
                            </span>
                        </h1>
                    </div>

                    <div className="lg:max-w-[340px] lg:pb-4">
                        <p
                            className="hero-desc font-body text-text-secondary text-lg leading-relaxed"
                            style={{ opacity: 0 }}
                        >
                            {descLines.map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < descLines.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                <div className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
                    {stats.map((stat) => (
                        <div key={stat.num} className="hero-stat" style={{ opacity: 0 }}>
                            <span className="section-number">{stat.num}</span>
                            <p className="font-body text-text-primary text-lg mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" style={{ opacity: 0 }}>
                <div className="scroll-text-ring relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                        </defs>
                        <text fill="#888888" fontSize="12" fontFamily="var(--font-mono)" letterSpacing="3">
                            <textPath href="#circlePath">
                                SCROLL · SCROLL · SCROLL · SCROLL ·
                            </textPath>
                        </text>
                    </svg>
                    <div className="scroll-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#888888" strokeWidth="1.5">
                            <path d="M8 2v12M3 9l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
