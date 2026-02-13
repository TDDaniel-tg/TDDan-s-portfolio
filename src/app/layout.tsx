import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";

export const metadata: Metadata = {
    title: "Daniel Tashmatov — Full-Stack Developer & AI Engineer",
    description:
        "17 y.o. developer from Bishkek. Full-stack & AI engineer with 3+ years of experience. Building products that actually work.",
    keywords: [
        "Full-Stack Developer",
        "AI Engineer",
        "React",
        "Next.js",
        "Python",
        "Machine Learning",
        "Telegram Bots",
        "GPT-4",
        "Portfolio",
    ],
    authors: [{ name: "Daniel Tashmatov" }],
    openGraph: {
        title: "Daniel Tashmatov — Full-Stack Developer & AI Engineer",
        description:
            "17 y.o. developer from Bishkek. Building products that actually work — with AI on a different level.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
