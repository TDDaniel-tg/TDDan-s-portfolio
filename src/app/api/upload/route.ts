import { NextResponse } from "next/server";

const FILES_SERVER_URL = process.env.FILES_SERVER_URL || "http://209.74.86.120:5481";
const UPLOAD_SECRET = process.env.UPLOAD_SECRET || "";

// POST — proxy upload to files server
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        // Forward to files server
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const res = await fetch(`${FILES_SERVER_URL}/upload`, {
            method: "POST",
            headers: { "x-upload-secret": UPLOAD_SECRET },
            body: uploadForm,
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        // Return proxied URL (avoids mixed-content HTTPS/HTTP issues)
        return NextResponse.json({
            ...data,
            url: `/api/files${data.url}`,
        });
    } catch (e) {
        console.error("Upload proxy error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// DELETE — proxy delete to files server
export async function DELETE(request: Request) {
    try {
        const { filename } = await request.json();

        if (!filename) {
            return NextResponse.json({ error: "No filename" }, { status: 400 });
        }

        const res = await fetch(`${FILES_SERVER_URL}/delete/${filename}`, {
            method: "DELETE",
            headers: { "x-upload-secret": UPLOAD_SECRET },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("Delete proxy error:", e);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
