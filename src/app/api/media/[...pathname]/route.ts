import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
) {
  const { pathname } = await params;
  const blobPath = pathname.join("/");

  if (!blobPath || !process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { get } = await import("@vercel/blob");
  const blob = await get(blobPath, {
    access: "private",
    useCache: true,
  });

  if (!blob || blob.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(blob.stream, {
    headers: {
      "content-type": blob.blob.contentType,
      "cache-control": "public, max-age=300",
    },
  });
}
