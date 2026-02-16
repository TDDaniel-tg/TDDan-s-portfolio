import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all projects (public — ordered)
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json(projects);
    } catch (e) {
        console.error("GET /api/projects error:", e);
        return NextResponse.json([], { status: 500 });
    }
}

// POST — create new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            titleEn, titleRu, descEn, descRu,
            detailsEn, detailsRu,
            tags, price, link, visible, order,
        } = body;

        if (!titleEn || !titleRu) {
            return NextResponse.json({ error: "Title required" }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                titleEn: titleEn || "",
                titleRu: titleRu || "",
                descEn: descEn || "",
                descRu: descRu || "",
                detailsEn: detailsEn || "",
                detailsRu: detailsRu || "",
                tags: tags || [],
                price: price || "",
                link: link || "",
                visible: visible !== false,
                order: order ?? 0,
            },
        });

        return NextResponse.json(project);
    } catch (e) {
        console.error("POST /api/projects error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
