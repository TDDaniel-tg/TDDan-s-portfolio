import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const data: Record<string, string> = {};
        if (body.status) data.status = body.status;
        if (body.notes !== undefined) data.notes = body.notes;

        const updated = await prisma.message.update({
            where: { id },
            data,
        });

        return NextResponse.json(updated);
    } catch (e) {
        console.error("PATCH error:", e);
        return NextResponse.json({ error: "Ошибка" }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE error:", e);
        return NextResponse.json({ error: "Ошибка" }, { status: 500 });
    }
}
