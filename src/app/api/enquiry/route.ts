import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16 * 1024; // 16 KB cap against payload floods
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 5;

const rateLimitStore = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  if (rateLimitStore.size > 2000) {
    for (const [k, v] of Array.from(rateLimitStore.entries())) {
      const fresh = v.filter((ts) => now - ts < RATE_WINDOW_MS);
      if (fresh.length === 0) rateLimitStore.delete(k);
    }
  }
  return false;
}

function sanitizeField(val: unknown, maxLength: number): string {
  if (typeof val !== "string") return "";
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many enquiry requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type." }, { status: 415 });
    }

    const rawText = await request.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    let parsed: Record<string, unknown>;
    try {
      const jsonVal = JSON.parse(rawText);
      if (!jsonVal || typeof jsonVal !== "object" || Array.isArray(jsonVal)) {
        return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
      }
      parsed = jsonVal as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Malformed JSON body." }, { status: 400 });
    }

    const honeypot = sanitizeField(parsed._honeypot, 100);
    if (honeypot !== "") {
      return NextResponse.json({ success: true, message: "Received" });
    }

    const name = sanitizeField(parsed.name, 120);
    const contact = sanitizeField(parsed.contact, 120);
    const eventDate = sanitizeField(parsed.eventDate, 40);
    const eventType = sanitizeField(parsed.eventType, 120) || "Wedding Photography";
    const message = sanitizeField(parsed.message, 2000);

    if (name.length < 2 || contact.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid name and contact number or email." },
        { status: 400 }
      );
    }

    console.info("[Enquiry] Logged submission", {
      eventType,
      hasDate: Boolean(eventDate),
      timestamp: new Date().toISOString(),
    });

    // 1. Supabase integration (supports sb_publishable_*, sb_secret_*, and legacy JWT keys)
    const supabaseUrl = (
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ""
    ).replace(/\/+$/, "");
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const sbHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Prefer: "return=minimal",
        };
        // Legacy eyJ... JWT keys require Authorization Bearer; opaque sb_publishable_/sb_secret_ only use apikey
        if (supabaseKey.startsWith("eyJ")) {
          sbHeaders.Authorization = `Bearer ${supabaseKey}`;
        }

        const supabaseRes = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
          method: "POST",
          headers: sbHeaders,
          body: JSON.stringify({
            name,
            contact,
            event_date: eventDate || null,
            event_type: eventType,
            message,
          }),
        });

        if (!supabaseRes.ok) {
          console.error("[Supabase Error] HTTP", supabaseRes.status);
        }
      } catch (sbErr) {
        console.error("[Supabase Exception]", sbErr instanceof Error ? sbErr.message : "unknown");
      }
    }

    // 2. Resend email notification (optional if env variables provided)
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      try {
        const safeSubjectName = name.replace(/[\r\n]/g, " ");
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Enquiries <onboarding@resend.dev>",
            to: [notificationEmail],
            subject: `New Wedding/Event Enquiry from ${safeSubjectName}`,
            html: `
              <h2>New Portfolio Booking Enquiry</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Contact (Phone/Email):</strong> ${escapeHtml(contact)}</p>
              <p><strong>Event Date:</strong> ${escapeHtml(eventDate || "Flexible / Unspecified")}</p>
              <p><strong>Event Type:</strong> ${escapeHtml(eventType)}</p>
              <p><strong>Message:</strong></p>
              <p>${escapeHtml(message || "No additional message provided.")}</p>
            `,
          }),
        });
      } catch (resendErr) {
        console.error("[Resend Exception]", resendErr instanceof Error ? resendErr.message : "unknown");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received. Umer Gill will be in touch shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process enquiry request." },
      { status: 500 }
    );
  }
}
