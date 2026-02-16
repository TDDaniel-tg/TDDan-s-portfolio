import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET settings
export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
        if (!settings) {
            settings = await prisma.siteSettings.create({ data: { id: "main" } });
        }
        return NextResponse.json(settings);
    } catch (e) {
        console.error("GET /api/settings error:", e);
        return NextResponse.json({ showProjects: true }, { status: 500 });
    }
}

// PATCH settings
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const settings = await prisma.siteSettings.upsert({
            where: { id: "main" },
            update: body,
            create: { id: "main", ...body },
        });
        return NextResponse.json(settings);
    } catch (e) {
        console.error("PATCH /api/settings error:", e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
