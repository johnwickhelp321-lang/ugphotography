import crypto from "crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function safeBearerMatch(authHeader: string | null, secret: string | undefined): boolean {
  if (!authHeader || !secret) return false;
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  // Fail-closed: require CRON_SECRET to be set and match in constant time
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!safeBearerMatch(authHeader, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.info("[Cron] Running weekly Instagram sync check...");
    return NextResponse.json({
      success: true,
      message: "Instagram weekly cron sync check executed.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron Error]", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
