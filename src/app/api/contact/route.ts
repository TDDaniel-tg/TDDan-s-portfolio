import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, telegram, projectType, budget, description } = body;

        if (!name || !telegram || !description) {
            return NextResponse.json(
                { error: "Имя, Telegram и описание обязательны" },
                { status: 400 }
            );
        }

        const message = await prisma.message.create({
            data: {
                name,
                telegram: telegram.startsWith("@") ? telegram : `@${telegram}`,
                projectType: projectType || "Не указано",
                budget: budget || "Не указано",
                description,
            },
        });

        return NextResponse.json({ success: true, id: message.id });
    } catch (e) {
        console.error("POST /api/contact error:", e);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(messages);
    } catch (e) {
        console.error("GET /api/contact error:", e);
        return NextResponse.json([], { status: 500 });
    }
}
