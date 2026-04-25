import { NextResponse } from "next/server";

// Returns the upload config for the admin panel to upload directly to VPS
export async function GET() {
    return NextResponse.json({
        filesServerUrl: process.env.FILES_SERVER_URL || "http://209.74.86.120:5481",
        uploadSecret: process.env.UPLOAD_SECRET || "",
    });
}
