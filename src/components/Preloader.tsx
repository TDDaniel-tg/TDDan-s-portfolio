"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
    const [count, setCount] = useState(0);
    const [status, setStatus] = useState("// initializing...");
    const [phase, setPhase] = useState<"counting" | "name" | "reveal" | "done">("counting");
    const preloaderRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Defer GSAP import
        let gsapModule: any;
        const init = async () => {
            try {
                gsapModule = (await import("gsap")).default;
            } catch {
                // If GSAP not available, skip preloader
                setPhase("done");
                return;
            }

            // Phase 1: Counter 0 → 100
            const duration = 1800; // ms
            const startTime = Date.now();
            let currentVal = 0;

            const counterInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Eased progress
                const eased = 1 - Math.pow(1 - progress, 3);
                currentVal = Math.floor(eased * 100);
                setCount(currentVal);

                // Status text transitions
                if (progress > 0.3 && progress < 0.7) {
                    setStatus("// loading assets...");
                } else if (progress >= 0.7) {
                    setStatus("// ready");
                }

                if (progress >= 1) {
                    clearInterval(counterInterval);
                    setCount(100);
                    setTimeout(() => {
                        setPhase("name");
                    }, 200);
                }
            }, 30);

            return () => clearInterval(counterInterval);
        };

        init();
    }, []);

    useEffect(() => {
        if (phase === "name") {
            const animateName = async () => {
                const gsap = (await import("gsap")).default;
                const nameEl = nameRef.current;
                if (!nameEl) return;

                // Show name, hide counter
                gsap.to(".preloader-counter, .preloader-status", {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.in",
                });

                gsap.set(nameEl, { opacity: 1 });

                // Animate each letter
                const letters = nameEl.querySelectorAll("span");
                gsap.fromTo(
                    letters,
                    {
                        opacity: 0,
                        y: (i: number) => (i % 2 === 0 ? -60 : 60),
                        x: (i: number) => (i % 3 === 0 ? -40 : i % 3 === 1 ? 40 : 0),
                        rotateZ: () => (Math.random() - 0.5) * 20,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        rotateZ: 0,
                        duration: 0.6,
                        stagger: 0.03,
                        ease: "power3.out",
                        onComplete: () => {
                            setTimeout(() => setPhase("reveal"), 400);
                        },
                    }
                );
            };
            animateName();
        }
    }, [phase]);

    useEffect(() => {
        if (phase === "reveal") {
            const doReveal = async () => {
                const gsap = (await import("gsap")).default;
                const el = preloaderRef.current;
                if (!el) return;

                gsap.to(el, {
                    clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                        setPhase("done");
                    },
                });
            };
            doReveal();
        }
    }, [phase]);

    if (phase === "done") return null;

    const nameText = "DANIEL TASHMATOV";

    return (
        <div
            ref={preloaderRef}
            className="preloader"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        >
            <div className="preloader-counter">{String(count).padStart(3, " ")}</div>
            <div className="preloader-status">{status}</div>
            <div ref={nameRef} className="preloader-name">
                {nameText.split("").map((char, i) => (
                    <span
                        key={i}
                        style={{ display: "inline-block", minWidth: char === " " ? "0.3em" : undefined }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}
