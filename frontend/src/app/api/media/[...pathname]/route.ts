import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { contentTypeFor, resolveUploadPath } from "@/lib/cms/uploads";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
) {
  const { pathname } = await params;
  const filePath = resolveUploadPath(pathname);

  if (!filePath) return new NextResponse("Not found", { status: 404 });

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "content-type": contentTypeFor(filePath),
        "content-length": String(info.size),
        // Der Dateiname enthält einen Zeitstempel — eine URL zeigt immer auf dieselbe Datei.
        "cache-control": "public, max-age=2592000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
