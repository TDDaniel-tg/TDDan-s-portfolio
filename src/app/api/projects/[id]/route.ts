import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — update project
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updated = await prisma.project.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updated);
    } catch (e) {
        console.error("PATCH /api/projects/[id] error:", e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

// DELETE
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.project.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE /api/projects/[id] error:", e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
