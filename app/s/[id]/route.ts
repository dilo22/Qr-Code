import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseContent(content: string | null) {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function detectDevice(userAgent: string | null) {
  if (!userAgent) return "unknown";

  const ua = userAgent.toLowerCase();

  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

function isHostedFileType(type: string) {
  return ["pdf", "image", "audio", "video"].includes(type);
}

function getRedirectUrl(qr: any, request: NextRequest) {
  const parsedContent = parseContent(qr.content);
  if (!parsedContent) return null;

  if (isHostedFileType(qr.type) && parsedContent.storagePath) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return `${appUrl.replace(/\/$/, "")}/view/${qr.id}`;
  }

  return parsedContent.url || null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("QR FETCH ERROR:", error);
    return new NextResponse("Erreur lors du chargement du QR code.", {
      status: 500,
    });
  }

  if (!qr) {
    return new NextResponse("QR code introuvable.", { status: 404 });
  }

  if (qr.status !== "active") {
    return new NextResponse("Ce QR code est désactivé.", {
      status: 403,
    });
  }

  const redirectUrl = getRedirectUrl(qr, request);

  if (!redirectUrl) {
    return new NextResponse("Aucune destination trouvée.", {
      status: 400,
    });
  }

  const userAgent = request.headers.get("user-agent");
  const device = detectDevice(userAgent);

  let visitorKey = request.cookies.get("visitor_key")?.value;
  if (!visitorKey) {
    visitorKey = randomUUID();
  }

  const { error: scanError } = await supabase.from("qr_scans").insert({
    qr_code_id: qr.id,
    device,
    visitor_key: visitorKey,
  });

  if (scanError) {
    console.error("SCAN INSERT ERROR:", scanError);
  }

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("visitor_key", visitorKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}