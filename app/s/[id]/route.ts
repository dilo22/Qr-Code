import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isValidId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function normalizeUrl(url: string | null | undefined) {
  const raw = String(url || "").trim();
  if (!raw) return null;

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(raw)
    ? raw
    : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function parseContent(value: unknown) {
  if (!value) return {};
  if (typeof value === "object") return value as Record<string, unknown>;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return {};
}

function detectDevice(userAgent: string | null) {
  const value = (userAgent || "").toLowerCase();

  if (!value) return null;
  if (/tablet|ipad/.test(value)) return "tablet";
  if (/mobi|android|iphone/.test(value)) return "mobile";
  return "desktop";
}

function buildVisitorKey(ip: string | null, userAgent: string | null) {
  const source = `${ip || "unknown"}|${userAgent || "unknown"}`;
  return createHash("sha256").update(source).digest("hex");
}

async function trackScan(request: Request, qrCodeId: string) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    const { error } = await supabase.from("qr_scans").insert({
      qr_code_id: qrCodeId,
      scanned_at: new Date().toISOString(),
      country: request.headers.get("x-vercel-ip-country"),
      city: request.headers.get("x-vercel-ip-city"),
      device: detectDevice(userAgent),
      visitor_key: buildVisitorKey(ip, userAgent),
    });

    if (error) {
      console.error("Impossible d'enregistrer le scan :", error);
    }
  } catch (error) {
    console.error("Erreur tracking scan :", error);
  }
}

function getString(value: unknown) {
  const text = String(value || "").trim();
  return text || null;
}

function resolveDestination(
  row: { id: string; type: string | null; content: string | null; qr_value: string | null },
  request: Request
) {
  const payload = parseContent(row.content);
  const baseUrl = new URL(request.url).origin;
  const type = String(row.type || "").toLowerCase();

  const directUrl = normalizeUrl(
    getString(payload.url) ||
      getString(payload.fileUrl) ||
      getString(payload.publicUrl) ||
      getString(payload.hostedUrl) ||
      row.content
  );

  const fallbackQrValue = normalizeUrl(row.qr_value);
  switch (type) {
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "app":
    case "review":
      return directUrl || fallbackQrValue;

    case "file":
    case "pdf":
    case "image":
    case "audio":
    case "video":
      return `${baseUrl}/view/${row.id}`;

    case "menu":
      return `${baseUrl}/menu/${row.id}`;

    case "vcard":
      return `${baseUrl}/card/${row.id}`;

    case "location": {
      const latitude = getString(payload.latitude);
      const longitude = getString(payload.longitude);
      const address = getString(payload.address);

      if (latitude && longitude) {
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
      }

      if (address) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      }

      return null;
    }

    case "phone": {
      const phone = getString(payload.phone);
      return phone ? `tel:${phone}` : null;
    }

    case "email": {
      const email = getString(payload.email);
      const subject = getString(payload.subject) || "";
      const body = getString(payload.body) || "";

      if (!email) return null;

      return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    case "sms": {
      const phone = getString(payload.phone);
      const body = getString(payload.message) || getString(payload.body) || "";

      if (!phone) return null;

      return `sms:${phone}?body=${encodeURIComponent(body)}`;
    }

    default:
      return directUrl || fallbackQrValue;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  const { data: row, error } = await supabase
    .from("qr_codes")
    .select("id, type, content, qr_value, status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erreur récupération QR code :", error);
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  if (!row) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  if ((row.status || "active").toLowerCase() !== "active") {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  const destination = resolveDestination(row, request);

  if (!destination) {
    return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });
  }

  await trackScan(request, row.id);

  return NextResponse.redirect(destination);
}
