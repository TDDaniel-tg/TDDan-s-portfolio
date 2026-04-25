import { NextResponse } from "next/server";

const FILES_SERVER_URL = process.env.FILES_SERVER_URL || "http://209.74.86.120:5481";

// GET /api/files/[...path] — proxy images from VPS files server
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const filePath = path.join("/");
        
        const res = await fetch(`${FILES_SERVER_URL}/${filePath}`, {
            headers: { "Accept": "image/*" },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const buffer = await res.arrayBuffer();
        const contentType = res.headers.get("content-type") || "image/webp";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=2592000, immutable",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (e) {
        console.error("File proxy error:", e);
        return NextResponse.json({ error: "Proxy error" }, { status: 500 });
    }
}
