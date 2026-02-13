"use client";

import { useCallback } from "react";

interface SplitResult {
    chars: string[];
    words: string[];
}

export function splitTextToChars(text: string): string[] {
    return text.split("");
}

export function splitTextToWords(text: string): string[] {
    return text.split(/\s+/).filter(Boolean);
}

export function useSplitText() {
    const wrapChars = useCallback((text: string) => {
        return text.split("").map((char, i) => (
            `<span class="char-wrap"><span style="display:inline-block" data-char="${i}">${char === " " ? "&nbsp;" : char}</span></span>`
        )).join("");
    }, []);

    const wrapWords = useCallback((text: string) => {
        return text.split(/\s+/).filter(Boolean).map((word, i) => (
            `<span class="word-wrap"><span style="display:inline-block" data-word="${i}">${word}</span></span>`
        )).join(" ");
    }, []);

    const wrapLines = useCallback((lines: string[]) => {
        return lines.map((line, i) => (
            `<div class="line-reveal"><span style="display:inline-block" data-line="${i}">${line}</span></div>`
        ));
    }, []);

    return { wrapChars, wrapWords, wrapLines };
}
