"use client";

import { useEffect, useRef, useCallback } from "react";

export function useMagnetic(strength: number = 0.3) {
    const ref = useRef<HTMLElement>(null);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const magneticRadius = 80;

            if (distance < magneticRadius) {
                const pull = (1 - distance / magneticRadius) * strength;
                el.style.transform = `translate(${distX * pull}px, ${distY * pull}px)`;
            } else {
                el.style.transform = "translate(0, 0)";
            }
        },
        [strength]
    );

    const handleMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        el.style.transform = "translate(0, 0)";
        setTimeout(() => {
            if (el) el.style.transition = "";
        }, 400);
    }, []);

    useEffect(() => {
        // Don't apply magnetic on touch devices
        if (typeof window !== "undefined" && "ontouchstart" in window) return;

        const el = ref.current;
        if (!el) return;

        const parent = el.parentElement || document;
        parent.addEventListener("mousemove", handleMouseMove as EventListener);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            parent.removeEventListener("mousemove", handleMouseMove as EventListener);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return ref;
}
