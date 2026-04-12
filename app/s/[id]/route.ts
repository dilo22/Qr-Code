import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isValidId(id: string) {
  return /^[0-9a-fA-F-]{36}$/.test(id);
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

function parsePayload(value: unknown) {
  if (!value) return {};
  if (typeof value === "object") return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return {};
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
    .select("id,type,url,qr_data,content,payload,data,phone,email,subject,body,latitude,longitude,address,is_public,is_active")
    .eq("id", id)
    .eq("is_public", true)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  const payload = parsePayload(row.qr_data ?? row.content ?? row.payload ?? row.data);
  const baseUrl = new URL(request.url).origin;

  const url = row.url ?? payload?.url ?? null;
  const phone = row.phone ?? payload?.phone ?? null;
  const email = row.email ?? payload?.email ?? null;
  const subject = row.subject ?? payload?.subject ?? "";
  const body = row.body ?? payload?.body ?? "";
  const latitude = row.latitude ?? payload?.latitude ?? null;
  const longitude = row.longitude ?? payload?.longitude ?? null;
  const address = row.address ?? payload?.address ?? null;

  switch (row.type) {
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "app":
    case "review": {
      const destination = normalizeUrl(typeof url === "string" ? url : null);
      if (!destination) {
        return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });
      }
      return NextResponse.redirect(destination);
    }

    case "file":
    case "pdf":
    case "image":
    case "audio":
    case "video":
      return NextResponse.redirect(`${baseUrl}/view/${row.id}`);

    case "menu":
      return NextResponse.redirect(`${baseUrl}/menu/${row.id}`);

    case "vcard":
      return NextResponse.redirect(`${baseUrl}/card/${row.id}`);

    case "location":
      if (latitude && longitude) {
        return NextResponse.redirect(`https://www.google.com/maps?q=${latitude},${longitude}`);
      }
      if (address) {
        return NextResponse.redirect(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(address))}`
        );
      }
      return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });

    case "phone":
      if (!phone) {
        return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });
      }
      return NextResponse.redirect(`tel:${String(phone)}`);

    case "email":
      if (!email) {
        return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });
      }
      return NextResponse.redirect(
        `mailto:${String(email)}?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(String(body))}`
      );

    case "sms":
      if (!phone) {
        return NextResponse.json({ error: "Ressource invalide" }, { status: 404 });
      }
      return NextResponse.redirect(
        `sms:${String(phone)}?body=${encodeURIComponent(String(body || payload?.message || ""))}`
      );

    default:
      return NextResponse.json({ error: "Type non pris en charge" }, { status: 400 });
  }
}