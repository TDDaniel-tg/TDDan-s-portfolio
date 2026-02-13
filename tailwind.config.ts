import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0A0A0A",
                surface: "#111111",
                border: "#1F1F1F",
                accent: "#FF4D00",
                "accent-warm": "#FF6B2B",
                "text-primary": "#F5F5F5",
                "text-secondary": "#888888",
                "text-muted": "#444444",
            },
            fontFamily: {
                display: ['"Bebas Neue"', "sans-serif"],
                body: ['"Syne"', "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
            },
            fontSize: {
                "hero-xl": ["clamp(64px, 10vw, 140px)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
                "hero-lg": ["clamp(48px, 8vw, 96px)", { lineHeight: "1", letterSpacing: "-0.02em" }],
                "section": ["clamp(36px, 5vw, 72px)", { lineHeight: "1.1" }],
            },
            animation: {
                "spin-slow": "spin 8s linear infinite",
                "marquee-left": "marquee-left 30s linear infinite",
                "marquee-right": "marquee-right 30s linear infinite",
            },
            keyframes: {
                "marquee-left": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "marquee-right": {
                    "0%": { transform: "translateX(-50%)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
